import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, CreditCard, Lock, Smartphone, Truck, Wallet } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useState } from "react";
import { useStore, cartTotals } from "@/lib/store";
import { submitOrder } from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Beauty Model" }, { name: "description", content: "Secure checkout." }] }),
  component: CheckoutPage,
});

const STEPS = ["Address", "Delivery", "Payment", "Review"] as const;

function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ name: "", phone: "", line1: "", city: "", state: "", pin: "", email: "" });
  const [delivery, setDelivery] = useState<"standard" | "express" | "ritual">("standard");
  const [payment, setPayment] = useState<"upi" | "card" | "wallet" | "cod">("upi");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = cartTotals(cart);
  const deliveryFee = delivery === "express" ? 199 : delivery === "ritual" ? 399 : t.shipping;
  const total = t.subtotal + deliveryFee + t.tax;

  const next = () => setStep(s => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  const placeOrder = async () => {
    setProcessing(true);
    setError(null);

    try {
      const payload = {
        name: address.name,
        email: address.email,
        phone: address.phone,
        line1: address.line1,
        city: address.city,
        state: address.state,
        pin: address.pin,
        delivery,
        payment,
        items: cart.map((item) => ({
          productId: item.product.id,
          qty: item.qty,
          shade: item.shade,
          unitPrice: item.product.price,
          name: item.product.name,
        })),
        subtotal: t.subtotal,
        shipping: deliveryFee,
        tax: t.tax,
        total,
      };

      const response = await submitOrder(payload);
      clearCart();
      navigate({ to: "/checkout/success", search: { orderId: response.orderId } });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong while placing your order.");
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0 && !processing) {
    return (
      <div className="py-32 text-center">
        <div className="font-display text-2xl">Your bag is empty.</div>
        <Link to="/shop" className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm tracking-[0.18em] uppercase">Begin shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Logo className="font-display text-2xl" imgClassName="h-16" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Lock className="h-3 w-3" /> Encrypted checkout</div>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 sm:gap-6 mb-12 overflow-x-auto scrollbar-hidden">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3 shrink-0">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs transition ${i < step ? "bg-emerald-deep text-cream" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm ${i === step ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`w-8 sm:w-16 h-px ${i < step ? "bg-emerald-deep" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-12">
          <div>
            {error ? <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm text-destructive">{error}</div> : null}
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                {step === 0 && (
                  <div>
                    <h2 className="font-display text-3xl mb-6">Where to?</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Full name"><input value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} className="input" /></Field>
                      <Field label="Phone"><input value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} className="input" /></Field>
                      <Field label="Email" full><input type="email" value={address.email} onChange={e => setAddress({ ...address, email: e.target.value })} className="input" /></Field>
                      <Field label="Address line" full><input value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} className="input" /></Field>
                      <Field label="City"><input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="input" /></Field>
                      <Field label="State"><input value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} className="input" /></Field>
                      <Field label="PIN code"><input value={address.pin} onChange={e => setAddress({ ...address, pin: e.target.value })} className="input" /></Field>
                    </div>
                  </div>
                )}
                {step === 1 && (
                  <div>
                    <h2 className="font-display text-3xl mb-6">When?</h2>
                    <div className="space-y-3">
                      {[
                        { id: "standard", t: "Standard delivery", s: "2–4 business days", p: t.shipping ? formatPrice(t.shipping) : "Complimentary", icon: Truck },
                        { id: "express", t: "Express delivery", s: "Next business day", p: formatPrice(199), icon: Truck },
                        { id: "ritual", t: "Ritual hand-delivery", s: "Personal courier · select cities", p: formatPrice(399), icon: Truck },
                      ].map(opt => {
                        const Icon = opt.icon;
                        return (
                          <button key={opt.id} onClick={() => setDelivery(opt.id as any)} className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition ${delivery === opt.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                            <Icon className="h-5 w-5 text-primary" />
                            <div className="flex-1"><div className="font-medium">{opt.t}</div><div className="text-xs text-muted-foreground">{opt.s}</div></div>
                            <div className="font-medium tabular-nums">{opt.p}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <h2 className="font-display text-3xl mb-6">How would you like to pay?</h2>
                    <div className="space-y-3">
                      {[
                        { id: "upi", t: "UPI", s: "Pay with any UPI app", icon: Smartphone },
                        { id: "card", t: "Card", s: "Credit · Debit · International", icon: CreditCard },
                        { id: "wallet", t: "Wallet", s: "Paytm · PhonePe · Amazon Pay", icon: Wallet },
                        { id: "cod", t: "Cash on delivery", s: "Pay when it arrives", icon: Truck },
                      ].map(opt => {
                        const Icon = opt.icon;
                        return (
                          <button key={opt.id} onClick={() => setPayment(opt.id as any)} className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition ${payment === opt.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                            <Icon className="h-5 w-5 text-primary" />
                            <div className="flex-1"><div className="font-medium">{opt.t}</div><div className="text-xs text-muted-foreground">{opt.s}</div></div>
                            <div className={`h-5 w-5 rounded-full border-2 ${payment === opt.id ? "border-primary bg-primary" : "border-border"}`} />
                          </button>
                        );
                      })}
                    </div>
                    {payment === "card" && (
                      <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        <Field label="Card number" full><input placeholder="1234 5678 9012 3456" className="input" /></Field>
                        <Field label="Expiry"><input placeholder="MM/YY" className="input" /></Field>
                        <Field label="CVV"><input placeholder="•••" className="input" /></Field>
                      </div>
                    )}
                    {payment === "upi" && (
                      <div className="mt-6">
                        <Field label="UPI ID"><input placeholder="name@bank" className="input" /></Field>
                      </div>
                    )}
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <h2 className="font-display text-3xl mb-6">Final review.</h2>
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-card border">
                        <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Delivering to</div>
                        <div className="font-medium">{address.name || "—"}</div>
                        <div className="text-sm text-muted-foreground">{address.line1}, {address.city}, {address.state} {address.pin}</div>
                      </div>
                      <div className="p-5 rounded-2xl bg-card border">
                        <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Method</div>
                        <div className="font-medium capitalize">{delivery} · {payment.toUpperCase()}</div>
                      </div>
                      <div className="p-5 rounded-2xl bg-card border">
                        <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Items ({cart.length})</div>
                        {cart.map(i => (
                          <div key={i.product.id + (i.shade ?? "")} className="flex justify-between text-sm py-1.5">
                            <span className="truncate pr-2">{i.qty} × {i.product.name}{i.shade ? ` · ${i.shade}` : ""}</span>
                            <span className="tabular-nums shrink-0">{formatPrice(i.product.price * i.qty)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex justify-between gap-3">
              <button onClick={back} disabled={step === 0} className="inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm disabled:opacity-30">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              {step < STEPS.length - 1 ? (
                <button onClick={next} className="px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm tracking-[0.18em] uppercase shadow-luxe hover:opacity-90">Continue</button>
              ) : (
                <button onClick={placeOrder} disabled={processing} className="px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm tracking-[0.18em] uppercase shadow-luxe disabled:opacity-60">
                  {processing ? "Processing…" : `Pay ${formatPrice(total)}`}
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-8 self-start">
            <div className="glass rounded-3xl p-6">
              <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Order summary</div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map(i => (
                  <div key={i.product.id + (i.shade ?? "")} className="flex gap-3">
                    <div className="relative h-14 w-14 rounded-xl shrink-0" style={{ backgroundImage: i.product.image }}>
                      <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">{i.qty}</span>
                    </div>
                    <div className="flex-1 text-sm min-w-0">
                      <div className="truncate">{i.product.name}</div>
                      {i.shade && <div className="text-xs text-muted-foreground">{i.shade}</div>}
                    </div>
                    <div className="text-sm tabular-nums">{formatPrice(i.product.price * i.qty)}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t space-y-2 text-sm">
                <Row label="Subtotal" value={formatPrice(t.subtotal)} />
                <Row label="Delivery" value={deliveryFee ? formatPrice(deliveryFee) : "Complimentary"} />
                <Row label="GST" value={formatPrice(t.tax)} />
                <div className="pt-2 mt-2 border-t flex justify-between font-display text-xl"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <style>{`.input { width:100%; padding: 0.75rem 1rem; border-radius: 0.75rem; border:1px solid var(--color-border); background: var(--color-background); font-size:0.875rem; outline:none; transition: border-color .2s; } .input:focus { border-color: var(--color-primary); }`}</style>
    </div>
  );
}

const Field = ({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) => (
  <label className={`block ${full ? "sm:col-span-2" : ""}`}><span className="text-xs tracking-[0.18em] uppercase text-muted-foreground">{label}</span><div className="mt-1.5">{children}</div></label>
);
const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-muted-foreground"><span>{label}</span><span className="text-foreground tabular-nums">{value}</span></div>
);
