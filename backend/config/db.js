const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/qr-attendance";
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;