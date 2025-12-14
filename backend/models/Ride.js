const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    emailConducteur: { type: String, required: true, ref: "User" }, 
    villeDepart: { type: String, required: true },   
    villeArrivee: { type: String, required: true },  
    date: { type: Number, required: true },          
    nbPlaces: { type: Number, required: true, min: 0 },
    prix: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);

