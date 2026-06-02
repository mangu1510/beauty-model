import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useStore, cartTotals } from "@/lib/store";
import { formatPrice, products } from "@/lib/mock-data";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your bag — Beauty Model" }, { name: "description", content: "Review your bag." }] }),
  component: CartPage,
});

function CartPage() {
  const { cart, updateQty, removeFromCart } = useStore();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const t = cartTotals(cart);
  const discount = applied === "BM10" ? Math.round(t.subtotal * 0.1) : 0;
  const total = t.total - discount;

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-12">
      <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Bag</div>
      <h1 className="font-display text-5xl md:text-6xl tracking-tighter mb-12">Your selection.</h1>

      {cart.length === 0 ? (
        <div className="py-32 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
          <div className="mt-4 font-display text-2xl">Nothing here yet.</div>
          <Link to="/shop" className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm tracking-[0.18em] uppercase">Begin shopping</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          <div className="space-y-4">
            {cart.map(i => (
              <motion.div key={i.product.id + (i.shade ?? "")} layout className="flex gap-4 p-4 rounded-2xl bg-card border">
                <div className="h-32 w-32 rounded-xl shrink-0" style={{ backgroundImage: i.product.image }} />
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link to="/product/$slug" params={{ slug: i.product.slug }} className="font-display text-xl hover:text-primary">{i.product.name}</Link>
                      <div className="text-sm text-muted-foreground">{i.product.tagline}</div>
                      {i.shade && <div className="text-xs text-muted-foreground mt-1">Shade · {i.shade}</div>}
                    </div>
                    <button onClick={() => removeFromCart(i.product.id, i.shade)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="inline-flex items-center border rounded-full">
                      <button onClick={() => updateQty(i.product.id, i.qty - 1, i.shade)} className="p-2"><Minus className="h-3 w-3" /></button>
                      <span className="px-3 text-sm tabular-nums">{i.qty}</span>
                      <button onClick={() => updateQty(i.product.id, i.qty + 1, i.shade)} className="p-2"><Plus className="h-3 w-3" /></button>
                    </div>
                    <div className="font-display text-lg">{formatPrice(i.product.price * i.qty)}</div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="pt-12">
              <h2 className="font-display text-2xl mb-6">Complete your ritual</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {products.filter(p => !cart.find(c => c.product.id === p.id)).slice(0, 3).map(p => (
                  <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="block group">
                    <div className="aspect-square rounded-2xl mb-3 group-hover:scale-[1.02] transition-transform" style={{ backgroundImage: p.image }} />
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{formatPrice(p.price)}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 self-start">
            <div className="rounded-3xl bg-secondary/50 p-8">
              <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Summary</div>
              <div className="flex gap-2 mb-6">
                <input value={code} onChange={e => setCode(e.target.value)} placeholder="Promo code · try BM10" className="flex-1 px-4 py-3 rounded-full bg-background border text-sm" />
                <button onClick={() => setApplied(code.toUpperCase())} className="px-5 py-3 rounded-full bg-primary text-primary-foreground text-xs tracking-wider">Apply</button>
              </div>
              {applied && discount > 0 && <div className="text-xs text-emerald-deep mb-4">✓ {applied} applied — 10% off</div>}
              {applied && discount === 0 && <div className="text-xs text-destructive mb-4">Code not valid.</div>}

              <div className="space-y-2 text-sm">
                <Row label="Subtotal" value={formatPrice(t.subtotal)} />
                <Row label="Shipping" value={t.shipping ? formatPrice(t.shipping) : "Complimentary"} />
                <Row label="GST (5%)" value={formatPrice(t.tax)} />
                {discount > 0 && <Row label="Discount" value={`− ${formatPrice(discount)}`} />}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between font-display text-2xl">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>

              <Link to="/checkout" className="mt-6 block text-center w-full py-4 bg-primary text-primary-foreground rounded-full text-sm tracking-[0.18em] uppercase shadow-luxe hover:opacity-90 transition">Secure checkout →</Link>
              <div className="mt-4 text-xs text-muted-foreground text-center">Encrypted payment · 30-day returns</div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="text-foreground tabular-nums">{value}</span></div>
);
