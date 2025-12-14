const API_URL = "https://nexusgo.onrender.com";

// On attend que TOUT le HTML soit chargé avant de lancer les scripts
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. On bloque les dates passées IMMÉDIATEMENT
    blockPastDates();
    
    // 2. On vérifie si l'utilisateur est connecté
    checkAuth();

    // 3. Gestion de la Connexion
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const res = await fetch(API_URL + "/auth/login", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, motDePasse: password })
                });
                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("firstName", data.user.prenom);
                    localStorage.setItem("email", data.user.email);
                    checkAuth();
                    alert("Connexion réussie");
                } else {
                    document.getElementById("loginError").textContent = data.message;
                }
            } catch (error) {
                console.error(error);
            }
        });
    }

    // 4. Gestion de la Recherche
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const departure = document.getElementById("searchDepart").value;
            const arrival = document.getElementById("searchArrivee").value;
            const dateRaw = document.getElementById("searchDate").value;
            
            let url = API_URL + "/rides?villeDepart=" + departure + "&villeArrivee=" + arrival;
            if (dateRaw) {
                url += "&date=" + formatDate(dateRaw);
            }

            try {
                const res = await fetch(url);
                const rides = await res.json();
                const resultsArea = document.getElementById("resultsArea");
                resultsArea.innerHTML = "";

                if (rides.length === 0) {
                    resultsArea.innerHTML = "<p style='text-align:center; margin-top:20px;'>Aucun trajet trouvé.</p>";
                }

                rides.forEach(ride => {
                    const div = document.createElement("div");
                    div.className = "result-item";
                    div.innerHTML = `
                        <div>
                            <strong>${ride.villeDepart} ➝ ${ride.villeArrivee}</strong><br>
                            <small>Date: ${ride.date}</small>
                        </div>
                        <div style="text-align:right">
                            <strong>${ride.prix} €</strong><br>
                            <small>${ride.nbPlaces} places</small>
                        </div>
                    `;
                    const btn = document.createElement("button");
                    btn.textContent = "Réserver";
                    btn.style.marginLeft = "15px";
                    btn.onclick = () => bookRide(ride._id);
                    div.appendChild(btn);
                    resultsArea.appendChild(div);
                });
            } catch (error) { console.error(error); }
        });
    }

    // 5. Gestion de la Proposition
    const proposeForm = document.getElementById("proposeForm");
    if (proposeForm) {
        proposeForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const email = localStorage.getItem("email");
            if (!email) return alert("Veuillez vous connecter.");

            const departure = document.getElementById("proposeDepart").value;
            const arrival = document.getElementById("proposeArrivee").value;
            const dateRaw = document.getElementById("proposeDate").value;
            const price = document.getElementById("proposePrix").value;
            const seats = document.getElementById("proposePlaces").value;

            try {
                const res = await fetch(API_URL + "/rides", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        emailConducteur: email,
                        villeDepart: departure,
                        villeArrivee: arrival,
                        date: formatDate(dateRaw),
                        prix: price,
                        nbPlaces: seats
                    })
                });

                if (res.ok) {
                    alert("Trajet publié !");
                    proposeForm.reset();
                } else {
                    alert("Erreur lors de la publication.");
                }
            } catch (error) { console.error(error); }
        });
    }
});

/* --- FONCTIONS UTILITAIRES --- */

function checkAuth() {
    const token = localStorage.getItem("token");
    const firstName = localStorage.getItem("firstName");
    const authView = document.getElementById("auth-view");
    const appView = document.getElementById("app-view");
    const userDisplay = document.getElementById("userDisplay");

    if (token) {
        if (authView) authView.classList.add("hidden");
        if (appView) appView.classList.remove("hidden");
        if (userDisplay) userDisplay.innerHTML = `<i class="fa-solid fa-user"></i> ${firstName}`;
    } else {
        if (authView) authView.classList.remove("hidden");
        if (appView) appView.classList.add("hidden");
    }
}

function logout() {
    localStorage.clear();
    window.location.reload();
}

function bookRide(rideId) {
    const email = localStorage.getItem("email");
    if (!email) return alert("Veuillez vous connecter.");
    
    fetch(API_URL + "/bookings", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idProposition: rideId, emailPassager: email })
    })
    .then(res => res.json())
    .then(data => alert(data.message || "Réservation réussie"))
    .catch(err => console.error(err));
}

// C'est cette fonction qui empêche de cliquer sur hier
function blockPastDates() {
    const today = new Date().toISOString().split('T')[0];
    const inputs = document.querySelectorAll('input[type="date"]');
    inputs.forEach(input => {
        input.setAttribute('min', today);
    });
}

function formatDate(dateString) {
    if (!dateString) return null;
    const [year, month, day] = dateString.split("-");
    return parseInt(year.substring(2) + month + day); 
}


