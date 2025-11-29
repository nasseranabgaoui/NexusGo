require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User"); 
const users = [
  {
    email: "gimli@shortbutangry.com",
    motDePasse: "AndMyAxe", 
    nom: "SonOfGloin",
    prenom: "Gimli",
    telephone: "0602020202"
  },
  {
    email: "hodor@hodor.hodor.com",
    motDePasse: "hodorhodor",
    nom: "Hodor",
    prenom: "Hodor",
    telephone: "0601010102"
  },
  {
    email: "jaime@ilovemysist.com",
    motDePasse: "ILoveMySister",
    nom: "Lannister",
    prenom: "Jaime",
    telephone: "0601010101"
  },
  {
    email: "legolas@aimbot.com",
    motDePasse: "NeverMiss",
    nom: "Greenleaf",
    prenom: "Legolas",
    telephone: "0603030303"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Nexusgo");
    console.log("Connecté à MongoDB pour le seed");

    // Nettoyer la collection existante pour éviter les doublons
    await User.deleteMany({});
    console.log("Anciens utilisateurs supprimés");

    // Hacher les mots de passe et préparer les utilisateurs
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.motDePasse, 10);
        return { ...u, motDePasse: hashedPassword };
      })
    );

    // Insérer les nouveaux utilisateurs
    await User.insertMany(usersWithHashedPasswords);
    console.log("Utilisateurs insérés avec succès !");

    process.exit();
  } catch (err) {
    console.error("Erreur seed:", err);
    process.exit(1);
  }
}

seed();


