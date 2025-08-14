import { Product } from "../lib/types";

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality sound, noise-cancelling, 30h battery.",
    price: 129.99,
    category: "Electronics",
    emoji: "🎧",
  },
  {
    id: "2",
    name: "Yoga Mat",
    description: "Non-slip, eco-friendly, 6mm thick.",
    price: 29.99,
    category: "Fitness",
    emoji: "🧘‍♂️",
  },
  {
    id: "3",
    name: "Espresso Maker",
    description: "Stainless steel, 15-bar pump, compact size.",
    price: 89.99,
    category: "Home",
    emoji: "☕",
  },
  {
    id: "4",
    name: "Running Shoes",
    description: "Lightweight, breathable, cushioned sole.",
    price: 74.99,
    category: "Fitness",
    emoji: "👟",
  },
  {
    id: "5",
    name: "Smart Watch",
    description: "Heart rate, GPS, 7-day battery.",
    price: 199.99,
    category: "Electronics",
    emoji: "⌚",
  },
  {
    id: "6",
    name: "Desk Lamp",
    description: "LED, adjustable arm, touch control.",
    price: 39.99,
    category: "Home",
    emoji: "💡",
  },
  {
    id: "7",
    name: "Cookware Set",
    description: "Non-stick, 10 pieces, oven safe.",
    price: 119.99,
    category: "Home",
    emoji: "🍳",
  },
  {
    id: "8",
    name: "Bluetooth Speaker",
    description: "Portable, waterproof, 12h playtime.",
    price: 49.99,
    category: "Electronics",
    emoji: "🔊",
  },
];

export const categories = [
  "All",
  ...Array.from(new Set(products.map((p) => p.category))),
];
