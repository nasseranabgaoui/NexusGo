const bcrypt = require("bcrypt");
const users = require("../connex.js");

// LOGIN
exports.login = async (req, res) => {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
        return res.status(400).json({ message: "Champs manquants" });
    }

    const user = await users.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    const ok = await bcrypt.compare(motDePasse, user.motDePasse);
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






