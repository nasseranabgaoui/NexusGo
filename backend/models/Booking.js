const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    idProposition: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Ride", 
      required: true 
    },
    emailPassager: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);

