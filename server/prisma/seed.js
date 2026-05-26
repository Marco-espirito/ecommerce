import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Casque audio Bluetooth",
    description: "Casque sans fil avec réduction de bruit active, autonomie 30h.",
    priceCents: 12900,
    stock: 25,
    imageUrl: "https://picsum.photos/seed/headphones/600/400",
    category: "audio",
  },
  {
    name: "Clavier mécanique RGB",
    description: "Clavier gaming switches bleus, rétroéclairage personnalisable.",
    priceCents: 8900,
    stock: 40,
    imageUrl: "https://picsum.photos/seed/keyboard/600/400",
    category: "peripherique",
  },
  {
    name: "Souris ergonomique",
    description: "Souris verticale sans fil, idéale pour réduire les TMS.",
    priceCents: 4500,
    stock: 60,
    imageUrl: "https://picsum.photos/seed/mouse/600/400",
    category: "peripherique",
  },
  {
    name: "Webcam Full HD",
    description: "Webcam 1080p 60fps avec micro stéréo intégré.",
    priceCents: 7900,
    stock: 30,
    imageUrl: "https://picsum.photos/seed/webcam/600/400",
    category: "video",
  },
  {
    name: "Écran 27\" 144Hz",
    description: "Moniteur QHD IPS pour gaming et création.",
    priceCents: 34900,
    stock: 15,
    imageUrl: "https://picsum.photos/seed/monitor/600/400",
    category: "ecran",
  },
  {
    name: "Disque SSD 1To NVMe",
    description: "SSD haute performance, lecture 7000 Mo/s.",
    priceCents: 11900,
    stock: 50,
    imageUrl: "https://picsum.photos/seed/ssd/600/400",
    category: "stockage",
  },
  {
    name: "Hub USB-C 7-en-1",
    description: "HDMI 4K, USB 3.0, lecteur SD, Power Delivery 100W.",
    priceCents: 5900,
    stock: 80,
    imageUrl: "https://picsum.photos/seed/hub/600/400",
    category: "accessoire",
  },
  {
    name: "Enceinte portable",
    description: "Enceinte Bluetooth étanche IPX7, 24h d'autonomie.",
    priceCents: 8500,
    stock: 35,
    imageUrl: "https://picsum.photos/seed/speaker/600/400",
    category: "audio",
  },
  {
    name: "Tapis de souris XL",
    description: "Tapis gaming 90x40cm, surface tissée optimisée.",
    priceCents: 2900,
    stock: 100,
    imageUrl: "https://picsum.photos/seed/mousepad/600/400",
    category: "accessoire",
  },
  {
    name: "Chargeur USB-C 65W",
    description: "Chargeur GaN compact, compatible laptop et smartphone.",
    priceCents: 3900,
    stock: 70,
    imageUrl: "https://picsum.photos/seed/charger/600/400",
    category: "accessoire",
  },
  {
    name: "Micro USB cardioïde",
    description: "Micro de studio pour podcast et streaming, plug & play.",
    priceCents: 9900,
    stock: 20,
    imageUrl: "https://picsum.photos/seed/mic/600/400",
    category: "audio",
  },
  {
    name: "Support laptop ergonomique",
    description: "Support aluminium réglable, ventilation optimisée.",
    priceCents: 4900,
    stock: 45,
    imageUrl: "https://picsum.photos/seed/stand/600/400",
    category: "accessoire",
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Nettoyer les anciennes données (dans l'ordre à cause des relations)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // Insérer les produits
  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ ${products.length} produits insérés`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur de seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });