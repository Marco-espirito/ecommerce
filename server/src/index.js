import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import meRouter from "./routes/me.js";
import checkoutRouter from "./routes/checkout.js";
import { stripeWebhook } from "./routes/stripeWebhook.js";
import ordersRouter from "./routes/orders.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

app.use(helmet());

// CORS
app.use(cors({ origin: process.env.CLIENT_URL }));

// ⚠️ Webhook AVANT express.json() — il a besoin du body brut
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// JSON parser pour tout le reste
app.use(express.json());

// 🛡️ Rate limit global : max 100 requêtes / IP / 15 min sur toute l'API
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Trop de requêtes, ralentissez" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", globalLimiter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", ordersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});