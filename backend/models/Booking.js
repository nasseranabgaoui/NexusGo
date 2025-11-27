const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  idProposition: { type: Number, required: true },   // link to a ride
  emailPassager: { type: String, required: true }    // passenger email
}, {
  versionKey: false // removes __v
});

// Optional: rename _id to id in JSON responses
bookingSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;    // rename _id to id
    delete ret._id;      // remove _id
    return ret;
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
