"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

// Static product data
const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-fidelity sound, noise-cancelling.",
    price: 129.99,
    category: "Electronics",
    emoji: "🎧",
  },
  {
    id: "2",
    name: "Espresso Maker",
    description: "Brew barista-quality espresso at home.",
    price: 89.99,
    category: "Home",
    emoji: "☕",
  },
  {
    id: "3",
    name: "Yoga Mat",
    description: "Non-slip, eco-friendly material.",
    price: 29.99,
    category: "Fitness",
    emoji: "🧘",
  },
  {
    id: "4",
    name: "Smart Watch",
    description: "Track your health and notifications.",
    price: 199.99,
    category: "Electronics",
    emoji: "⌚",
  },
  {
    id: "5",
    name: "Desk Lamp",
    description: "LED, adjustable brightness.",
    price: 24.99,
    category: "Home",
    emoji: "💡",
  },
  {
    id: "6",
    name: "Running Shoes",
    description: "Lightweight, breathable, durable.",
    price: 59.99,
    category: "Fitness",
    emoji: "👟",
  },
  {
    id: "7",
    name: "Bluetooth Speaker",
    description: "Portable, waterproof, long battery.",
    price: 49.99,
    category: "Electronics",
    emoji: "🔊",
  },
  {
    id: "8",
    name: "Aroma Diffuser",
    description: "Ultrasonic, quiet, mood lighting.",
    price: 34.99,
    category: "Home",
    emoji: "🌸",
  },
  {
    id: "9",
    name: "Dumbbell Set",
    description: "Adjustable weights, ergonomic grip.",
    price: 79.99,
    category: "Fitness",
    emoji: "🏋️",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    setCart(getCartFromStorage());
  }, []);

  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const filteredProducts = selectedCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  function addToCart(productId: string) {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { productId, quantity: 1 }];
      }
    });
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }

  function increment(productId: string) {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decrement(productId: string) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background/80 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight">🛒 Modern Store</h1>
          <Button
            variant="outline"
            className="relative"
            aria-label="View cart"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5 font-semibold">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Category Filters */}
      <nav className="max-w-5xl mx-auto px-4 mt-8 mb-4">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className={cn(
                "capitalize transition-colors",
                selectedCategory === cat && "ring-2 ring-primary ring-offset-2"
              )}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </nav>

      {/* Product Grid */}
      <main className="flex-1 max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const inCart = cart.find((item) => item.productId === product.id);
            return (
              <Card key={product.id} className="flex flex-col h-full">
                <CardHeader className="flex flex-col items-center pb-2">
                  <div className="text-5xl mb-2" aria-label={product.name}>{product.emoji}</div>
                  <CardTitle className="text-lg font-semibold text-center">{product.name}</CardTitle>
                  <CardDescription className="text-center text-muted-foreground">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="capitalize">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="text-xl font-bold mb-2">${product.price.toFixed(2)}</div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  {inCart ? (
                    <div className="flex items-center gap-2 w-full">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => decrement(product.id)}
                        aria-label="Decrease quantity"
                        className="h-8 w-8"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-semibold text-base w-6 text-center">{inCart.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => increment(product.id)}
                        aria-label="Increase quantity"
                        className="h-8 w-8"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeFromCart(product.id)}
                        aria-label="Remove from cart"
                        className="ml-auto h-8 w-8"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => addToCart(product.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
            onClick={() => setCartOpen(false)}
          />
          <aside className="relative w-full max-w-md h-full bg-background shadow-xl flex flex-col border-l border-border animate-in slide-in-from-right-32 duration-300 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Cart
              </h2>
              <Button variant="ghost" onClick={() => setCartOpen(false)} aria-label="Close cart">
                Close
              </Button>
            </div>
            <Separator className="mb-4" />
            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center text-muted-foreground mt-16">Your cart is empty.</div>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;
                    return (
                      <li key={item.productId} className="flex items-center gap-4">
                        <div className="text-3xl" aria-label={product.name}>{product.emoji}</div>
                        <div className="flex-1">
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-muted-foreground">${product.price.toFixed(2)} × {item.quantity}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => decrement(product.id)}
                            aria-label="Decrease quantity"
                            className="h-7 w-7"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold w-5 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => increment(product.id)}
                            aria-label="Increase quantity"
                            className="h-7 w-7"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeFromCart(product.id)}
                          aria-label="Remove from cart"
                          className="ml-2 h-7 w-7"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold">${cartTotal.toFixed(2)}</span>
            </div>
            <Button
              variant="default"
              className="w-full text-base font-semibold"
              disabled={cart.length === 0}
              onClick={() => setCart([])}
            >
              Checkout
            </Button>
          </aside>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t bg-background/80 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Modern Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
