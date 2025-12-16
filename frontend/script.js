const API_URL = "https://nexusgo.onrender.com"; 

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Initialisation
    blockPastDates();
    checkAuth();

    // 2. Connexion
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
                    localStorage.setItem("firstName", data.user.prenom);
                    localStorage.setItem("email", data.user.email);
                    checkAuth();
                    showNotification("Connexion réussie !", "success");
                } else {
                    document.getElementById("loginError").textContent = data.message;
                    showNotification(data.message, "error");
                }
            } catch (error) {
                console.error(error);
                showNotification("Erreur de connexion serveur", "error");
            }
        });
    }

    // 3. Recherche 
    const searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const departure = document.getElementById("searchDepart").value;
            const arrival = document.getElementById("searchArrivee").value;
            const dateRaw = document.getElementById("searchDate").value;
            // Récupération du prix max
            const priceMax = document.getElementById("searchPrixMax").value;
            
            let url = API_URL + "/rides?villeDepart=" + departure + "&villeArrivee=" + arrival;
            
            if (dateRaw) {
                url += "&date=" + formatDate(dateRaw);
            }
            // 
            if (priceMax) {
                url += "&prixMax=" + priceMax; 
            }

            try {
                const res = await fetch(url);
                const rides = await res.json();
                const resultsArea = document.getElementById("resultsArea");
                resultsArea.innerHTML = "";

                if (rides.length === 0) {
                    resultsArea.innerHTML = "<p style='text-align:center; margin-top:20px; color:#666'>Aucun trajet trouvé.</p>";
                    showNotification("Aucun trajet trouvé pour cette recherche", "error");
                } else {
                    showNotification(rides.length + " trajet(s) trouvé(s)", "success");
                }

                rides.forEach(ride => {
                    const div = document.createElement("div");
                    div.className = "result-item";
                    div.innerHTML = `
                        <div>
                            <strong>${ride.villeDepart} ➝ ${ride.villeArrivee}</strong><br>
                            <small style="color:#777"><i class="fa-regular fa-calendar"></i> ${ride.date}</small>
                        </div>
                        <div style="text-align:right">
                            <strong style="font-size:18px; color:#007bff">${ride.prix} €</strong><br>
                            <small style="color:${ride.nbPlaces > 0 ? '#2ecc71' : 'red'}">
                                ${ride.nbPlaces} place(s)
                            </small>
                        </div>
                    `;
                    const btn = document.createElement("button");
                    btn.textContent = "Réserver";
                    btn.style.marginLeft = "15px";
                    btn.onclick = () => bookRide(ride._id);
                    div.appendChild(btn);
                    resultsArea.appendChild(div);
                });
            } catch (error) { 
                console.error(error); 
            }
        });
    }

    // 4. Proposition de trajet
    const proposeForm = document.getElementById("proposeForm");
    if (proposeForm) {
        proposeForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const email = localStorage.getItem("email");
            
            if (!email) {
                return showNotification("Veuillez vous connecter pour publier.", "error");
            }

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
                    showNotification("Trajet publié avec succès !", "success");
                    proposeForm.reset();
                } else {
                    showNotification("Erreur lors de la publication.", "error");
                }
            } catch (error) { console.error(error); }
        });
    }
});

/* FONCTIONS UTILITAIRES */

function showNotification(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-exclamation"></i>';
    
    toast.innerHTML = `${icon} <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}

function checkAuth() {
    const firstName = localStorage.getItem("firstName");
    const authView = document.getElementById("auth-view");
    const appView = document.getElementById("app-view");
    const userDisplay = document.getElementById("userDisplay");

    if (firstName) { 
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
    if (!email) return showNotification("Connectez-vous pour réserver.", "error");
    
    fetch(API_URL + "/bookings", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idProposition: rideId, emailPassager: email })
    })
    .then(res => res.json())
    .then(data => {
        if(data.message && data.message.includes("confirmée")) {
             showNotification(data.message, "success");
             document.getElementById("searchForm").dispatchEvent(new Event('submit'));
        } else {
             showNotification(data.message || "Erreur réservation", "error");
        }
    })
    .catch(err => console.error(err));
}

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

