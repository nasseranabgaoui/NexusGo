const villes = [
    "Paris", "Lyon", "Marseille", "Toulouse", "Nice", 
    "Bordeaux", "Nantes", "Lille", "Rennes", "Strasbourg"
];

function setupAutocomplete(inputId, listId) {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);

    input.addEventListener("input", () => {
        const val = input.value.toLowerCase();
        list.innerHTML = "";

        if (val.length < 1) {
            list.style.display = "none";
            return;
        }

        const results = villes.filter(v => v.toLowerCase().includes(val));

        results.forEach(v => {
            const li = document.createElement("li");
            li.textContent = v;
            li.onclick = () => {
                input.value = v;
                list.style.display = "none";
            };
            list.appendChild(li);
        });

        list.style.display = results.length ? "block" : "none";
    });
}

setupAutocomplete("searchDepart", "autoDepart");
setupAutocomplete("searchArrivee", "autoArrivee");



