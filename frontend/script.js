window.onload = function() {
    verifierConnexion();
};

// Connexion
const formulaireLogin = document.getElementById("loginForm");

if (formulaireLogin) {
    formulaireLogin.addEventListener("submit", async function(event) {
        event.preventDefault();

        const emailSaisi = document.getElementById("email").value;
        const mdpSaisi = document.getElementById("password").value;

        const reponse = await fetch("http://localhost:3000/auth/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailSaisi, motDePasse: mdpSaisi })
        });

        const donnees = await reponse.json();

        if (reponse.ok) {
            localStorage.setItem("token", donnees.token);
            localStorage.setItem("prenom", donnees.user.prenom);
            localStorage.setItem("email", donnees.user.email);
            
            alert("Connexion réussie");
            verifierConnexion();
        } else {
            document.getElementById("loginError").textContent = donnees.message;
        }
    });
}

// Vérification
function verifierConnexion() {
    const token = localStorage.getItem("token");
    const prenom = localStorage.getItem("prenom");

    const vueLogin = document.getElementById("auth-view");
    const vueApp = document.getElementById("app-view");
    const zonePrenom = document.getElementById("userDisplay");

    if (token) {
        vueLogin.classList.add("hidden");
        vueApp.classList.remove("hidden");
        zonePrenom.textContent = prenom;
    } else {
        vueLogin.classList.remove("hidden");
        vueApp.classList.add("hidden");
    }
}

// Déconnexion
function logout() {
    localStorage.clear();
    window.location.reload();
}

// Recherche
const formulaireRecherche = document.getElementById("searchForm");

if (formulaireRecherche) {
    formulaireRecherche.addEventListener("submit", async function(event) {
        event.preventDefault();

        const villeDepart = document.getElementById("searchDepart").value;
        const villeArrivee = document.getElementById("searchArrivee").value;

        const url = "http://localhost:3000/rides?villeDepart=" + villeDepart + "&villeArrivee=" + villeArrivee;
        
        const reponse = await fetch(url);
        const listeTrajets = await reponse.json();

        const zoneResultats = document.getElementById("resultsArea");
        zoneResultats.innerHTML = "";

        for (let trajet of listeTrajets) {
            let div = document.createElement("div");
            div.className = "result-item";

            div.innerHTML = 
                "<strong>" + trajet.villeDepart + " ➝ " + trajet.villeArrivee + "</strong><br>" +
                "Prix : " + trajet.prix + " € <br>" +
                "Places : " + trajet.nbPlaces;

            let bouton = document.createElement("button");
            bouton.textContent = "Réserver";
            
            bouton.addEventListener("click", function() {
                reserverTrajet(trajet._id);
            });

            div.appendChild(bouton);
            zoneResultats.appendChild(div);
        }
        
        if (listeTrajets.length === 0) {
            zoneResultats.textContent = "Aucun trajet trouvé.";
        }
    });
}

// Réservation
async function reserverTrajet(idDuTrajet) {
    const emailUser = localStorage.getItem("email");

    const reponse = await fetch("http://localhost:3000/bookings", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            idProposition: idDuTrajet, 
            emailPassager: emailUser 
        })
    });

    const resultat = await reponse.json();

    if (reponse.ok) {
        alert("Réservation réussie !");
    } else {
        alert("Erreur : " + resultat.message);
    }
}



