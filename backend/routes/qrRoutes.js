const express = require("express");
const router = express.Router();

const { generateQR, verifyQR, getAttendance } = require("../controllers/qrController");

router.post("/generate", generateQR);
router.post("/verify", verifyQR);

// NEW ROUTE 👇
router.get("/attendance/:lectureId", getAttendance);

module.exports = router;