var bcrypt = require("bcrypt");
var User = require("../models/User"); 
var jwt = require("jsonwebtoken"); 

// LOGIN
exports.login = async (req, res) => {
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

    // Création du jeton JWT sécurisé
    const token = jwt.sign(
        { userId: user._id, email: user.email, prenom: user.prenom }, 
        process.env.JWT_SECRET || 'MaCleSecrete',
        { expiresIn: '24h' }
    );
    
    // Envoi du jeton dans un Cookie HTTP-Only
    res.cookie('jwt', token, {
        httpOnly: true, // Sécurité XSS
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 
    });

    // On renvoie les informations utilisateur (SANS le token dans le JSON)
    res.json({
        message: "Connexion réussie",
        user: {
            prenom: user.prenom,
            email: user.email
        }
    });
};




