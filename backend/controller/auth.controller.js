const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Mongoose model

// Génère un token pour l'utilisateur
function generateToken(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

exports.login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        if (!email || !motDePasse) {
            return res.status(400).json({ message: "Email and motDePasse required" });
        }

        // Chercher l'utilisateur via Mongoose
        const user = await User.findOne({ email });

        if (!user || user.motDePasse !== motDePasse) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                telephone: user.telephone
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
