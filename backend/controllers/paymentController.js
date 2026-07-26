const SSLCommerzPayment = require("sslcommerz-lts");
const Investment = require("../models/Investment");

const initiatePayment = async (req, res) => {
  try {
    const { investment_id, amount } = req.body;

    const investorId = req.user.id;
    const role = req.user.role;

    // Only investors can initiate payment
    if (role !== "investor") {
      return res.status(403).json({
        message: "Only investors can initiate payments",
      });
    }

    // Basic validation
    if (!investment_id || !amount) {
      return res.status(400).json({
        message: "Investment ID and amount are required",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Payment amount must be greater than zero",
      });
    }

    // Unique transaction ID
    const transactionId = `AGRO-${investment_id}-${Date.now()}`;

    const paymentData = {
      total_amount: Number(amount),
      currency: "BDT",
      tran_id: transactionId,

      success_url: "http://localhost:5000/api/payments/success",
      fail_url: "http://localhost:5000/api/payments/fail",
      cancel_url: "http://localhost:5000/api/payments/cancel",
      ipn_url: "http://localhost:5000/api/payments/ipn",

      shipping_method: "NO",

      product_name: `AgroInvest Project Investment`,
      product_category: "Investment",
      product_profile: "general",

      cus_name: req.user.full_name || "AgroInvest Investor",
      cus_email: req.user.email || "investor@agroinvest.com",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1207",
      cus_country: "Bangladesh",
      cus_phone: "01700000000",
      cus_fax: "01700000000",

      ship_name: req.user.full_name || "AgroInvest Investor",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: "1207",
      ship_country: "Bangladesh",

      value_a: String(investment_id),
      value_b: String(investorId),
      value_c: transactionId,
      value_d: "AgroInvest",
    };

    const sslcommerz = new SSLCommerzPayment(
      process.env.SSLCOMMERZ_STORE_ID,
      process.env.SSLCOMMERZ_STORE_PASSWORD,
      process.env.SSLCOMMERZ_IS_LIVE === "true"
    );

    const apiResponse = await sslcommerz.init(paymentData);

    if (!apiResponse?.GatewayPageURL) {
      return res.status(500).json({
        message: "Could not create SSLCommerz payment session",
      });
    }

    return res.status(200).json({
      message: "Payment session created successfully",
      transaction_id: transactionId,
      payment_url: apiResponse.GatewayPageURL,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);

    return res.status(500).json({
      message: "Payment initiation failed",
    });
  }
};

const paymentSuccess = (req, res) => {
  const investmentId = req.body.value_a;

  Investment.updatePaymentStatus(
    investmentId,
    "completed",
    (error) => {
      if (error) {
        console.error(error);

        return res.status(500).send("Payment status update failed.");
      }

      return res.send("✅ Payment Successful!");
    }
  );
};

const paymentFail = (req, res) => {
  const investmentId = req.body.value_a;

  Investment.updatePaymentStatus(
    investmentId,
    "failed",
    (error) => {
      if (error) {
        console.error(error);

        return res.status(500).send("Payment status update failed.");
      }

      return res.send("❌ Payment Failed!");
    }
  );
};

const paymentCancel = (req, res) => {
  const investmentId = req.body.value_a;

  Investment.updatePaymentStatus(
    investmentId,
    "failed",
    (error) => {
      if (error) {
        console.error(error);

        return res.status(500).send("Payment status update failed.");
      }

      return res.send("⚠️ Payment Cancelled!");
    }
  );
};

module.exports = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
};