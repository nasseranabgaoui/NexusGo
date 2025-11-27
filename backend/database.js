const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Choisir l'URI selon l'environnement
    const uri =
      process.env.MONGO_ENV === "atlas"
        ? process.env.MONGO_URI_ATLAS
        : process.env.MONGO_URI_LOCAL;

    // Connexion à MongoDB
    await mongoose.connect(uri, {
      dbName: "Nexusgo", // Si nécessaire
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB connecté (${process.env.MONGO_ENV})`);
  } catch (err) {
    console.error("Erreur de connexion MongoDB:", err.message);
    process.exit(1);  // Arrêter le serveur si la connexion échoue
  }
};

module.exports = connectDB;


module.exports = { connectDB };
