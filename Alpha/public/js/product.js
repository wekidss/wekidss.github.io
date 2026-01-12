// product.js
// Handles product listing, sorting, dynamic product pages, and sold-out logic

// Product data
const products = [
  {
    id: "artwork_1",
    name: "Sunset Dreams",
    price: 25,
    image: "/images/artwork-1.jpg",
    description: "A warm, colorful drawing inspired by sunsets.",
    year: 2024,
    ranking: 1,
    soldOut: false
  },
  {
    id: "artwork_2",
    name: "Forest Adventure",
    price: 30,
    image: "/images/artwork-2.jpg",
    description: "A playful drawing of a magical forest.",
    year: 2023,
    ranking: 2,
    soldOut: true   // SOLD OUT
  }
];

// Default sorting
let currentSort = "ranking";

// Change sorting method
function setSort(key) {
  currentSort = key;

  const rankingBtn = document.getElementById("sort-ranking-btn");
  const yearBtn = document.getElementById("sort-year-btn");

  if (rankingBtn && yearBtn) {
    rankingBtn.classList.toggle("active", key === "ranking");
    yearBtn.classList.toggle("active", key === "year");
  }

  renderProducts();
}

// Return sorted product list
function getSortedProducts() {
  const sorted = [...products];

  if (currentSort === "ranking") {
    sorted.sort((a, b) => a.ranking - b.ranking);
  } else if (currentSort === "year") {
    sorted.sort((a, b) => b.year - a.year);
  }

  return sorted;
}

// Render product list on products.html
function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  const sorted = getSortedProducts();

  container.innerHTML = sorted
    .map(
      (p) => `
      <article class="product-card">
        ${p.soldOut ? `<div class="soldout-badge">Sold Out</div>` : `<div class="rank-badge">Rank ${p.ranking}</div>`}

        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p class="price">$${p.price.toFixed(2)}</p>
        <p>${p.description}</p>
        <p class="product-meta">Year: ${p.year}</p>

        <div class="card-actions">
          <a class="btn-view" href="/product/${encodeURIComponent(p.id)}">View</a>

			${
			  p.soldOut
				? `<button class="btn-soldout" disabled>Sold Out</button>`
				: `
				  <button class="btn-buy" onclick="startCheckout('${p.id}')">Pay with Card</button>
				  <button class="btn-crypto" onclick="startCryptoCheckout('${p.id}')">Pay with Crypto</button>
				`
			}
        </div>
      </article>
    `
    )
    .join("");
}

// Render dynamic product page on product.html
function renderProductDetail() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const product = products.find((p) => p.id === id);

  if (!product) {
    container.innerHTML = "<p>Artwork not found.</p>";
    console.warn("Product not found:", id);
    return;
  }

  document.title = `${product.name} | [Child Name] Art`;

  container.innerHTML = `
    <img src="${product.image}" alt="${product.name}" />

    <div class="product-info">
      <h1>${product.name}</h1>
      <p class="price">$${product.price.toFixed(2)}</p>
      <p>${product.description}</p>
      <p class="product-meta">Year: ${product.year} • Rank: ${product.ranking}</p>

		 ${
		  product.soldOut
			? `<button class="btn-soldout" disabled>Sold Out</button>`
			: `
			  <button class="btn-buy" onclick="startCheckout('${product.id}')">Pay with Card</button>
			  <button class="btn-crypto" onclick="startCryptoCheckout('${product.id}')">Pay with Crypto</button>
			`
		}
    </div>
  `;
}

// Initialize correct page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("product-list")) {
    renderProducts();
  }
  if (document.getElementById("product-detail")) {
    renderProductDetail();
  }

});

