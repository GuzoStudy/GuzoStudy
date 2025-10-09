// src/controllers/paymentController.js
import Enrollment from "../models/Enrollment.js";
import Payment from "../models/Payment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import AuditLog from "../models/AuditLog.js";
import axios from "axios";
import crypto from "crypto";
import { body, validationResult, param } from 'express-validator';
import { auth, requireRole } from '../middlewares/auth.js'; // Assume auth and role middleware

/* ----------------------------------------
   🔒 VALIDATION & CONFIG
---------------------------------------- */
// Validate required environment variables at startup
const requiredEnvVars = ['CHAPA_SECRET_KEY', 'BASE_URL', 'FRONTEND_URL'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ FATAL: Missing required env var: ${envVar}`);
    throw new Error(`Server misconfiguration: ${envVar} is not set`);
  }
}

// ✅ FIXED: Removed trailing spaces in Chapa base URL
const CHAPA_BASE_URL = "https://api.chapa.co/v1/transaction";
const VALID_COUPONS = new Map([
  ["DISC20", 0.8], // 20% off
]);

/* ----------------------------------------
   ✅ HELPERS
---------------------------------------- */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const generateTxRef = () => `tx_${crypto.randomBytes(12).toString("hex")}`;

/* ----------------------------------------
   ✅ SINGLE COURSE CHECKOUT
---------------------------------------- */
export const checkout = [
  auth,
  requireRole(['student']),
  body('courseId').isMongoId().withMessage('Valid course ID required'),
  body('coupon').optional().trim(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { courseId, coupon } = req.body;

    try {
      // 🔹 Fetch course with query filter
      console.log('Fetching course:', { courseId });
      const course = await Course.findOne(
        { _id: courseId, isDeleted: false, status: 'published' }, // Query filter
        'title pricing instructor' // Projection (only needed fields)
      ).populate('instructor', 'fullName email');
      
      if (!course) {
        console.log('Course not found or not published:', { courseId });
        return res.status(404).json({ message: 'Course not found or not published' });
      }
      
      if (course.pricing.basePrice <= 0) {
        console.log('Invalid course price:', { courseId, basePrice: course.pricing.basePrice });
        return res.status(400).json({ message: 'Course price is invalid' });
      }
      
      if (!course.title?.trim()) {
        console.log('Course title missing:', { courseId });
        return res.status(400).json({ message: 'Course title is missing' });
      }

      // 🔹 Fetch user
      console.log('Fetching user:', { userId: req.user._id });
      const user = await User.findById(req.user._id, { isDeleted: false });
      if (!user || !isValidEmail(user.email)) {
        console.log('Invalid user or email:', { userId: req.user._id, email: user?.email });
        return res.status(400).json({ message: 'Valid user email is required' });
      }

      // 🔹 Check existing enrollment
      const existingEnrollment = await Enrollment.findOne({ 
        user: req.user._id, 
        course: courseId, 
        isActive: true, 
        isDeleted: false 
      });
      if (existingEnrollment) {
        console.log('Already enrolled:', { userId: req.user._id, courseId });
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }

      // 🔹 Calculate amount with coupon
      let amount = course.pricing.currentPrice || course.pricing.basePrice;
      let discount = 0;
      if (coupon) {
        const discountRate = VALID_COUPONS.get(coupon);
        if (discountRate === undefined) {
          console.log('Invalid coupon:', { coupon });
          return res.status(400).json({ message: 'Invalid coupon code' });
        }
        discount = amount * (1 - discountRate);
        amount = amount * discountRate;
      }

      // 🔹 Generate transaction reference
      const tx_ref = generateTxRef();
      console.log('Generated tx_ref:', { tx_ref });

      // 🔹 Calculate instructor/platform share upfront
      const instructorShare = parseFloat((amount * 0.7).toFixed(2));
      const platformShare = parseFloat((amount * 0.3).toFixed(2));

      // 🔹 Create payment record
      console.log('Creating payment:', { courseId, amount, tx_ref });
      const paymentDoc = await Payment.create({
        enrollment: null,
        user: user._id,
        course: course._id,
        type: 'single',
        amount: parseFloat(amount.toFixed(2)),
        originalAmount: course.pricing.basePrice,
        discount: parseFloat(discount.toFixed(2)),
        instructorShare,
        platformShare,
        instructor: course.instructor?._id,
        currency: 'ETB',
        status: 'pending',
        transactionId: tx_ref,
        paymentMethod: 'chapa',
        coupon: coupon || undefined,
        createdBy: req.user._id
      });

      // 🔹 Build URLs safely
      const baseUrl = process.env.BASE_URL;
      const frontendUrl = process.env.FRONTEND_URL;
      let callbackUrl, returnUrl;
      try {
        callbackUrl = new URL('/api/payments/verify/callback', baseUrl).href;
        returnUrl = new URL('/payment/success', frontendUrl).href;
      } catch (urlErr) {
        console.error('URL error:', urlErr.message);
        await Payment.findByIdAndDelete(paymentDoc._id);
        return res.status(500).json({ message: 'Invalid server URL configuration' });
      }

      // 🔹 Initialize Chapa payment
      const chapaPayload = {
        amount: amount.toFixed(2),
        currency: 'ETB',
        email: user.email,
        first_name: (user.firstName?.trim() || 'Student').substring(0, 30),
        last_name: (user.lastName?.trim() || 'User').substring(0, 30),
        tx_ref,
        callback_url: callbackUrl,
        return_url: returnUrl,
        customization: {
          title: (`Payment ${course.title}`).substring(0, 16),
          description: course.title.replace(/[^a-zA-Z0-9\s._-]/g, '').substring(0, 100)
        }
      };

      console.log('Sending Chapa request:', chapaPayload);
      const chapaResponse = await axios.post(
        `${CHAPA_BASE_URL}/initialize`,
        chapaPayload,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      // Audit log for checkout initiation
      await AuditLog.create({
        action: 'payment_initiated',
        targetId: paymentDoc._id,
        targetModel: 'Payment',
        metadata: { course: courseId, amount, tx_ref },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      console.log('Payment initialized:', { paymentId: paymentDoc._id, checkoutUrl: chapaResponse.data.data.checkout_url });
      res.status(201).json({
        checkout_url: chapaResponse.data.data.checkout_url,
        tx_ref,
        amount: paymentDoc.amount,
        currency: 'ETB'
      });

    } catch (err) {
      console.error('🔴 Checkout Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      if (err.response?.status === 400) {
        return res.status(400).json({ message: 'Invalid payment request' });
      }
      res.status(500).json({ message: 'Payment initialization failed. Please try again.' });
    }
  }
];
/* ----------------------------------------
   ✅ VERIFY PAYMENT (Manual POST)
---------------------------------------- */
export const verifyPayment = [
  auth,
  requireRole(['student', 'admin', 'superadmin']),
  body('tx_ref').trim().notEmpty().withMessage('Transaction reference required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { tx_ref } = req.body;

    try {
      const chapaResponse = await axios.get(
        `${CHAPA_BASE_URL}/verify/${tx_ref}`,
        {
          headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
          timeout: 10000
        }
      );

      const payment = await Payment.findOne({ transactionId: tx_ref, isDeleted: false });
      if (!payment) {
        return res.status(404).json({ message: 'Payment record not found' });
      }

      const chapaStatus = chapaResponse.data.data?.status;
      const newStatus = chapaStatus === "success" ? "completed" : "failed";
      
      payment.status = newStatus;
      payment.gateway.response = chapaResponse.data.data;
      payment.updatedBy = req.user._id;
      await payment.save();

      if (newStatus === "completed") {
        await handleSuccessfulPayment(payment);
      }

      // Audit log
      await AuditLog.create({
        action: 'payment_verified',
        targetId: payment._id,
        targetModel: 'Payment',
        metadata: { tx_ref, status: newStatus, chapaStatus },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.json({
        message: 'Payment verified',
        status: payment.status,
        amount: payment.amount
      });

    } catch (err) {
      console.error("🔴 Verify Payment Error:", {
        message: err.message,
        response: err.response?.data,
        tx_ref
      });

      if (err.response?.status === 404) {
        return res.status(404).json({ message: 'Transaction not found at payment gateway' });
      }
      res.status(500).json({ message: 'Payment verification failed' });
    }
  }
];

/* ----------------------------------------
   ✅ CHAPA CALLBACK (Webhook)
---------------------------------------- */
export const chapaCallback = async (req, res) => {
  try {
    console.log("🌍 Incoming callback query:", req.query);
    console.log("🌍 Incoming callback body:", req.body);

    const tx_ref =
      req.query.tx_ref ||
      req.query.trx_ref ||
      req.query.reference ||
      req.body.tx_ref ||
      req.body.trx_ref ||
      req.body.reference;

    if (!tx_ref) {
      console.warn("⚠️ Chapa callback missing tx_ref");
      return res.status(400).send("Missing transaction reference");
    }

    // ✅ Verify transaction with Chapa
    const chapaResponse = await axios.get(`${CHAPA_BASE_URL}/verify/${tx_ref}`, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
      timeout: 10000
    });

    const chapaData = chapaResponse.data?.data;
    const newStatus = chapaData?.status === "success" ? "completed" : "failed";

    // ✅ Find payment(s) — usually one, but safe to find all
    const payments = await Payment.find({ transactionId: tx_ref, isDeleted: false });

    if (!payments || payments.length === 0) {
      console.error(`❌ No payments found for tx_ref: ${tx_ref}`);
      return res.status(404).send("Payment record not found");
    }

    console.log(`🧾 ${payments.length} payment(s) found for tx_ref ${tx_ref}`);

    for (const payment of payments) {
      if (payment.status === newStatus) continue; // Idempotent

      payment.status = newStatus;
      payment.gateway.response = chapaData;
      payment.updatedBy = null; // Webhook, no user
      await payment.save();

      if (newStatus === "completed") {
        if (payment.type === 'single') {
          if (!payment.course) {
            console.error(`❌ Single-type payment ${payment._id} missing course`);
            continue;
          }
          await handleSuccessfulPayment(payment); // ✅ no courseId → uses payment.course
        } 
        else if (payment.type === 'cart') {
          if (!payment.courses || payment.courses.length === 0) {
            console.error(`❌ Cart-type payment ${payment._id} missing courses`);
            continue;
          }
          for (const courseId of payment.courses) {
            await handleSuccessfulPayment(payment, courseId); // ✅ pass real doc + courseId
          }
        }
      }

      // Audit log
      await AuditLog.create({
        action: 'payment_webhook',
        targetId: payment._id,
        targetModel: 'Payment',
        metadata: { tx_ref, status: newStatus, chapaStatus: chapaData.status },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: null // Webhook
      });
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/success?tx_ref=${tx_ref}&status=${newStatus}`
    );
  } catch (err) {
    console.error("🔴 Chapa Callback Error:", err.message);
    return res.status(500).send("Verification failed");
  }
};

