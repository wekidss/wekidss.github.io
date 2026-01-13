// checkout.js
// Handles Stripe Checkout Session creation via Vercel API
// Includes sold-out protection

const DEBUG = true; 
// DEBUG NOTE: Set to false before production to hide console logs.

// Coinbase Commerce checkout URLs
const CRYPTO_CHECKOUT_URLS = {
  artwork_1: "https://nowpayments.io/payment/?iid=4733451852&paymentId=4664375733",
  artwork_2: "https://nowpayments.io/payment/?iid=4733451852&paymentId=4664375733",
  donation: "https://nowpayments.io/payment/?iid=4733451852&paymentId=4664375733"
};

function startCryptoCheckout(productId) {
  const url = CRYPTO_CHECKOUT_URLS[productId];

  if (!url) {
    alert("Crypto checkout not available for this item.");
    return;
  }

  window.location.href = url;
}

function startCryptoDonation() {
  const url = CRYPTO_CHECKOUT_URLS.donation;

  if (!url) {
    alert("Crypto donation is not available right now.");
    return;
  }

  window.location.href = url;
}

// Create a checkout session via serverless API
async function createCheckoutSession(payload) {
  try {
    if (DEBUG) console.log("Creating checkout session:", payload);

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Checkout session error:", data);
      alert("Unable to start checkout. Please contact us.");
      return;
    }

    if (DEBUG) console.log("Stripe redirect URL:", data.url);

    window.location.href = data.url;
  } catch (err) {
    console.error("Network/server error:", err);
    alert("Something went wrong. Please try again later.");
  }
}

// BUY ARTWORK
function startCheckout(productId) {
  const product = products.find(p => p.id === productId);

  // SOLD OUT PROTECTION
  if (product && product.soldOut) {
    alert("Sorry, this artwork is sold out.");
    return;
  }

  if (DEBUG) console.log("startCheckout:", productId);

  createCheckoutSession({
    mode: "payment",
    productId,
    successUrl: window.location.origin + "/thankyou",
    cancelUrl: window.location.origin + "/products"
  });
}

// DONATION LOGIC
let donationType = "recurring"; 
let donationFrequency = "monthly"; 

function setDonationType(type) {
  donationType = type;
  if (DEBUG) console.log("Donation type:", type);

  const recurringBtn = document.getElementById("donate-recurring-btn");
  const oneoffBtn = document.getElementById("donate-oneoff-btn");
  const freqSection = document.getElementById("donation-frequency");

  if (recurringBtn && oneoffBtn) {
    recurringBtn.classList.toggle("active", type === "recurring");
    oneoffBtn.classList.toggle("active", type === "oneoff");
  }

  if (freqSection) {
    freqSection.style.display = type === "recurring" ? "flex" : "none";
  }
}

function setDonationFrequency(freq) {
  donationFrequency = freq;
  if (DEBUG) console.log("Donation frequency:", freq);

  const monthlyBtn = document.getElementById("freq-monthly-btn");
  const yearlyBtn = document.getElementById("freq-yearly-btn");

  if (monthlyBtn && yearlyBtn) {
    monthlyBtn.classList.toggle("active", freq === "monthly");
    yearlyBtn.classList.toggle("active", freq === "yearly");
  }
}

function startDonation(amount) {
  if (DEBUG) console.log("startDonation:", amount, donationType, donationFrequency);

  let mode = "donation";
  let productId = null;
  let finalAmount = null;

  if (donationType === "oneoff") {
    mode = "donation";

    if (amount === "custom") {
      const custom = prompt("Enter donation amount (numbers only):");
      if (!custom) return;
      finalAmount = Math.round(Number(custom) * 100);
    } else {
      finalAmount = amount * 100;
    }
  } else if (donationType === "recurring") {
    mode = "subscription";
    productId = donationFrequency === "monthly" ? "donation_monthly" : "donation_yearly";
  }

  createCheckoutSession({
    mode,
    productId,
    amount: finalAmount,
    successUrl: window.location.origin + "/thankyou",
    cancelUrl: window.location.origin + "/donate"
  });
}

// Initialize donation page defaults
document.addEventListener("DOMContentLoaded", () => {
  if (document.body.contains(document.getElementById("donation-frequency"))) {
    setDonationType("recurring");
    setDonationFrequency("monthly");
  }

});
