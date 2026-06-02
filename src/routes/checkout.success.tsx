import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";

const searchSchema = z.object({ orderId: fallback(z.string(), "") });

export const Route = createFileRoute("/checkout/success")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Order placed — Beauty Model" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { orderId } = Route.useSearch();
  const reference = orderId || "AUR-" + Math.floor(100000 + Math.random() * 900000);
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 14 }}
          className="h-24 w-24 rounded-full mx-auto gradient-gold flex items-center justify-center shadow-luxe">
          <Check className="h-12 w-12 text-primary" strokeWidth={3} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="mt-8 text-xs tracking-[0.3em] uppercase text-muted-foreground">Thank you</div>
          <h1 className="mt-3 font-display text-5xl md:text-6xl tracking-tighter">Your ritual is on its way.</h1>
          <p className="mt-4 text-muted-foreground">Order <span className="text-foreground font-medium">{orderId}</span> — a confirmation has been sent to your email.</p>
          <p className="mt-2 text-sm text-muted-foreground">Estimated delivery: 2–4 business days.</p>
          <div className="mt-10 flex justify-center gap-3 flex-wrap">
            <Link to="/account/orders" className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm tracking-[0.18em] uppercase">Track order</Link>
            <Link to="/shop" className="px-6 py-3 rounded-full border text-sm tracking-[0.18em] uppercase">Continue shopping</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
