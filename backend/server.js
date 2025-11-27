require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database");  


const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/users", require("./routes/users"));
app.use("/rides", require("./routes/rides"));
app.use("/bookings", require("./routes/bookings"));

const authRoutes = require("./routes/auth");

// Ajoute un préfixe /auth devant toutes les routes d’authentification
app.use("/auth", authRoutes);

// Lancement du serveur après connexion BD
const PORT = process.env.PORT || 3000; // safer fallback
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});


