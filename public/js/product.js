// ---------- Product Data (temporary, static) ----------
const PRODUCTS = {
  "product-1": {
    id: "product-1",
    name: "Product One",
    price: 10.00,
    currency: "AUD",
    image: "public/images/product1.jpg",
    description: "This is Product One description.",
    priceId: "price_1SmknVH3aPcREejmaSTXb1ye"
  },
  "product-2": {
    id: "product-2",
    name: "Product Two",
    price: 20.00,
    currency: "AUD",
    image: "public/images/product2.jpg",
    description: "This is Product Two description.",
    priceId: "price_1SmkqWH3aPcREejmHMhIg7nL"
  }
};

// ---------- Helpers ----------
function formatPrice(amount) {
  return `$${amount.toFixed(2)}`;
}

// ---------- Stripe Checkout ----------
async function startCheckout(priceId) {
  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ priceId })
    });

    const data = await response.json();

    if (!data.url) {
      console.error("No checkout URL returned", data);
      return;
    }

    window.location.href = data.url;
  } catch (err) {
    console.error("Checkout error:", err);
  }
}
