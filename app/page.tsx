"use client";

import { useState, useMemo } from "react";
import { categories, products } from "../lib/store-data";
import { Category, Product, CartItem } from "../lib/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

function getInitialCart(): CartItem[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cart");
    if (stored) return JSON.parse(stored);
  }
  return [];
}

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);
  const [cartOpen, setCartOpen] = useState(false);

  // Persist cart to localStorage
  function updateCart(newCart: CartItem[]) {
    setCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  }

  function addToCart(product: Product) {
    const idx = cart.findIndex((item) => item.product.id === product.id);
    let newCart;
    if (idx > -1) {
      newCart = cart.map((item, i) =>
        i === idx ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { product, quantity: 1 }];
    }
    updateCart(newCart);
  }

  function removeFromCart(productId: string) {
    const idx = cart.findIndex((item) => item.product.id === productId);
    if (idx === -1) return;
    let newCart;
    if (cart[idx].quantity > 1) {
      newCart = cart.map((item, i) =>
        i === idx ? { ...item, quantity: item.quantity - 1 } : item
      );
    } else {
      newCart = cart.filter((item) => item.product.id !== productId);
    }
    updateCart(newCart);
  }

  function clearCart() {
    updateCart([]);
  }

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.categoryId === selectedCategory);
  }, [selectedCategory]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background/80 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight">🛒 Next Store</h1>
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative" aria-label="Open cart">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full text-xs px-1.5 py-0.5 font-semibold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px] max-w-full flex flex-col">
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <Separator className="my-2" />
              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center text-muted-foreground mt-8">Your cart is empty.</div>
                ) : (
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li key={item.product.id} className="flex items-center gap-3">
                        <div className="text-2xl">{item.product.emoji}</div>
                        <div className="flex-1">
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-muted-foreground">{formatPrice(item.product.price)} × {item.quantity}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.product.id)} aria-label="Remove one">
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-2 text-sm">{item.quantity}</span>
                          <Button size="icon" variant="ghost" onClick={() => addToCart(item.product)} aria-label="Add one">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => updateCart(cart.filter((i) => i.product.id !== item.product.id))} aria-label="Remove item">
                          <X className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between font-semibold text-lg mb-2">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <Button variant="destructive" className="w-full" onClick={clearCart} disabled={cart.length === 0}>
                Clear Cart
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Category Filters */}
      <nav className="max-w-5xl mx-auto px-4 mt-8">
        <ul className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Button
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className="capitalize"
                onClick={() => setSelectedCategory(cat.id)}
                aria-pressed={selectedCategory === cat.id}
              >
                {cat.name}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Product Grid */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const inCart = cart.find((item) => item.product.id === product.id);
            return (
              <div
                key={product.id}
                className="bg-card rounded-xl shadow-sm border flex flex-col p-5 group hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="text-5xl aspect-square w-16 h-16 flex items-center justify-center bg-muted rounded-lg">
                    {product.emoji}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg mb-1 leading-tight">{product.name}</div>
                  <div className="text-muted-foreground text-sm mb-2">{product.description}</div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-primary text-base">{formatPrice(product.price)}</span>
                  <Button
                    variant={inCart ? "secondary" : "default"}
                    onClick={() => addToCart(product)}
                    disabled={!!inCart && inCart.quantity >= 10}
                    className="transition-colors"
                  >
                    {inCart ? (inCart.quantity >= 10 ? "Max" : `Add More`) : "Add to Cart"}
                  </Button>
                </div>
                {inCart && (
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline">In cart: {inCart.quantity}</Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background/80 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Next Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
