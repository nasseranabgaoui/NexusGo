const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String } 
}, {
  versionKey: false // removes __v completely
});

// Optional: rename _id to id and hide password in JSON responses
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;       // rename _id to id
    delete ret._id;         // remove original _id  // hide password
    return ret;
  }
});

module.exports = mongoose.model("User", userSchema);
