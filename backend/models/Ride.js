const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  idProposition: { type: Number, required: true },
  emailConducteur: { type: String, required: true },
  villeDepart: { type: String, required: true },
  villeArrivee: { type: String, required: true },
  date: { type: Number, required: true },
  nbPlaces: { type: Number, required: true },
  prix: { type: Number, required: true }
}, {
  versionKey: false
});

rideSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model("Ride", rideSchema);
