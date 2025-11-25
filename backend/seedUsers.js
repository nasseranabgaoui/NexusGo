require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;

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
    if (!uri) throw new Error("MONGO_URI missing in .env");
    if (!dbName) throw new Error("MONGO_DB missing in .env");

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    const collection = db.collection("users");

    await collection.deleteMany();
    await collection.insertMany(users);

    console.log(" Users inserted successfully!");
    await client.close();
  } catch (err) {
    console.error(" Seed error:", err);
  }
}

seed();

