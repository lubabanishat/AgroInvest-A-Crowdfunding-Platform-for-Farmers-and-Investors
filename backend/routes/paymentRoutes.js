const express = require("express");

const {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
} = require("../controllers/paymentController");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Initiate SSLCommerz Payment
router.post("/initiate", verifyToken, initiatePayment);

// Payment Success Callback
router.post("/success", paymentSuccess);

// Payment Fail Callback
router.post("/fail", paymentFail);

// Payment Cancel Callback
router.post("/cancel", paymentCancel);

module.exports = router;