/* ----------------------------------------
   ✅ INSTRUCTOR EARNINGS
---------------------------------------- */
export const getInstructorEarnings = [
  auth,
  requireRole(['instructor']),
  async (req, res) => {
    try {
      const earnings = await Payment.aggregate([
        { 
          $match: { 
            instructor: req.user._id, 
            status: "completed",
            isDeleted: false 
          } 
        },
        { 
          $group: { 
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            totalEarnings: { $sum: "$instructorShare" },
            count: { $sum: 1 }
          } 
        },
        { $sort: { _id: -1 } },
        { $limit: 12 } // Last year
      ]);

      const overallTotal = await Payment.aggregate([
        { 
          $match: { 
            instructor: req.user._id, 
            status: "completed",
            isDeleted: false 
          } 
        },
        { 
          $group: { 
            _id: null, 
            totalEarnings: { $sum: "$instructorShare" } 
          } 
        }
      ]);

      res.json({
        monthlyEarnings: earnings,
        totalEarnings: overallTotal[0]?.totalEarnings ? parseFloat(overallTotal[0].totalEarnings.toFixed(2)) : 0,
        currency: 'ETB'
      });
    } catch (err) {
      console.error("Instructor Earnings Error:", err.message);
      res.status(500).json({ message: 'Failed to fetch earnings' });
    }
  }
];

