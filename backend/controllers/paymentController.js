const SSLCommerzPayment = require("sslcommerz-lts");
const Investment = require("../models/Investment");

const storeId = process.env.SSLCOMMERZ_STORE_ID;
const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
const isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";

const createSSLCommerzInstance = () => {
  return new SSLCommerzPayment(
    storeId,
    storePassword,
    isLive
  );
};

const getBaseUrl = () => {
  return process.env.BACKEND_URL || "http://localhost:5000";
};

const updatePaymentStatusPromise = (
  investmentId,
  paymentStatus
) => {
  return new Promise((resolve, reject) => {
    Investment.updatePaymentStatus(
      investmentId,
      paymentStatus,
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );
  });
};

const getInvestmentForPaymentPromise = (
  investmentId,
  investorId
) => {
  return new Promise((resolve, reject) => {
    Investment.getInvestmentForPayment(
      investmentId,
      investorId,
      (error, results) => {
        if (error) {
          return reject(error);
        }

        resolve(results[0]);
      }
    );
  });
};

const initiatePayment = async (req, res) => {
  try {
    const { investment_id, amount } = req.body;

    const investorId = req.user.id;
    const role = req.user.role;

    if (!storeId || !storePassword) {
      return res.status(500).json({
        message:
          "SSLCommerz credentials are missing from environment variables",
      });
    }

    if (role !== "investor") {
      return res.status(403).json({
        message: "Only investors can initiate payments",
      });
    }

    if (
      investment_id === undefined ||
      investment_id === null ||
      amount === undefined ||
      amount === null
    ) {
      return res.status(400).json({
        message: "Investment ID and amount are required",
      });
    }

    const numericInvestmentId = Number(investment_id);
    const requestedAmount = Number(amount);

    if (
      !Number.isInteger(numericInvestmentId) ||
      numericInvestmentId <= 0
    ) {
      return res.status(400).json({
        message: "Invalid investment ID",
      });
    }

    if (
      !Number.isFinite(requestedAmount) ||
      requestedAmount <= 0
    ) {
      return res.status(400).json({
        message: "Payment amount must be greater than zero",
      });
    }

    const investment =
      await getInvestmentForPaymentPromise(
        numericInvestmentId,
        investorId
      );

    if (!investment) {
      return res.status(404).json({
        message: "Investment not found for this investor",
      });
    }

    if (investment.payment_status === "completed") {
      return res.status(409).json({
        message:
          "Payment for this investment is already completed",
      });
    }

    const databaseAmount = Number(investment.amount);

    if (
      Math.abs(requestedAmount - databaseAmount) > 0.001
    ) {
      return res.status(400).json({
        message:
          "Payment amount does not match the investment amount",
        expected_amount: databaseAmount,
      });
    }

    const transactionId =
      `AGRO-${investment.id}-${Date.now()}`;

    const baseUrl = getBaseUrl();

    const paymentData = {
      total_amount: databaseAmount,
      currency: "BDT",
      tran_id: transactionId,

      success_url:
        `${baseUrl}/api/payments/success`,

      fail_url:
        `${baseUrl}/api/payments/fail`,

      cancel_url:
        `${baseUrl}/api/payments/cancel`,

      ipn_url:
        `${baseUrl}/api/payments/ipn`,

      shipping_method: "NO",

      product_name:
        "AgroInvest Project Investment",

      product_category: "Investment",
      product_profile: "general",

      cus_name:
        req.user.full_name ||
        "AgroInvest Investor",

      cus_email:
        req.user.email ||
        "investor@agroinvest.com",

      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1207",
      cus_country: "Bangladesh",
      cus_phone: "01700000000",
      cus_fax: "01700000000",

      ship_name:
        req.user.full_name ||
        "AgroInvest Investor",

      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: "1207",
      ship_country: "Bangladesh",

      value_a: String(investment.id),
      value_b: String(investorId),
      value_c: transactionId,
      value_d: String(investment.project_id),
    };

    const sslcommerz =
      createSSLCommerzInstance();

    const apiResponse =
      await sslcommerz.init(paymentData);

    console.log(
      "SSLCommerz initiation response:",
      apiResponse
    );

    if (!apiResponse?.GatewayPageURL) {
      return res.status(500).json({
        message:
          "Could not create SSLCommerz payment session",

        sslcommerz_message:
          apiResponse?.failedreason ||
          apiResponse?.status ||
          apiResponse?.message ||
          "No GatewayPageURL was returned",
      });
    }

    return res.status(200).json({
      message:
        "Payment session created successfully",

      transaction_id: transactionId,
      payment_url: apiResponse.GatewayPageURL,
    });
  } catch (error) {
    console.error(
      "Payment initiation error:",
      error
    );

    return res.status(500).json({
      message: "Payment initiation failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

const paymentSuccess = async (req, res) => {
  try {
    console.log("Payment success request method:", req.method);
    console.log("Payment success body:", req.body);
    console.log("Payment success query:", req.query);

    const callbackData = req.body || req.query || {};

    const {
      value_a: investmentId,
      val_id: validationId,
      tran_id: transactionId,
    } = callbackData;

    if (!investmentId || !validationId) {
      return res.status(400).send(
        "Invalid payment callback data."
      );
    }

    const sslcommerz =
      createSSLCommerzInstance();

    const validationResponse =
      await sslcommerz.validate({
        val_id: validationId,
      });

    console.log(
      "SSLCommerz validation response:",
      validationResponse
    );

    const validStatus =
      validationResponse?.status === "VALID" ||
      validationResponse?.status === "VALIDATED";

    if (!validStatus) {
      await updatePaymentStatusPromise(
        investmentId,
        "failed"
      );

      return res.status(400).send(
        "Payment validation failed."
      );
    }

    if (
      transactionId &&
      validationResponse.tran_id !== transactionId
    ) {
      await updatePaymentStatusPromise(
        investmentId,
        "failed"
      );

      return res.status(400).send(
        "Transaction ID verification failed."
      );
    }

    await updatePaymentStatusPromise(
      investmentId,
      "completed"
    );

    return res.send(
      "Payment Successful!"
    );
  } catch (error) {
    console.error(
      "Payment success callback error:",
      error
    );

    return res.status(500).send(
      "Payment validation or status update failed."
    );
  }
};

const paymentFail = async (req, res) => {
  try {
    const investmentId = req.body.value_a;

    if (!investmentId) {
      return res.status(400).send(
        "Invalid payment callback data."
      );
    }

    await updatePaymentStatusPromise(
      investmentId,
      "failed"
    );

    return res.send(
      "Payment Failed!"
    );
  } catch (error) {
    console.error(
      "Payment fail callback error:",
      error
    );

    return res.status(500).send(
      "Payment status update failed."
    );
  }
};

const paymentCancel = async (req, res) => {
  try {
    const investmentId = req.body.value_a;

    if (!investmentId) {
      return res.status(400).send(
        "Invalid payment callback data."
      );
    }

    await updatePaymentStatusPromise(
      investmentId,
      "failed"
    );

    return res.send(
      "Payment Cancelled!"
    );
  } catch (error) {
    console.error(
      "Payment cancel callback error:",
      error
    );

    return res.status(500).send(
      "Payment status update failed."
    );
  }
};

const paymentIPN = async (req, res) => {
  try {
    const {
      value_a: investmentId,
      val_id: validationId,
    } = req.body;

    if (!investmentId || !validationId) {
      return res.status(400).json({
        message: "Invalid IPN data",
      });
    }

    const sslcommerz =
      createSSLCommerzInstance();

    const validationResponse =
      await sslcommerz.validate({
        val_id: validationId,
      });

    console.log(
      "SSLCommerz IPN validation:",
      validationResponse
    );

    const validStatus =
      validationResponse?.status === "VALID" ||
      validationResponse?.status === "VALIDATED";

    if (!validStatus) {
      await updatePaymentStatusPromise(
        investmentId,
        "failed"
      );

      return res.status(400).json({
        message: "Invalid payment notification",
      });
    }

    await updatePaymentStatusPromise(
      investmentId,
      "completed"
    );

    return res.status(200).json({
      message:
        "Payment notification processed successfully",
    });
  } catch (error) {
    console.error(
      "Payment IPN error:",
      error
    );

    return res.status(500).json({
      message:
        "Payment notification processing failed",
    });
  }
};

module.exports = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
};