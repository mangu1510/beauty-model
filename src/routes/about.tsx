import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "Story — Beauty Model" },
    { name: "description", content: "From rose otto in Kannauj to neem branches in Coorg, the story of Beauty Model." },
    { property: "og:title", content: "Story — Beauty Model" },
  ] }),
  component: About,
});

function About() {
  return (
    <div>
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-8 text-center">
          <div className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">— The story</div>
          <h1 className="font-display text-5xl md:text-7xl tracking-tighter leading-[1]">A botanical future,<br/><span className="italic text-gradient-gold">made slowly.</span></h1>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 sm:px-8 py-20 prose prose-lg">
        <p className="text-xl leading-relaxed text-foreground/80">Beauty Model began with one question: what would beauty look like if we slowed everything down? If we cold-pressed instead of distilled, hand-cut instead of moulded, wrote letters instead of emails to our growers.</p>
        <p className="mt-6 text-foreground/70 leading-relaxed">Today we work with seventeen artisans across India — perfumers in Kannauj, neem craftsmen in Coorg, glassblowers in Firozabad. Every piece is touched by a human hand before it touches yours.</p>
      </section>
      <section className="mx-auto max-w-[1400px] px-4 sm:px-8 grid md:grid-cols-3 gap-6 pb-24">
        {["Refillable", "Hand-finished", "Carbon-neutral"].map((t, i) => (
          <motion.div key={t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-10 rounded-3xl bg-card border text-center">
            <div className="font-display text-3xl text-gradient-gold">0{i + 1}</div>
            <div className="mt-4 font-display text-2xl">{t}</div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
