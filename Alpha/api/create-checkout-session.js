// /api/create-checkout-session.js
// Secure Stripe Checkout Session creation (server-side only)

import Stripe from "stripe";

console.log("ENV KEY:", process.env.STRIPE_SECRET_KEY);
console.log("PRICE ID:", PRICE_IDS[productId]);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { mode, productId, amount, successUrl, cancelUrl } = req.body;

    if (!mode || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Map product IDs to Stripe Price IDs
    const PRICE_IDS = {
      artwork_1: "price_xxx_artwork1",   // replace with your real Stripe price IDs
      artwork_2: "price_xxx_artwork2",
      donation_monthly: "price_xxx_monthly",
      donation_yearly: "price_xxx_yearly"
    };

    let sessionConfig = {
      mode,
      success_url: successUrl,
      cancel_url: cancelUrl
    };

    // BUY ARTWORK (one-time payment)
    if (mode === "payment") {
      const priceId = PRICE_IDS[productId];
      if (!priceId) {
        return res.status(400).json({ error: "Invalid productId" });
      }

      sessionConfig.line_items = [
        {
          price: priceId,
          quantity: 1
        }
      ];
    }

    // RECURRING DONATION (subscription)
    else if (mode === "subscription") {
      const priceId = PRICE_IDS[productId];
      if (!priceId) {
        return res.status(400).json({ error: "Invalid subscription productId" });
      }

      sessionConfig.line_items = [
        {
          price: priceId,
          quantity: 1
        }
      ];
    }

    // ONE-OFF DONATION (custom amount)
    else if (mode === "donation") {
      if (!amount || amount < 100) {
        return res.status(400).json({ error: "Invalid donation amount" });
      }

      sessionConfig.mode = "payment";
      sessionConfig.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation to young artist"
            },
            unit_amount: amount
          },
          quantity: 1
        }
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }

}


