const form = document.querySelector("#search-form");
const input = document.querySelector("#location-input");
const resultsTitle = document.querySelector("#results-title");
const resultsCount = document.querySelector("#results-count");
const resultsList = document.querySelector("#results-list");
const emptyState = document.querySelector("#empty-state");
const scoreReadout = document.querySelector("#score-readout");
const filterButtons = [...document.querySelectorAll(".filter-chip")];

const templates = [
  {
    name: "El Comal Verde",
    style: "street",
    rating: 4.9,
    price: "$",
    minutes: 8,
    tags: ["al pastor", "handmade tortillas", "salsa bar"],
    reason: "Best overall balance of smoky meat, bright salsa, and fast service."
  },
  {
    name: "Masa & Lime",
    style: "veg",
    rating: 4.8,
    price: "$$",
    minutes: 12,
    tags: ["mushroom asada", "blue corn masa", "veg-friendly"],
    reason: "Great for mixed groups, with vegetable fillings that taste intentional."
  },
  {
    name: "Taco Mar Azul",
    style: "seafood",
    rating: 4.7,
    price: "$$",
    minutes: 15,
    tags: ["fish taco", "shrimp", "citrus slaw"],
    reason: "Crisp seafood tacos with clean acidity and generous portions."
  },
  {
    name: "La Esquina Roja",
    style: "late",
    rating: 4.6,
    price: "$",
    minutes: 18,
    tags: ["open late", "barbacoa", "consomme"],
    reason: "The dependable late-night stop when the craving shows up after plans."
  }
];

let currentLocation = "";
let activeFilter = "all";

function locationSeed(text) {
  return [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function buildResults(location) {
  const seed = locationSeed(location);
  return templates.map((item, index) => ({
    ...item,
    minutes: item.minutes + ((seed + index * 3) % 7),
    rating: Math.min(5, item.rating + ((seed + index) % 3) / 20),
    neighborhood: ["near downtown", "by the market", "off the main strip", "close to the park"][(seed + index) % 4]
  }));
}

function render() {
  const hasLocation = currentLocation.trim().length > 0;
  const allResults = hasLocation ? buildResults(currentLocation) : [];
  const filtered = activeFilter === "all" ? allResults : allResults.filter((item) => item.style === activeFilter);

  emptyState.hidden = hasLocation;
  resultsList.hidden = !hasLocation;
  resultsTitle.textContent = hasLocation ? `Best tacos near ${currentLocation}` : "Start with a location";
  resultsCount.textContent = hasLocation ? `${filtered.length} pick${filtered.length === 1 ? "" : "s"}` : "3 picks";
  scoreReadout.textContent = hasLocation ? 91 + (locationSeed(currentLocation) % 8) : 94;

  resultsList.innerHTML = filtered.map((place, index) => {
    const query = encodeURIComponent(`${place.name} tacos near ${currentLocation}`);
    const tags = place.tags.map((tag) => `<span>${tag}</span>`).join("");
    return `
      <article class="place-card">
        <div class="rank">${index + 1}</div>
        <div>
          <h3>${place.name}</h3>
          <div class="meta">${place.neighborhood} · ${place.minutes} min · ${place.price}</div>
          <p class="reason">${place.reason}</p>
          <div class="tag-row">${tags}</div>
        </div>
        <div class="place-actions">
          <div class="rating">${place.rating.toFixed(1)}</div>
          <a href="https://www.google.com/maps/search/?api=1&query=${query}" target="_blank" rel="noreferrer">Map</a>
        </div>
      </article>
    `;
  }).join("");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  currentLocation = input.value.trim() || "your area";
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    render();
  });
});

render();
