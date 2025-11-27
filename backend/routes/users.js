const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /users - récupération de tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users); // toJSON transform already renames _id to id
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /users - création d’un utilisateur
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json({ message: "Utilisateur créé", id: newUser.id }); // use id instead of _id
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /users/:id - modification partielle
router.patch("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur modifié", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /users/:id - suppression
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
