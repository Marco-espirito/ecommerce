import express from "express";
import { z } from "zod";
import prisma from "../prisma.js";
import stripe from "../lib/stripe.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Le panier est vide"),
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { items } = parsed.data;

    // 🔒 Recalcul des prix CÔTÉ SERVEUR (jamais faire confiance au client)
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== items.length) {
      return res.status(400).json({ error: "Produit inexistant" });
    }

    // Vérification du stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuffisant pour ${product.name}`,
        });
      }
    }

    // Calcul du total avec les vrais prix en base
    let totalCents = 0;
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const lineTotal = product.priceCents * item.quantity;
      totalCents += lineTotal;
      return {
        productId: product.id,
        quantity: item.quantity,
        unitPriceCents: product.priceCents,
      };
    });

    // Création de la commande en base (status PENDING)
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalCents,
        status: "PENDING",
        items: { create: orderItemsData },
      },
    });

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.name,
              description: product.description.slice(0, 200),
              images: product.imageUrl ? [product.imageUrl] : [],
            },
            unit_amount: product.priceCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/commande-confirmee?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/panier`,
      metadata: {
        orderId: order.id.toString(),
      },
    });

    // Sauvegarde l'ID de session pour le réconcilier au webhook
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;