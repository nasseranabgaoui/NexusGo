const API_URL = "https://nexusgo.onrender.com";

//Éléments du DOM
const authView = document.getElementById('auth-view');
const appView = document.getElementById('app-view');
const userDisplay = document.getElementById('userDisplay');

//Gestion de l'état 
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        authView.classList.add('hidden');
        appView.classList.remove('hidden');
        userDisplay.innerText = "Welcome, " + localStorage.getItem('userPrenom');
    } else {
        authView.classList.remove('hidden');
        appView.classList.add('hidden');
    }
}

checkAuth();

//Authentification
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email, 
                motDePasse: password 
            })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userPrenom', data.user.prenom);
            checkAuth(); 
        } else {
            document.getElementById('loginError').innerText = data.message;
        }
    } catch (err) { console.error(err); }
});

//Déconnexion
window.logout = function() {
    localStorage.clear();
    checkAuth();
};

//Utilitaires de Date
function formatToSixDigits(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const year = date.getFullYear().toString().slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return Number(year + month + day);
}

function formatFromSixDigits(num) {
    const str = num.toString();
    return `${str.slice(4,6)}/${str.slice(2,4)}/20${str.slice(0,2)}`;
}

// Proposer un trajet
document.getElementById('proposeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const body = {
        emailConducteur: localStorage.getItem('userEmail'),
        villeDepart: document.getElementById('villeDepart').value,
        villeArrivee: document.getElementById('villeArrivee').value,
        date: formatToSixDigits(document.getElementById('dateInput').value),
        nbPlaces: Number(document.getElementById('nbPlaces').value),
        prix: Number(document.getElementById('prix').value)
    };

    try {
        const res = await fetch(`${API_URL}/rides`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        if (res.ok) {
            alert("Ride published successfully");
            document.getElementById('proposeForm').reset();
        } else {
            const data = await res.json();
            alert("Error: " + (data.message || data.error));
        }
    } catch (err) { console.error(err); }
});

// Rechercher un trajet
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const depart = document.getElementById('searchDepart').value;
    const arrivee = document.getElementById('searchArrivee').value;
    const dateRaw = document.getElementById('searchDate').value;

    let url = `${API_URL}/rides?`;
    if (depart) url += `villeDepart=${depart}&`;
    if (arrivee) url += `villeArrivee=${arrivee}&`;
    if (dateRaw) url += `date=${formatToSixDigits(dateRaw)}`;

    try {
        const res = await fetch(url);
        const rides = await res.json();
        displayResults(rides);
    } catch (err) { console.error(err); }
});

function displayResults(rides) {
    const zone = document.getElementById('resultsArea');
    zone.innerHTML = "";
    
    if (rides.length === 0) { 
        zone.innerHTML = "<p>No rides found.</p>"; 
        return; 
    }

    rides.forEach(ride => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <div>
                <strong>${ride.villeDepart} -> ${ride.villeArrivee}</strong><br>
                Date: ${formatFromSixDigits(ride.date)} | Price: ${ride.prix}€ | Seats: ${ride.nbPlaces}
            </div>
            <button onclick="bookRide('${ride._id}')" style="width:auto">Book</button>
        `;
        zone.appendChild(div);
    });
}

// Réserver un trajet
window.bookRide = async function(id) {
    if (!confirm("Confirm booking?")) return;
    
    try {
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idProposition: id, 
                emailPassager: localStorage.getItem('userEmail') 
            })
        });

        if (res.ok) {
            alert("Booking successful");
            document.getElementById('searchForm').dispatchEvent(new Event('submit'));
        } else {
            const data = await res.json();
            alert("Error: " + (data.message || data.error));
        }
    } catch (err) { console.error(err); }
};
