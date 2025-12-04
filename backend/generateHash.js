const bcrypt = require("bcrypt");

async function run() {
    const mdp = "1234"; 
    
    const hash = await bcrypt.hash(mdp, 10);
    console.log("Mot de passe :", mdp);
    console.log("Hash bcrypt :", hash);
}

run();
