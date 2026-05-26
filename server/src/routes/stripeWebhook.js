import stripe from "../lib/stripe.js";
import prisma from "../prisma.js";

export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // On gère le paiement réussi
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = parseInt(session.metadata.orderId, 10);

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      // Idempotence : si déjà payée, on ne refait rien
      if (!order || order.status === "PAID") {
        return res.json({ received: true });
      }

      // Transaction atomique : MAJ commande + décrément stock
      await prisma.$transaction([
        prisma.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        }),
        ...order.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        ),
      ]);

      console.log(`✅ Order ${orderId} marked as PAID`);
    } catch (err) {
      console.error("Order update error:", err);
      return res.status(500).send("Internal error");
    }
  }

  res.json({ received: true });
}