const express = require("express");
const cors = require("cors");
const { connectDB } = require("./database");
require("dotenv").config(); // Important de charger les variables d'env ici

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connexion DB
connectDB();

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/rides", require("./routes/rides"));
app.use("/bookings", require("./routes/bookings"));
app.use("/users", require("./routes/users")); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});






