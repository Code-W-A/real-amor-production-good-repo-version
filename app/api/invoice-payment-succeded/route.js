// // app/api/invoice-payment-succeded/route.js
// import Stripe from "stripe";
// import { buffer } from "micro";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST);

// export const config = {
//   api: {
//     bodyParser: false, // Stripe necesită raw body pentru webhook-uri
//   },
// };

// // Modificăm funcția handler într-o funcție denumită pentru metoda POST
// export async function POST(req) {
//   const buf = await buffer(req);
//   const sig = req.headers.get("stripe-signature");

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       buf,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("⚠️ Webhook signature verification failed.", err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }

//   // Gestionăm doar evenimentul de plată reușită a facturii
//   if (event.type === "invoice.payment_succeeded") {
//     const invoice = event.data.object;
//     console.log("📧 Invoice sent to:", invoice.customer_email);
//     // Stripe va trimite automat factura pe email dacă setările de email sunt active în Stripe Dashboard
//   }

//   return new Response(JSON.stringify({ received: true }), { status: 200 });
// }
