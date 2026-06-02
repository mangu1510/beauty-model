import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { products, type Product } from "./mock-data";

export interface CartItem { product: Product; qty: number; shade?: string; }

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  user: { name: string; email: string } | null;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  addToCart: (id: string, shade?: string, qty?: number) => void;
  removeFromCart: (id: string, shade?: string) => void;
  updateQty: (id: string, qty: number, shade?: string) => void;
  toggleWishlist: (id: string) => void;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  signIn: (name: string, email: string) => void;
  signOut: () => void;
  clearCart: () => void;
  remoteSignIn: (email: string, password: string) => Promise<void>;
  remoteSignUp: (name: string, email: string, password: string) => Promise<void>;
  remoteSignOut: () => Promise<void>;
}

const Ctx = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<StoreState["user"]>(null);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  // hydrate
  useEffect(() => {
    try {
      const c = localStorage.getItem("bm-cart");
      const w = localStorage.getItem("bm-wish");
      if (c) {
        const parsed = JSON.parse(c) as { id: string; qty: number; shade?: string }[];
        setCart(parsed.map(i => ({ product: products.find(p => p.id === i.id)!, qty: i.qty, shade: i.shade })).filter(i => i.product));
      }
      if (w) setWishlist(JSON.parse(w));
    } catch {}
  }, []);

  // hydrate server session
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return;
        const data = await res.json();
        setUser(data.user ?? null);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem("bm-cart", JSON.stringify(cart.map(i => ({ id: i.product.id, qty: i.qty, shade: i.shade }))));
  }, [cart]);
  useEffect(() => { localStorage.setItem("bm-wish", JSON.stringify(wishlist)); }, [wishlist]);

  const addToCart: StoreState["addToCart"] = (id, shade, qty = 1) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    setCart(c => {
      const idx = c.findIndex(i => i.product.id === id && i.shade === shade);
      if (idx >= 0) {
        const next = [...c]; next[idx] = { ...next[idx], qty: next[idx].qty + qty }; return next;
      }
      return [...c, { product, qty, shade }];
    });
    setCartOpen(true);
  };
  const removeFromCart: StoreState["removeFromCart"] = (id, shade) =>
    setCart(c => c.filter(i => !(i.product.id === id && i.shade === shade)));
  const updateQty: StoreState["updateQty"] = (id, qty, shade) =>
    setCart(c => c.map(i => (i.product.id === id && i.shade === shade ? { ...i, qty: Math.max(1, qty) } : i)));
  const toggleWishlist: StoreState["toggleWishlist"] = (id) =>
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
  const signIn = (name: string, email: string) => setUser({ name, email });
  const signOut = () => setUser(null);
  const clearCart = () => setCart([]);

  const remoteSignIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
    if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
    const data = await res.json();
    setUser({ name: data.name, email: data.email });
  };

  const remoteSignUp = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
    if (!res.ok) throw new Error((await res.json()).message || 'Signup failed');
    const data = await res.json();
    setUser({ name: data.name, email: data.email });
  };

  const remoteSignOut = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ cart, wishlist, user, isCartOpen, isSearchOpen, addToCart, removeFromCart, updateQty, toggleWishlist, setCartOpen, setSearchOpen, signIn, signOut, clearCart, remoteSignIn, remoteSignUp, remoteSignOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export const cartTotals = (cart: CartItem[]) => {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  return { subtotal, shipping, tax, total: subtotal + shipping + tax, count: cart.reduce((s, i) => s + i.qty, 0) };
};
