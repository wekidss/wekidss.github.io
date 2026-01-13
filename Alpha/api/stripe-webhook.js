// /api/stripe-webhook.js
import Stripe from "stripe";
import { Resend } from "resend";

export const config = {
  api: {
    bodyParser: false, // Stripe requires raw body
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on("data", (chunk) => chunks.push(chunk));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const amount = session.amount_total / 100;
    const email = session.customer_details?.email || "Unknown email";

    console.log("Donation/payment received:", amount, email);

    // Send confirmation email
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: "New Donation Received",
        html: `
          <h2>New Donation Received</h2>
          <p><strong>Amount:</strong> $${amount}</p>
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Type:</strong> ${session.mode}</p>
        `,
      });
    } catch (emailErr) {
      console.error("Email sending error:", emailErr);
    }
  }

  res.json({ received: true });
}
