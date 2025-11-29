const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Remplacez 'Nexusgo' par le nom de votre DB si différent
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Nexusgo");
    console.log("Connecté à MongoDB via Mongoose");
  } catch (err) {
    console.error("Erreur connexion MongoDB :", err);
    process.exit(1);
  }
};

module.exports = { connectDB };