import { AnimatePresence, motion } from "framer-motion";
import { Mic, Search, TrendingUp, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { formatPrice, products } from "@/lib/mock-data";

const trending = ["Velvet lip serum", "Neem comb", "Rose facial oil", "Vanity mirror", "Skin tint"];

export function SearchOverlay() {
  const { isSearchOpen, setSearchOpen } = useStore();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (isSearchOpen) setQ("");
  }, [isSearchOpen]);

  const results = q
    ? products.filter(p => (p.name + p.tagline + p.category).toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : products.slice(0, 4);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
          <motion.div
            initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", damping: 26 }}
            className="relative mx-auto max-w-3xl mt-[10vh] glass rounded-3xl p-6 sm:p-8 mx-4"
          >
            <div className="flex items-center gap-4 border-b pb-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                autoFocus value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search rituals, shades, ingredients…"
                className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
              />
              <button className="p-2 rounded-full hover:bg-muted" aria-label="Voice"><Mic className="h-4 w-4" /></button>
              <button onClick={() => setSearchOpen(false)} className="p-2 rounded-full hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>

            {!q && (
              <div className="mt-5">
                <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 flex items-center gap-2"><TrendingUp className="h-3 w-3" /> Trending</div>
                <div className="flex flex-wrap gap-2">
                  {trending.map(t => (
                    <button key={t} onClick={() => setQ(t)} className="px-3 py-1.5 text-sm rounded-full bg-muted hover:bg-secondary transition">{t}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 grid sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
              {results.map(p => (
                <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} onClick={() => setSearchOpen(false)} className="flex gap-3 p-3 rounded-2xl hover:bg-muted/60 transition group">
                  <div className="h-14 w-14 rounded-xl shrink-0" style={{ backgroundImage: p.image }} />
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.tagline}</div>
                    <div className="text-xs mt-1">{formatPrice(p.price)}</div>
                  </div>
                </Link>
              ))}
              {q && results.length === 0 && <div className="text-sm text-muted-foreground p-4">No results for "{q}".</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
