var express = require("express");
var database = require("./database");
require("dotenv").config();

var app = express();

// Middleware JSON
app.use(express.json());

// Middleware CORS
app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

// Connexion Base de données
database.connectDB();

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/rides", require("./routes/rides"));
app.use("/bookings", require("./routes/bookings"));
app.use("/users", require("./routes/users")); 

// Lancement serveur
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("Server running on http://localhost:" + PORT);
});





