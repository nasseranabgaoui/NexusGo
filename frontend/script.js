const API_URL = "https://nexusgo.onrender.com";

// Initialization
window.onload = function() {
    checkAuth();
    blockPastDates();
};

// Login
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
                alert("Login successful");
            } else {
                document.getElementById("loginError").textContent = data.message;
            }
        } catch (error) {
            console.error(error);
        }
    });
}

function checkAuth() {
    const token = localStorage.getItem("token");
    const firstName = localStorage.getItem("firstName");
    
    const authView = document.getElementById("auth-view");
    const appView = document.getElementById("app-view");
    const userDisplay = document.getElementById("userDisplay");

    if (token) {
        if (authView) authView.classList.add("hidden");
        if (appView) appView.classList.remove("hidden");
        if (userDisplay) userDisplay.textContent = firstName;
    } else {
        if (authView) authView.classList.remove("hidden");
        if (appView) appView.classList.add("hidden");
    }
}

function logout() {
    localStorage.clear();
    window.location.reload();
}

// Search
const searchForm = document.getElementById("searchForm");

if (searchForm) {
    searchForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const departure = document.getElementById("searchDepart").value;
        const arrival = document.getElementById("searchArrivee").value;
        const dateRaw = document.getElementById("searchDate").value;
        
        let url = API_URL + "/rides?villeDepart=" + departure + "&villeArrivee=" + arrival;
        
        if (dateRaw) {
            const dateFormatted = formatDate(dateRaw);
            url += "&date=" + dateFormatted;
        }

        try {
            const res = await fetch(url);
            const rides = await res.json();
            const resultsArea = document.getElementById("resultsArea");
            resultsArea.innerHTML = "";

            if (rides.length === 0) {
                resultsArea.innerHTML = "<p style='text-align:center; margin-top:20px;'>No rides found.</p>";
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
                        <small>${ride.nbPlaces} seats</small>
                    </div>
                `;
                
                const btn = document.createElement("button");
                btn.textContent = "Book";
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

// Publish Ride
const proposeForm = document.getElementById("proposeForm");

if (proposeForm) {
    proposeForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const email = localStorage.getItem("email");
        if (!email) return alert("Please login first.");

        const departure = document.getElementById("proposeDepart").value;
        const arrival = document.getElementById("proposeArrivee").value;
        const dateRaw = document.getElementById("proposeDate").value;
        const price = document.getElementById("proposePrix").value;
        const seats = document.getElementById("proposePlaces").value;

        const dateFormatted = formatDate(dateRaw);

        try {
            const res = await fetch(API_URL + "/rides", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    emailConducteur: email,
                    villeDepart: departure,
                    villeArrivee: arrival,
                    date: dateFormatted,
                    prix: price,
                    nbPlaces: seats
                })
            });

            if (res.ok) {
                alert("Ride published successfully!");
                proposeForm.reset();
            } else {
                alert("Error publishing ride.");
            }
        } catch (error) {
            console.error(error);
        }
    });
}

// Booking
async function bookRide(rideId) {
    const email = localStorage.getItem("email");
    if (!email) return alert("Please login first.");

    try {
        const res = await fetch(API_URL + "/bookings", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idProposition: rideId, emailPassager: email })
        });
        const data = await res.json();
        
        if (res.ok) {
            alert("Booking confirmed!");
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error(error);
    }
}

// Date Utilities
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


