const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    emailConducteur: { type: String, required: true, ref: "User" }, // Référence à l'email ou ID user
    villeDepart: { type: String, required: true },   // Ajouté selon besoins recherche
    villeArrivee: { type: String, required: true },  // Ajouté selon besoins recherche
    date: { type: Number, required: true },          // Format AAMMJJ (ex: 251230) [cite: 10]
    nbPlaces: { type: Number, required: true, min: 0 },
    prix: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);

