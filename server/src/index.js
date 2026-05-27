import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import meRouter from "./routes/me.js";
import checkoutRouter from "./routes/checkout.js";
import { stripeWebhook } from "./routes/stripeWebhook.js";
import ordersRouter from "./routes/orders.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));

// ⚠️ Webhook AVANT express.json() — il a besoin du body brut
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// JSON parser pour tout le reste
app.use(express.json());

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