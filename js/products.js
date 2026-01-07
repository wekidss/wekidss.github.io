// ---------- Product Data (temporary, static) ----------
const PRODUCTS = {
  "product-1": {
    id: "product-1",
    name: "Product One",
    price: 10.00,
    currency: "AUD",
    image: "images/product1.jpg",
    description: "This is Product One description.",
    priceId: "price_1SmknVH3aPcREejmaSTXb1ye"
  },
  "product-2": {
    id: "product-2",
    name: "Product Two",
    price: 20.00,
    currency: "AUD",
    image: "images/product2.jpg",
    description: "This is Product Two description.",
    priceId: "price_1SmkqWH3aPcREejmHMhIg7nL"
  }
};

// ---------- Utility ----------
function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}
