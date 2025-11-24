const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db;

async function connectDB() {
    try {
        await client.connect();
        console.log(" Connecté à MongoDB");

        db = client.db("Nexusgo"); 
        return db;
    } catch (err) {
        console.error("Erreur connexion MongoDB :", err);
    }
}

function getDB() {
    if (!db) {
        throw new Error("La base MongoDB n'est pas encore connectée");
    }
    return db;
}

module.exports = { connectDB, getDB };

