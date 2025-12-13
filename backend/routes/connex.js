var bcrypt = require("bcrypt");
var User = require("../models/User"); 

// LOGIN
exports.login = async (req, res) => {
    var email = req.body.email;
    var motDePasse = req.body.motDePasse;

    if (!email || !motDePasse) {
        return res.status(400).json({ message: "Champs manquants" });
    }

    // Utilisation de var user
    var user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    var ok = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!ok) {
        return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    res.json({
        message: "Bienvenue",
        token: "TOKEN-NEXUSGO",
        user: {
            prenom: user.prenom,
            email: user.email
        }
    });
};





