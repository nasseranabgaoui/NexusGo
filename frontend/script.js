const API_URL = "https://nexusgo.onrender.com";

// ==================== VUES ====================
const authView = document.getElementById('auth-view');
const appView  = document.getElementById('app-view');
const userDisplay = document.getElementById('userDisplay');

// ==================== AUTH ====================
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        authView.classList.add("hidden");
        appView.classList.remove("hidden");
        userDisplay.innerText = "Welcome, " + localStorage.getItem('userPrenom');
    } else {
        authView.classList.remove("hidden");
        appView.classList.add("hidden");
    }
}
checkAuth();

// LOGIN
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const motDePasse = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, motDePasse })
    });

    const data = await res.json();

    if (res.ok) {
        localStorage.setItem('token', "OK");
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userPrenom', data.user.prenom);
        checkAuth();
    } else {
        document.getElementById("loginError").innerText = data.message;
    }
});

// LOGOUT
window.logout = () => {
    localStorage.clear();
    checkAuth();
};

// ==================== UTILITAIRES ====================
function formatToSixDigits(dateStr) {
    const d = new Date(dateStr);
    return Number(
        d.getFullYear().toString().slice(-2) +
        ("0"+(d.getMonth()+1)).slice(-2) +
        ("0"+d.getDate()).slice(-2)
    );
}

function formatFromSixDigits(n) {
    n = n.toString();
    return `${n.slice(4,6)}/${n.slice(2,4)}/20${n.slice(0,2)}`;
}

// ==================== PROPOSER ====================
document.getElementById('proposeForm').addEventListener('submit', async (e)=>{
    e.preventDefault();

    const body = {
        emailConducteur: localStorage.getItem('userEmail'),
        villeDepart: document.getElementById('villeDepart').value,
        villeArrivee: document.getElementById('villeArrivee').value,
        date: formatToSixDigits(document.getElementById('dateInput').value),
        nbPlaces: Number(document.getElementById('nbPlaces').value),
        prix: Number(document.getElementById('prix').value)
    };

    const res = await fetch(`${API_URL}/rides`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (res.ok) alert("Ride published");
});

// ==================== RECHERCHE ====================
document.getElementById('searchForm').addEventListener('submit', async (e)=>{
    e.preventDefault();

    let url = `${API_URL}/rides?`;

    const d = document.getElementById('searchDepart').value;
    const a = document.getElementById('searchArrivee').value;
    const dt = document.getElementById('searchDate').value;

    if (d)  url += `villeDepart=${d}&`;
    if (a)  url += `villeArrivee=${a}&`;
    if (dt) url += `date=${formatToSixDigits(dt)}`;

    const res = await fetch(url);
    const rides = await res.json();

    displayResults(rides);
});

function displayResults(rides) {
    const zone = document.getElementById('resultsArea');
    zone.innerHTML = "";

    if (!rides.length) return zone.innerHTML = "<p>No rides found</p>";

    rides.forEach(r => {
        const div = document.createElement("div");
        div.className = "result-item";
        div.innerHTML = `
            <strong>${r.villeDepart} → ${r.villeArrivee}</strong><br>
            Date: ${formatFromSixDigits(r.date)} | Price: ${r.prix}€ | Seats: ${r.nbPlaces}
            <br><button onclick="bookRide('${r._id}')">Book</button>
        `;
        zone.appendChild(div);
    });
}

// ==================== RESERVER ====================
window.bookRide = async function(id) {
    const ok = confirm("Confirm booking?");
    if (!ok) return;

    const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            idProposition: id,
            emailPassager: localStorage.getItem("userEmail")
        })
    });

    if (res.ok) alert("Booking successful");
};


