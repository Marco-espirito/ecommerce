import express from "express";
import prisma from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/orders — historique de l'user connecté
router.get("/", requireAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;