/* ----------------------------------------
   ✅ CART CHECKOUT (Multi-Course)
---------------------------------------- */
export const createCartPayment = [
  auth,
  requireRole(['student']),
  body('courseIds').isArray({ min: 1 }).withMessage('At least one course required'),
  body('courseIds.*').isMongoId().withMessage('Valid course IDs required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { courseIds } = req.body;

    try {
      const user = await User.findById(req.user._id, { isDeleted: false });
      if (!user || !isValidEmail(user.email)) {
        return res.status(400).json({ message: 'Valid user email is required' });
      }

      // Check for existing enrollments
      const existingEnrollments = await Enrollment.find({ 
        user: req.user._id, 
        course: { $in: courseIds }, 
        isActive: true, 
        isDeleted: false 
      });
      if (existingEnrollments.length > 0) {
        const enrolledCourses = existingEnrollments.map(e => e.course);
        return res.status(400).json({ 
          message: 'Already enrolled in some courses', 
          enrolled: enrolledCourses 
        });
      }

      const courses = await Course.find({
        _id: { $in: courseIds },
        'pricing.basePrice': { $gt: 0 },
        isDeleted: false,
        status: 'published'
      }).populate('instructor', 'fullName email');

      if (courses.length !== courseIds.length) {
        return res.status(400).json({ message: 'One or more courses are invalid or unavailable' });
      }

      // ✅ Validate all course titles
      const invalidCourse = courses.find(c => !c.title?.trim());
      if (invalidCourse) {
        return res.status(400).json({ message: 'One or more courses have invalid titles' });
      }

      const totalAmount = courses.reduce((sum, course) => sum + (course.pricing.currentPrice || course.pricing.basePrice), 0);
      const tx_ref = generateTxRef();

      const paymentDoc = await Payment.create({
        enrollment: null, // Will be set on success for each
        user: user._id,
        courses: courses.map(c => c._id),
        amount: parseFloat(totalAmount.toFixed(2)),
        currency: "ETB",
        status: "pending",
        transactionId: tx_ref,
        paymentMethod: "chapa",
        type: "cart",
        createdBy: req.user._id
      });

      // 🔹 Build URLs safely
      const baseUrl = process.env.BASE_URL;
      const frontendUrl = process.env.FRONTEND_URL;
      let callbackUrl, returnUrl;
      try {
        callbackUrl = new URL('/api/payments/verify/callback', baseUrl).href;
        returnUrl = new URL('/payment/success', frontendUrl).href;
      } catch (urlErr) {
        await Payment.findByIdAndDelete(paymentDoc._id);
        return res.status(500).json({ message: "Invalid server URL configuration" });
      }

      // ✅ Sanitize customization fields
      const safeTitle = "Cart Payment".substring(0, 16).replace(/[^A-Za-z0-9 _.-]/g, '');
      const safeDescription = `${courses.length} courses enrollment`
        .substring(0, 100)
        .replace(/[^A-Za-z0-9 _.-]/g, '');

      const chapaPayload = {
        amount: totalAmount.toFixed(2),
        currency: "ETB",
        email: user.email,
        first_name: (user.firstName?.trim() || "Student").substring(0, 30),
        last_name: (user.lastName?.trim() || "User").substring(0, 30),
        tx_ref,
        callback_url: callbackUrl,
        return_url: `${returnUrl}?tx_ref=${tx_ref}`,
        customization: {
          title: safeTitle,
          description: safeDescription
        }
      };

      const chapaResponse = await axios.post(
        `${CHAPA_BASE_URL}/initialize`,
        chapaPayload,
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );

      // Audit log
      await AuditLog.create({
        action: 'cart_payment_initiated',
        targetId: paymentDoc._id,
        targetModel: 'Payment',
        metadata: { courses: courseIds, amount: totalAmount },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(201).json({
        checkout_url: chapaResponse.data.data.checkout_url,
        tx_ref,
        amount: paymentDoc.amount,
        courseCount: courses.length
      });

    } catch (err) {
      console.error("🔴 Cart Payment Error:", err.message);
      res.status(500).json({ message: "Cart payment initialization failed" });
    }
  }
];
const createNotification = async (userId, type, message, relatedId, relatedModel, recipientRole) => {
  try {
    console.log('Creating notification:', { userId, type, message, relatedId, relatedModel, recipientRole });
    const notification = new Notification({
      user: userId,
      type,
      title: type === 'payment_success' ? 'Payment Successful' : 'New Enrollment Payment',
      message,
      related: relatedId,
      relatedModel,
      recipientRole,
      createdBy: userId,
      isRead: false
    });
    await notification.save();
    console.log('Notification created:', { notificationId: notification._id });
    return notification;
  } catch (err) {
    console.error('🔴 Notification Creation Error:', {
      message: err.message,
      userId,
      type,
      relatedId,
      relatedModel
    });
    throw err; // Let the caller handle the error
  }
};



/* ----------------------------------------
   ✅ HANDLE SUCCESSFUL PAYMENT
---------------------------------------- */
const handleSuccessfulPayment = async (payment, courseId = null) => {
  try {
    // 🔹 Ensure payment is marked as completed (idempotent)
    if (payment.status !== 'completed') {
      payment.status = 'completed';
      payment.updatedBy = payment.createdBy; // Webhook fallback
      await payment.save();
      console.log(`Payment ${payment._id} updated to status: completed`);
    }

    // 🔹 Determine which course(s) to enroll in
    const coursesToEnroll = [];
    if (courseId) {
      // Cart mode: use the provided courseId
      coursesToEnroll.push(courseId);
    } else if (payment.course) {
      // Single mode
      coursesToEnroll.push(payment.course);
    } else if (payment.courses?.length > 0) {
      // Fallback for cart
      coursesToEnroll.push(...payment.courses);
    }

    if (coursesToEnroll.length === 0) {
      console.error(`❌ Payment ${payment._id} has no course(s) to enroll`);
      return;
    }

    // 🔹 Process each course
    for (const cid of coursesToEnroll) {
      // Upsert enrollment
      let enrollment = await Enrollment.findOne({ 
        user: payment.user, 
        course: cid, 
        isDeleted: false 
      });
      if (!enrollment) {
        enrollment = new Enrollment({
          user: payment.user,
          course: cid,
          payment: payment._id,
          paymentStatus: 'completed',
          enrollmentPrice: payment.amount / coursesToEnroll.length, // Prorate for cart
          currency: payment.currency,
          createdBy: payment.createdBy
        });
      } else {
        enrollment.payment = payment._id;
        enrollment.paymentStatus = 'completed';
        enrollment.isActive = true;
      }
      await enrollment.save();
      console.log('Enrollment created/updated:', { enrollmentId: enrollment._id, courseId: cid });

      // 🔹 Populate for notifications
      const populatedEnrollment = await Enrollment
        .findById(enrollment._id)
        .populate('user')
        .populate({
          path: 'course',
          populate: { path: 'instructor' }
        });

      if (!populatedEnrollment?.course) {
        console.warn(`⚠️ Could not populate course for enrollment ${enrollment._id}`);
        continue;
      }

      // 🔹 Notify student
      try {
        await createNotification(
          populatedEnrollment.user._id,
          'payment_success',
          `Payment of ${payment.currency} ${payment.amount.toFixed(2)} was successful. Welcome to "${populatedEnrollment.course.title}"!`,
          payment._id,
          'Payment',
          'student'
        );
      } catch (notificationErr) {
        console.error('Failed to notify student:', notificationErr.message);
        // Continue to avoid blocking other operations
      }

      // 🔹 Notify instructor
      if (populatedEnrollment.course.instructor) {
        try {
          await createNotification(
            populatedEnrollment.course.instructor._id,
            'payment',
            `You earned ${payment.currency} ${(payment.instructorShare || (payment.amount * 0.7)).toFixed(2)} from a new enrollment in "${populatedEnrollment.course.title}".`,
            payment._id,
            'Payment',
            'instructor'
          );
        } catch (notificationErr) {
          console.error('Failed to notify instructor:', notificationErr.message);
          // Continue to avoid blocking
        }
      }

      // Audit log for enrollment
      await AuditLog.create({
        action: 'enrollment_created',
        targetId: enrollment._id,
        targetModel: 'Enrollment',
        metadata: { payment: payment._id, course: cid },
        ipAddress: payment.ipAddress || 'webhook',
        userAgent: payment.userAgent || 'webhook',
        createdBy: populatedEnrollment.user._id
      });
    }
  } catch (err) {
    console.error('🔴 handleSuccessfulPayment Error:', err);
    throw err; // Re-throw to allow caller to handle
  }
};

export const getMyPayments = [
  auth,
  requireRole(['student']),
  async (req, res) => {
    try {
      const payments = await Payment.find({ 
        user: req.user._id, 
        isDeleted: false 
      })
        .populate('course', 'title pricing')
        .populate('courses', 'title pricing') // For cart
        .sort({ createdAt: -1 });

      res.json(payments);
    } catch (err) {
      console.error('Error fetching my payments:', err);
      res.status(500).json({ message: 'Failed to fetch payments' });
    }
  }
];
