const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Choose URI based on environment
    const uri =
      process.env.MONGO_ENV === "atlas"
        ? process.env.MONGO_URI_ATLAS
        : process.env.MONGO_URI_LOCAL;

    await mongoose.connect(uri, {
      dbName: "Nexusgo" // optional if Atlas URI already includes DB
    });

    console.log(`MongoDB connected (${process.env.MONGO_ENV})`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
