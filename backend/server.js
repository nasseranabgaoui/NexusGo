const express = require("express");
const cors = require("cors");
const { connectDB } = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/users", require("./routes/users"));
app.use("/rides", require("./routes/rides"));
app.use("/bookings", require("./routes/bookings"));

// Lancement du serveur après connexion BD
connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
});

