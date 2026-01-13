export default async function handler(req, res) {
  const crypto = require("crypto");

  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  const receivedHmac = req.headers["x-nowpayments-sig"];

  const body = JSON.stringify(req.body);
  const calculatedHmac = crypto
    .createHmac("sha512", ipnSecret)
    .update(body)
    .digest("hex");

  if (receivedHmac !== calculatedHmac) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const payment = req.body;

  // Example: mark artwork as sold
  if (payment.payment_status === "finished") {
    console.log("Crypto payment confirmed:", payment);
    // TODO: update your database or send email
  }

  res.status(200).json({ received: true });
}
