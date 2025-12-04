const bcrypt = require("bcrypt");
const users = require("../connex.js"); // ton module pour accéder à Mongo

// -------------------------
// LOGIN
// -------------------------
exports.login = async (req, res) => {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Chercher l'utilisateur
    const user = await users.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    // Comparer mots de passe
    const motDePasseValide = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!motDePasseValide) {
        return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    // FAUX TOKEN POUR L'EXEMPLE
    const fakeToken = "NEXUSGO-TOKEN";

    res.json({
        message: "Connexion réussie",
        token: fakeToken,
        user: {
            prenom: user.prenom,
            email: user.email,
        }
    });
};


// -------------------------
// REGISTER
// -------------------------
exports.register = async (req, res) => {
    const { prenom, email, motDePasse } = req.body;

    if (!prenom || !email || !motDePasse) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const exist = await users.findOne({ email });
    if (exist) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Hash du mot de passe
    const hash = await bcrypt.hash(motDePasse, 10);

    // Insert user
    await users.insertOne({
        prenom,
        email,
        motDePasse: hash,
    });

    res.json({ message: "Compte créé avec succès" });
};





