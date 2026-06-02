import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useStore, cartTotals } from "@/lib/store";
import { categories } from "@/lib/mock-data";
import { Logo } from "./Logo";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop", search: undefined },
  { to: "/shop", label: "Make-up vanity", search: { cat: "make-up-vanity" as const } },
  { to: "/shop", label: "Bath and body", search: { cat: "bath-and-body" as const } },
  { to: "/shop", label: "Self care", search: { cat: "self-care" as const } },
  { to: "/shop", label: "Salon", search: { cat: "salon" as const } },
  { to: "/about", label: "Story" },
];

export function Header() {
  const { cart, wishlist, setCartOpen, setSearchOpen, user } = useStore();
  const { count } = cartTotals(cart);
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const path = useRouterState({ select: s => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide on admin
  if (path.startsWith("/admin")) return null;

  return (
    <>
      <div className="bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase">
        <div className="overflow-hidden">
          <div className="animate-marquee whitespace-nowrap py-2 flex gap-12">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex gap-12 shrink-0">
                <span>Complimentary shipping over ₹1500</span>
                <span>· Refillable luxury ·</span>
                <span>Hand-cut neem from Coorg</span>
                <span>· 30-day returns ·</span>
                <span>New: Aurora Vanity Mirror</span>
                <span>· Carbon-neutral delivery ·</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <header className={`sticky top-0 z-40 transition-all ${scrolled ? "glass shadow-soft" : "bg-background/40 backdrop-blur"}`}>
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8 flex items-center gap-6 h-16 sm:h-20">
          <button onClick={() => setMobile(true)} className="md:hidden p-2 -ml-2"><Menu className="h-5 w-5" /></button>
          <Logo className="font-semibold" imgClassName="h-20" />
          <nav className="hidden md:flex items-center gap-7 text-sm ml-6">
            {nav.map(n => (
              <Link key={n.label} to={n.to} search={n.search as any} className="relative text-foreground/80 hover:text-foreground transition-colors">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-muted rounded-full transition" aria-label="Search"><Search className="h-5 w-5" /></button>
            <Link to={user ? "/account" : "/login"} className="p-2 hover:bg-muted rounded-full transition hidden sm:inline-flex" aria-label="Account"><User className="h-5 w-5" /></Link>
            <Link to="/account/wishlist" className="p-2 hover:bg-muted rounded-full transition relative" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-accent" />}
            </Link>
            <button onClick={() => setCartOpen(true)} className="p-2 hover:bg-muted rounded-full transition relative" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-medium rounded-full h-4 min-w-4 px-1 flex items-center justify-center"
                  >{count}</motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobile && (
          <motion.div className="fixed inset-0 z-50 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobile(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 28 }} className="absolute left-0 top-0 h-full w-[82%] bg-background p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <Logo className="text-xl" imgClassName="h-18" />
                <button onClick={() => setMobile(false)}><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-1">
                {categories.map(c => (
                  <Link key={c.id} to="/shop" search={{ cat: c.id } as any} onClick={() => setMobile(false)} className="block py-3 border-b">
                    <div className="font-display text-lg">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.tagline}</div>
                  </Link>
                ))}
                <Link to="/about" onClick={() => setMobile(false)} className="block py-3 border-b">Story</Link>
                <Link to={user ? "/account" : "/login"} onClick={() => setMobile(false)} className="block py-3 border-b">{user ? "Account" : "Sign in"}</Link>
                <Link to="/admin" onClick={() => setMobile(false)} className="block py-3 border-b text-muted-foreground">Admin portal</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
