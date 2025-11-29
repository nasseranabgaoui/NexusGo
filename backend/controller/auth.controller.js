const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.register = async (req, res) => {
    try {
        const { email, motDePasse, nom, prenom, telephone } = req.body;

        if (!email || !motDePasse || !nom || !prenom || !telephone) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        // Vérification Mongoose
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        const newUser = await User.create({
            email,
            motDePasse: hashedPassword,
            nom,
            prenom,
            telephone
        });

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: { id: newUser._id, email: newUser.email }
        });

    } catch (error) {
        console.error("Erreur inscription:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};



