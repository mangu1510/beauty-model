import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useStore, cartTotals } from "@/lib/store";
import { formatPrice, products } from "@/lib/mock-data";

export function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, removeFromCart, updateQty } = useStore();
  const t = cartTotals(cart);
  const suggested = products.filter(p => !cart.find(c => c.product.id === p.id)).slice(0, 3);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-primary/30 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="absolute right-0 top-0 h-full w-full sm:w-[460px] bg-background flex flex-col shadow-luxe"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Your bag</div>
                <div className="font-display text-2xl">{t.count} item{t.count !== 1 ? "s" : ""}</div>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-muted rounded-full"><X className="h-5 w-5" /></button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4"><ShoppingBag className="h-8 w-8 text-muted-foreground" /></div>
                <div className="font-display text-xl">Your bag is quiet.</div>
                <p className="text-sm text-muted-foreground mt-2 mb-6">A little luxury is one click away.</p>
                <Link to="/shop" onClick={() => setCartOpen(false)} className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm tracking-wider hover:opacity-90">Discover</Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  {cart.map(i => (
                    <motion.div key={i.product.id + (i.shade ?? "")} layout className="flex gap-4">
                      <div className="h-24 w-24 rounded-xl shrink-0" style={{ backgroundImage: i.product.image }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{i.product.name}</div>
                            {i.shade && <div className="text-xs text-muted-foreground">Shade · {i.shade}</div>}
                          </div>
                          <button onClick={() => removeFromCart(i.product.id, i.shade)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border rounded-full">
                            <button onClick={() => updateQty(i.product.id, i.qty - 1, i.shade)} className="p-1.5 hover:text-primary"><Minus className="h-3 w-3" /></button>
                            <span className="px-3 text-sm tabular-nums">{i.qty}</span>
                            <button onClick={() => updateQty(i.product.id, i.qty + 1, i.shade)} className="p-1.5 hover:text-primary"><Plus className="h-3 w-3" /></button>
                          </div>
                          <div className="font-medium tabular-nums">{formatPrice(i.product.price * i.qty)}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="pt-6 mt-6 border-t">
                    <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">You may love</div>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hidden">
                      {suggested.map(p => (
                        <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} onClick={() => setCartOpen(false)} className="shrink-0 w-32 group">
                          <div className="aspect-square rounded-xl mb-2 group-hover:scale-[1.03] transition-transform" style={{ backgroundImage: p.image }} />
                          <div className="text-xs font-medium truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{formatPrice(p.price)}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t bg-muted/30">
                  <div className="space-y-2 text-sm mb-4">
                    <Row label="Subtotal" value={formatPrice(t.subtotal)} />
                    <Row label="Shipping" value={t.shipping ? formatPrice(t.shipping) : "Complimentary"} />
                    <Row label="GST (5%)" value={formatPrice(t.tax)} />
                    <div className="pt-2 mt-2 border-t flex justify-between font-display text-lg">
                      <span>Total</span><span>{formatPrice(t.total)}</span>
                    </div>
                  </div>
                  <Link to="/checkout" onClick={() => setCartOpen(false)} className="block text-center w-full py-4 bg-primary text-primary-foreground rounded-full text-sm tracking-[0.18em] uppercase hover:opacity-90 transition">Secure checkout</Link>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="text-foreground tabular-nums">{value}</span></div>
);
