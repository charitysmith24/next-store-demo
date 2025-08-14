"use client";
import { useState, useMemo } from "react";
import { products, categories } from "../lib/products";
import { Product, CartItem } from "../lib/types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Toaster, toast } from "@/components/ui/sonner";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

function getInitialCart(): CartItem[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
  }
  return [];
}

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);
  const [cartOpen, setCartOpen] = useState(false);

  // Persist cart to localStorage
  function persistCart(next: CartItem[]) {
    setCart(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(next));
    }
  }

  function addToCart(product: Product) {
    const idx = cart.findIndex((item) => item.product.id === product.id);
    let next: CartItem[];
    if (idx > -1) {
      next = cart.map((item, i) =>
        i === idx ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      next = [...cart, { product, quantity: 1 }];
    }
    persistCart(next);
    toast.success(`${product.name} added to cart!`);
  }

  function removeFromCart(productId: string) {
    const idx = cart.findIndex((item) => item.product.id === productId);
    if (idx === -1) return;
    let next: CartItem[];
    if (cart[idx].quantity > 1) {
      next = cart.map((item, i) =>
        i === idx ? { ...item, quantity: item.quantity - 1 } : item
      );
    } else {
      next = cart.filter((item) => item.product.id !== productId);
    }
    persistCart(next);
    toast.info(`Item removed from cart.`);
  }

  function clearCart() {
    persistCart([]);
    toast("Cart cleared.");
  }

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="w-full border-b bg-background/80 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight">🛒 Modern Store</h1>
          <Sheet open={cartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative" aria-label="Open cart">
                <ShoppingCart className="w-5 h-5 mr-1" />
                Cart
                {cartCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm p-6 flex flex-col gap-4">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Cart
                </SheetTitle>
              </SheetHeader>
              <Separator />
              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-muted-foreground text-center py-12">Your cart is empty.</div>
                ) : (
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li key={item.product.id} className="flex items-center gap-4">
                        <div className="text-3xl bg-muted rounded-lg w-14 h-14 flex items-center justify-center">
                          {item.product.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium leading-tight">{item.product.name}</div>
                          <div className="text-sm text-muted-foreground">{formatPrice(item.product.price)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Decrease quantity"
                            onClick={() => removeFromCart(item.product.id)}
                            disabled={item.quantity === 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-6 text-center font-semibold">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Increase quantity"
                            onClick={() => addToCart(item.product)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Remove from cart"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Separator />
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <Button
                variant="destructive"
                className="w-full mt-2"
                onClick={clearCart}
                disabled={cart.length === 0}
              >
                Clear Cart
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Filters */}
      <nav className="max-w-5xl mx-auto px-4 mt-8 mb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
      </nav>

      {/* Product Grid */}
      <main className="flex-1 max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-card rounded-xl shadow-sm border p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center">
                <div className="text-5xl aspect-square w-20 h-20 flex items-center justify-center bg-muted rounded-lg">
                  {product.emoji}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold leading-tight mb-1">{product.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                <Badge variant="secondary" className="capitalize mb-2">{product.category}</Badge>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xl font-bold">{formatPrice(product.price)}</span>
                <Button
                  variant="default"
                  onClick={() => addToCart(product)}
                  size="sm"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Toaster />
      {/* Footer */}
      <footer className="w-full border-t bg-background/80 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Modern Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
