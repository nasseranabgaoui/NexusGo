var bcrypt = require("bcrypt");
// CORRECTION ICI : On pointe vers le vrai modèle User, pas vers ce fichier lui-même
var User = require("../models/User"); 

// LOGIN
exports.login = async (req, res) => {
    // Utilisation de var comme à la page 23 du cours pour la partie serveur
    var email = req.body.email;
    var motDePasse = req.body.motDePasse;

    if (!email || !motDePasse) {
        return res.status(400).json({ message: "Champs manquants" });
    }

    // Recherche de l'utilisateur
    var user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérification du mot de passe
    var ok = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!ok) {
        return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    // On renvoie le token et les infos
    res.json({
        message: "Bienvenue",
        token: "TOKEN-NEXUSGO",
        user: {
            prenom: user.prenom,
            email: user.email
        }
    });
};




