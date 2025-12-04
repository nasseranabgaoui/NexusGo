const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // On demande à Mongoose d'utiliser l'adresse stockée dans le fichier .env
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB Connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur : ${error.message}`);
    process.exit(1); // Arrête le serveur si la base de données ne répond pas
  }
};

module.exports = { connectDB };