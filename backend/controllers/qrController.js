const crypto = require("crypto");
const QRCode = require("qrcode");

const Attendance = require("../models/Attendance");
const User = require("../models/User");

// 🔐 Generate Token (30 sec window for testing)
const generateToken = (lectureId, timeSlot = null) => {
  const time = timeSlot || Math.floor(Date.now() / 5000);

  return crypto
    .createHash("sha256")
    .update(lectureId + time + "SECRET_KEY")
    .digest("hex");
};

// 📸 Generate QR
exports.generateQR = async (req, res) => {
  try {
    const { lectureId } = req.body;

    const token = generateToken(lectureId);

    const qrData = JSON.stringify({
      lectureId,
      token
    });

    const qrImage = await QRCode.toDataURL(qrData);

    res.json({
      qr: qrImage,
      token: token // for testing
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Verify QR + Save Attendance
exports.verifyQR = async (req, res) => {
  try {
    const { lectureId, token, studentId } = req.body;

    const currentToken = generateToken(lectureId);

    const prevTime = Math.floor(Date.now() / 5000) - 1;
    const prevToken = generateToken(lectureId, prevTime);

    // Token validation
    if (token !== currentToken && token !== prevToken) {
      return res.status(400).json({ message: "Invalid or expired QR" });
    }

    // Duplicate check
    const existing = await Attendance.findOne({
      studentId,
      lectureId
    });

    if (existing) {
      return res.json({ message: "Attendance already marked" });
    }

    // Save attendance
    const attendance = new Attendance({
      studentId,
      lectureId
    });

    await attendance.save();

    return res.json({ message: "Attendance marked successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📊 Get Attendance (Teacher View)
exports.getAttendance = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const attendance = await Attendance.find({ lectureId });

    const detailed = await Promise.all(
      attendance.map(async (record) => {
        const student = await User.findById(record.studentId);

        return {
          studentId: record.studentId,
          name: student?.name,
          email: student?.email,
          time: record.date
        };
      })
    );

    res.json(detailed);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};