import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import axios from 'axios';
import crypto from 'crypto';

// Generate unique transaction ref
const generateTxRef = () => `tx_${crypto.randomBytes(8).toString("hex")}`;

// ✅ Single course checkout
export const checkout = async (req, res) => {
  const { courseId, coupon } = req.body;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const enrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (!enrollment) return res.status(400).json({ message: "Not enrolled" });

    const user = await User.findById(req.user.id);
    if (!user?.email) return res.status(400).json({ message: "User email not found" });

    let amount = course.price;
    if (coupon === "DISC20") amount *= 0.8;

    const tx_ref = generateTxRef();

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: String(amount),
        currency: "ETB",
        email: user.email,
        first_name: user.name?.split(" ")[0] || "Student",
        last_name: user.name?.split(" ")[1] || "User",
        tx_ref,
        callback_url: "http://localhost:5000/api/payments/verify/callback",
        return_url: "http://localhost:3000/payment/success",
      },
      { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` } }
    );

    const payment = new Payment({
      enrollment: enrollment._id,
      amount,
      instructorShare: amount * 0.7,
      currency: "ETB",
      status: "pending",
      transactionId: tx_ref,
      paymentMethod: "chapa",
    });
    await payment.save();

    res.json({
      checkout_url: response.data.data.checkout_url,
      tx_ref,
      amount,
    });
  } catch (err) {
    console.error("Checkout Error:", err.response?.data || err.message);
    res.status(500).json({ message: err.response?.data || err.message });
  }
};

// ✅ Cart checkout
export const createCartPayment = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: "Cart items are required" });

    const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const user = await User.findById(req.user.id);
    if (!user?.email) return res.status(400).json({ message: "User email not found" });

    const tx_ref = generateTxRef();

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: String(totalAmount),
        currency: "ETB",
        email: user.email,
        first_name: user.name?.split(" ")[0] || "Student",
        last_name: user.name?.split(" ")[1] || "User",
        tx_ref,
        callback_url: "http://localhost:5000/api/payments/verify/callback",
        return_url: "http://localhost:3000/payment/success",
      },
      { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` } }
    );

    const payment = new Payment({
      enrollment: null,
      amount: totalAmount,
      currency: "ETB",
      status: "pending",
      transactionId: tx_ref,
      paymentMethod: "chapa",
    });
    await payment.save();

    res.json({
      checkout_url: response.data.data.checkout_url,
      tx_ref,
      totalAmount,
    });
  } catch (err) {
    console.error("Cart Payment Error:", err.response?.data || err.message);
    res.status(500).json({ message: err.response?.data || err.message });
  }
};

// ✅ Manual verification (POST)
export const verifyPayment = async (req, res) => {
  const { tx_ref } = req.body;
  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` } }
    );

    const payment = await Payment.findOne({ transactionId: tx_ref });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = response.data.data.status === "success" ? "completed" : "failed";
    await payment.save();

    if (payment.status === "completed" && payment.enrollment) {
      const enrollment = await Enrollment.findById(payment.enrollment);
      enrollment.paymentStatus = "completed";
      await enrollment.save();
    }

    res.json({ message: "Payment verified", status: payment.status, chapaResponse: response.data.data });
  } catch (err) {
    console.error("Verify Payment Error:", err.response?.data || err.message);
    res.status(500).json({ message: err.response?.data || err.message });
  }
};

// ✅ Chapa callback (GET)
export const chapaCallback = async (req, res) => {
  try {
    const { tx_ref } = req.query;
    if (!tx_ref) return res.status(400).send("Missing tx_ref");

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      { headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` } }
    );

    const payment = await Payment.findOne({ transactionId: tx_ref });
    if (!payment) return res.status(404).send("Payment not found");

    payment.status = response.data.data.status === "success" ? "completed" : "failed";
    await payment.save();

    if (payment.status === "completed" && payment.enrollment) {
      const enrollment = await Enrollment.findById(payment.enrollment);
      enrollment.paymentStatus = "completed";
      await enrollment.save();
    }

    // Redirect user to frontend
    res.redirect("http://localhost:3000/payment/success");
  } catch (err) {
    console.error("Chapa Callback Error:", err.response?.data || err.message);
    res.status(500).send("Payment verification failed");
  }
};
