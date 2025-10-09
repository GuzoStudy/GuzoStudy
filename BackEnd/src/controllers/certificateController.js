// controllers/certificateController.js
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Progress from '../models/Progress.js';
import Certificate from '../models/Certificate.js';
import { v4 as uuidv4 } from 'uuid';
import { createNotification } from './notificationController.js';
import fs from 'fs';
import QRCode from 'qrcode';
import path from 'path';
import PDFDocument from 'pdfkit';
import User from '../models/User.js';
import { body,param, query, validationResult } from 'express-validator';
import { auth, requireRole } from '../middlewares/auth.js'; // Assume auth and role middleware
import AuditLog from '../models/AuditLog.js';

/**
 * 🌍 Multi-language Responsive PDF Certificate Generator (Fixed QR & Content Position + Guzo Study Header)
 * Languages supported: 'en' (English), 'am' (Amharic)
 */
export const downloadCertificate = [
  auth,
  requireRole(['student', 'admin', 'superadmin']),
  param('certificateId').isMongoId().withMessage('Valid certificate ID required'),
  query('lang').optional().isIn(['en', 'am']).default('en'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { certificateId } = req.params;
    const lang = req.query.lang || 'en'; // default English
    // Text translations
    const texts = {
      en: {
        title: 'Certificate of Completion',
        presented: 'This certificate is proudly presented to',
        completed: 'for successfully completing the course',
        issuedOn: 'Issued on',
        certificateId: 'Certificate ID',
        signature: 'Authorized Signature',
        verify: 'Scan or visit to verify',
      },
      am: {
        title: 'የተጠናቀቀ ማረጋገጫ',
        presented: 'ይህ ማረጋገጫ በኩል የሚቀርብ ለ',
        completed: 'የትምህርት ኮርስ ለማሳካት',
        issuedOn: 'በዚህ ቀን ተሰጥቷል',
        certificateId: 'የማረጋገጫ መለያ',
        signature: 'ባለሥልጣን ፊርማ',
        verify: 'ለማረጋገጥ እባክዎን ይቃኙ ወይም ይጎብኙ',
      }
    };

    const text = texts[lang] || texts['en'];

    try {
      // Fetch certificate with user & course (check access for students)
      let certificate;
      if (req.user.role === 'student') {
        certificate = await Certificate.findOne({ 
          _id: certificateId, 
          user: req.user._id, 
          isDeleted: false 
        })
          .populate('user', 'firstName lastName')
          .populate('course', 'title');
      } else {
        certificate = await Certificate.findById(certificateId, { isDeleted: false })
          .populate('user', 'firstName lastName')
          .populate('course', 'title');
      }

      if (!certificate) return res.status(404).json({ message: 'Certificate not found' });

      // Generate QR Code
      const verifyUrl = `${req.protocol}://${req.get('host')}/api/certificates/verify/${certificateId}`;
      const qrCodeData = await QRCode.toDataURL(verifyUrl);

      // File setup
      const fileName = `certificate-${certificateId}.pdf`;
      const filePath = path.join('uploads/certificates', fileName);
      if (!fs.existsSync('uploads/certificates')) fs.mkdirSync('uploads/certificates', { recursive: true });

      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const { width: pageWidth, height: pageHeight } = doc.page;

      // Background gradient
      const gradient = doc.linearGradient(0, 0, 0, pageHeight)
        .stop(0, '#ffffff')
        .stop(1, '#f9f9f9');
      doc.rect(0, 0, pageWidth, pageHeight).fill(gradient);

      // Golden watermark
      doc.fontSize(100)
        .fillColor('#FFD700')
        .opacity(0.1)
        .rotate(-45, { origin: [pageWidth / 2, pageHeight / 2] })
        .text('CERTIFIED', pageWidth / 2 - 300, pageHeight / 2 - 50, { align: 'center' });
      doc.rotate(45, { origin: [pageWidth / 2, pageHeight / 2] }).opacity(1);

      // Golden border
      const borderMargin = pageWidth * 0.05;
      doc.lineWidth(5)
        .strokeColor('#d4af37')
        .rect(borderMargin, borderMargin, pageWidth - 2 * borderMargin, pageHeight - 2 * borderMargin)
        .stroke();

      const contentTop = borderMargin + 20;
      const contentBottom = pageHeight - borderMargin - 20;

      // === Guzo Study Header ===
      doc.fontSize(pageWidth / 20)
        .fillColor('#000')
        .font('Helvetica-Bold')
        .text('Guzo Study', 0, contentTop, { align: 'center' });

      // Logo (optional)
      const logoPath = path.join(process.cwd(), 'assets/logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, pageWidth / 2 - 40, contentTop + 50, { width: 80 });
      }

      // Title
      doc.moveDown(3);
      doc.fontSize(pageWidth / 18)
        .fillColor('#333')
        .strokeColor('#d4af37')
        .lineWidth(1.5)
        .text(text.title, { align: 'center', stroke: true });

      // Recipient Name
      const fullName = `${certificate.user.firstName || ''} ${certificate.user.lastName || ''}`.trim();
      doc.moveDown(2);
      doc.fontSize(pageWidth / 36)
        .fillColor('#333')
        .text(text.presented, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(pageWidth / 24)
        .fillColor('#000')
        .strokeColor('#d4af37')
        .lineWidth(1)
        .text(fullName, { align: 'center', stroke: true });

      // Course title
      doc.moveDown(1);
      doc.fontSize(pageWidth / 48)
        .fillColor('#333')
        .text(text.completed, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(pageWidth / 32)
        .fillColor('#000')
        .strokeColor('#d4af37')
        .lineWidth(1)
        .text(`"${certificate.course.title}"`, { align: 'center', stroke: true });

      // Issue date & certificate ID
      doc.moveDown(2);
      doc.fontSize(pageWidth / 72)
        .fillColor('#555')
        .text(`${text.issuedOn}: ${new Date(certificate.issuedAt).toDateString()}`, { align: 'center' });
      doc.text(`${text.certificateId}: ${certificate.certificateId}`, { align: 'center' });

      // === Signature ===
      const signatureWidth = 120;
      const signatureY = contentBottom - 160;
      const signatureX = pageWidth / 2 - signatureWidth / 2;
      const signaturePath = path.join(process.cwd(), 'assets/signature.png');

      if (fs.existsSync(signaturePath)) {
        doc.image(signaturePath, signatureX, signatureY, { width: signatureWidth });
      }
      doc.fontSize(pageWidth / 72)
        .fillColor('#333')
        .text(text.signature, signatureX, signatureY + 70, { width: signatureWidth, align: 'center' });

      // === QR Code ===
      const qrSize = pageWidth * 0.15;
      const qrX = pageWidth / 2 - qrSize / 2;
      const qrY = contentBottom - qrSize - 10;

      doc.image(qrCodeData, qrX, qrY, { width: qrSize, height: qrSize });
      doc.fontSize(pageWidth / 90)
        .fillColor('blue')
        .text(text.verify, qrX, qrY + qrSize + 5, { width: qrSize, align: 'center' });

      doc.end();

      stream.on('finish', () => {
        // Audit log for download
        AuditLog.create({
          action: 'certificate_downloaded',
          targetId: certificate._id,
          targetModel: 'Certificate',
          metadata: { lang, ip: req.ip },
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          createdBy: req.user._id
        }).catch(console.error);

        res.download(filePath, fileName, (err) => {
          if (err) console.error('Download Error:', err);
          // Clean up file after download
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error('Cleanup Error:', unlinkErr);
          });
        });
      });

      stream.on('error', (err) => {
        console.error('Stream Error:', err);
        res.status(500).json({ message: 'PDF generation failed' });
      });
    } catch (err) {
      console.error('Error generating certificate PDF:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

/**
 * 📄 Issue certificate for a fully completed course
 */
export const issueCertificate = [
  auth,
  requireRole(['student', 'admin', 'superadmin']),
  param('courseId').isMongoId().withMessage('Valid course ID required'),
  async (req, res) => {
    const { courseId } = req.params;

    try {
      // ✅ Verify enrollment & payment
      const enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: courseId,
        paymentStatus: 'completed',
        isActive: true,
        isDeleted: false
      });
      if (!enrollment) return res.status(403).json({ message: 'Not enrolled or payment pending' });

      // ✅ Fetch course with lessons & quizzes using findOne filter
      const course = await Course.findOne({ 
        _id: courseId,
        isDeleted: false,
        status: 'published'
      })
      .populate({
        path: 'sections',
        match: { isDeleted: false },
        populate: [
          { path: 'lessons', select: '_id title', match: { isDeleted: false } },
          { path: 'quizzes', select: '_id title', match: { isDeleted: false } }
        ]
      });

      if (!course) return res.status(404).json({ message: 'Course not found or not published' });

      // ✅ Fetch progress
      const progress = await Progress.find({ 
        user: req.user._id, 
        course: courseId, 
        isDeleted: false 
      });

      // ✅ Check completion using status
      const lessonIds = course.sections.flatMap(section => section.lessons.map(lesson => lesson._id.toString()));
      const quizIds = course.sections.flatMap(section => section.quizzes.map(quiz => quiz._id.toString()));

      const completedLessons = progress
        .filter(p => p.lesson && p.status === 'completed')
        .map(p => p.lesson.toString());

      const completedQuizzes = progress
        .filter(p => p.quiz && p.status === 'completed')
        .map(p => p.quiz.toString());

      const allLessonsCompleted = lessonIds.every(id => completedLessons.includes(id));
      const allQuizzesCompleted = quizIds.every(id => completedQuizzes.includes(id));

      if (!allLessonsCompleted || !allQuizzesCompleted) {
        return res.status(400).json({ 
          message: 'Course not fully completed',
          stats: { 
            lessonsCompleted: completedLessons.length, 
            totalLessons: lessonIds.length, 
            quizzesCompleted: completedQuizzes.length, 
            totalQuizzes: quizIds.length 
          } 
        });
      }

      // ✅ Avoid duplicate certificates
      const existingCertificate = await Certificate.findOne({ 
        user: req.user._id, 
        course: courseId, 
        isDeleted: false 
      });
      if (existingCertificate) {
        return res.status(400).json({ message: 'Certificate already issued' });
      }

      // ✅ Create certificate
      const certificate = new Certificate({
        user: req.user._id,
        course: courseId,
        enrollment: enrollment._id,
        certificateId: uuidv4(),
        score: enrollment.progress || 100,
        createdBy: req.user._id
      });
      await certificate.save();

      // Update enrollment
      enrollment.certificateIssued = true;
      enrollment.completedAt = new Date();
      enrollment.updatedBy = req.user._id;
      await enrollment.save();

      // ✅ Notify user
      await createNotification(
        req.user._id,
        'certificate_issued',
        `You earned a certificate for "${course.title}"!`,
        certificate._id,
        'Certificate',
        'student'
      );

      // Audit log
      await AuditLog.create({
        action: 'certificate_issued',
        targetId: certificate._id,
        targetModel: 'Certificate',
        metadata: { course: courseId, score: certificate.score },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(201).json({ message: 'Certificate issued successfully', certificate });
    } catch (err) {
      console.error('Error issuing certificate:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

/**
 * 📄 Get all certificates for logged-in user
 */
export const getCertificates = [
  auth,
  requireRole(['student']),
  async (req, res) => {
    try {
      const certificates = await Certificate.find({ 
        user: req.user._id, 
        isDeleted: false, 
        status: 'issued' 
      })
        .populate('course', 'title thumbnail pricing')
        .sort({ issuedAt: -1 });

      // Add download URLs
      certificates.forEach(cert => {
        cert.downloadUrl = `/api/certificates/${cert._id}/download?lang=en`; // Default lang
      });

      res.status(200).json(certificates);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

/**
 * 🌐 Public Certificate Verification Page
 */
export const verifyCertificate = [
  // No auth for public verification
  param('certificateId').isMongoId().withMessage('Valid certificate ID required'),
  query('lang').optional().isIn(['en', 'am']).default('en'),
  async (req, res) => {
    const { certificateId } = req.params;
    const lang = req.query.lang || 'en'; // default English
   
    // Multi-language texts
    const texts = {
      en: {
        verified: '✅ Verified Certificate',
        hasCompleted: 'has successfully completed',
        issuedOn: 'Issued on',
        certificateId: 'Certificate ID',
        download: '📥 Download PDF',
        dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
        revoked: '❌ Certificate Revoked',
        expired: '⏰ Certificate Expired'
      },
      am: {
        verified: '✅ የተረጋገጠ ማረጋገጫ',
        hasCompleted: 'የትምህርት ኮርስ አስተማሩ',
        issuedOn: 'በዚህ ቀን ተሰጥቷል',
        certificateId: 'የማረጋገጫ መለያ',
        download: '📥 ፒዲኤፍ አውርድ',
        dateFormat: { year: 'numeric', month: '2-digit', day: '2-digit' },
        revoked: '❌ ማረጋገጫ ተውደቀ',
        expired: '⏰ ማረጋገጫ ያልቋል'
      }
    };

    const text = texts[lang] || texts['en'];

    try {
      const certificate = await Certificate.findOne({ 
        certificateId, 
        isDeleted: false 
      })
        .populate('user', 'firstName lastName')
        .populate('course', 'title');

      if (!certificate) {
        return res.status(404).send(`
          <html>
            <head>
              <title>Certificate Not Found</title>
              <style>
                body { font-family: Arial, sans-serif; background: #f9f9f9; text-align: center; padding: 50px; }
                .box { background: #fff; padding: 40px; border-radius: 12px; display: inline-block; }
                h1 { color: #c00; }
              </style>
            </head>
            <body>
              <div class="box">
                <h1>❌ Certificate Not Found</h1>
                <p>The certificate ID <b>${certificateId}</b> does not exist or may have been revoked.</p>
              </div>
            </body>
          </html>
        `);
      }

      // Check status
      if (certificate.status === 'revoked') {
        return res.status(400).send(`
          <html>
            <head>
              <title>Certificate Revoked</title>
              <style>
                body { font-family: Arial, sans-serif; background: #f9f9f9; text-align: center; padding: 50px; }
                .box { background: #fff; padding: 40px; border-radius: 12px; display: inline-block; }
                h1 { color: #c00; }
              </style>
            </head>
            <body>
              <div class="box">
                <h1>${text.revoked}</h1>
                <p>The certificate <b>${certificateId}</b> has been revoked.</p>
              </div>
            </body>
          </html>
        `);
      }

      if (certificate.isExpired) {
        return res.status(400).send(`
          <html>
            <head>
              <title>Certificate Expired</title>
              <style>
                body { font-family: Arial, sans-serif; background: #f9f9f9; text-align: center; padding: 50px; }
                .box { background: #fff; padding: 40px; border-radius: 12px; display: inline-block; }
                h1 { color: #c00; }
              </style>
            </head>
            <body>
              <div class="box">
                <h1>${text.expired}</h1>
                <p>The certificate <b>${certificateId}</b> has expired.</p>
              </div>
            </body>
          </html>
        `);
      }

      const fullName = `${certificate.user.firstName || ''} ${certificate.user.lastName || ''}`.trim();
      
      // Format date based on language
      const issuedDate = new Intl.DateTimeFormat(lang === 'am' ? 'am-ET' : 'en-US', text.dateFormat).format(new Date(certificate.issuedAt));

      res.set('Content-Type', 'text/html');
      res.send(`
        <html>
          <head>
            <title>Certificate Verification</title>
            <style>
              body {
                font-family: "Segoe UI", Tahoma, sans-serif;
                background: linear-gradient(135deg, #f7f7f7, #ececec);
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .certificate-box {
                background: #fff;
                border: 2px solid #d4af37;
                border-radius: 16px;
                padding: 40px;
                max-width: 600px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                text-align: center;
                animation: fadeIn 0.5s ease-in-out;
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              h1 { font-size: 28px; color: #333; margin-bottom: 10px; }
              h2 { font-size: 22px; color: #000; margin: 10px 0; }
              .course { font-size: 18px; color: #444; margin: 10px 0; font-style: italic; }
              .info { color: #555; font-size: 14px; margin-top: 20px; }
              .download-btn {
                display: inline-block; background: #d4af37; color: #fff; text-decoration: none;
                padding: 10px 20px; border-radius: 6px; margin-top: 20px; font-weight: bold; transition: background 0.2s;
              }
              .download-btn:hover { background: #c39d2c; }
              .header { font-size: 26px; font-weight: bold; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="certificate-box">
              <div class="header">Guzo Study</div>
              <h1>${text.verified}</h1>
              <h2>${fullName}</h2>
              <div class="course">${text.hasCompleted}<br><strong>${certificate.course.title}</strong></div>
              <div class="info">
                <p>${text.issuedOn}: ${issuedDate}</p>
                <p>${text.certificateId}: <b>${certificate.certificateId}</b></p>
              </div>
              <a href="/api/certificates/${certificateId}/download?lang=${lang}" class="download-btn">${text.download}</a>
            </div>
          </body>
        </html>
      `);
    } catch (err) {
      console.error('Error verifying certificate:', err);
      res.status(500).send('Server error');
    }
  }
];

export const revokeCertificate = [
  auth,
  requireRole(['admin', 'superadmin']),
  param('certificateId').isMongoId().withMessage('Valid certificate ID required'),
  body('reason').optional().trim().notEmpty().escape().isLength({ max: 500 }).withMessage('Reason max 500 chars'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { certificateId } = req.params;
    const { reason } = req.body;

    try {
      const certificate = await Certificate.findById(certificateId, { isDeleted: false });
      if (!certificate) return res.status(404).json({ message: 'Certificate not found' });

      certificate.status = 'revoked';
      certificate.revoked = true;
      certificate.revokedAt = new Date();
      certificate.revocationReason = reason;
      certificate.updatedBy = req.user._id;
      await certificate.save();

      // Notify user
      await createNotification(
        certificate.user,
        'alert',
        `Your certificate for "${certificate.course.title}" has been revoked. Reason: ${reason || 'Administrative action'}.`,
        certificate._id,
        'Certificate',
        'student'
      );

      // Audit log
      await AuditLog.create({
        action: 'certificate_revoked',
        targetId: certificate._id,
        targetModel: 'Certificate',
        metadata: { reason, user: certificate.user },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(200).json({ message: 'Certificate revoked successfully', certificate });
    } catch (err) {
      console.error('Error revoking certificate:', err);
      res.status(500).json({ message: err.message });
    }
  }
];

export const getAllCertificates = [
  auth,
  requireRole(['admin', 'superadmin']),
  query('page').optional().isInt({ min: 1 }).default(1),
  query('limit').optional().isInt({ min: 1, max: 50 }).default(10),
  query('status').optional().isIn(['issued', 'revoked', 'suspended', 'all']).default('all'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { page = 1, limit = 10, status = 'all' } = req.query;

    try {
      const filter = { isDeleted: false };
      if (status !== 'all') filter.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Certificate.countDocuments(filter);

      const certificates = await Certificate.find(filter)
        .populate('user', 'fullName email profilePicture')
        .populate('course', 'title thumbnail')
        .select('certificateId issuedAt status revoked revokedAt fileUrl')
        .sort({ issuedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      // Audit log
      await AuditLog.create({
        action: 'certificates_listed',
        targetId: null,
        targetModel: 'Certificate',
        metadata: { count: certificates.length, filters: { status } },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        createdBy: req.user._id
      });

      res.status(200).json({
        certificates,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total
        }
      });
    } catch (err) {
      console.error('Error fetching all certificates:', err);
      res.status(500).json({ message: err.message });
    }
  }
];
