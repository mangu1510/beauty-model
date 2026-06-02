import { createFileRoute } from "@tanstack/react-router";
import { faqs } from "@/lib/mock-data";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help — Beauty Model" }, { name: "description", content: "Shipping, returns and support." }] }),
  component: Help,
});

function Help() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-8 py-16">
      <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Care</div>
      <h1 className="font-display text-5xl tracking-tighter">How can we help?</h1>
      <div className="mt-12 space-y-2">
        {faqs.map((f, i) => (
          <details key={i} className="group p-6 rounded-2xl bg-card border">
            <summary className="cursor-pointer font-medium list-none flex justify-between"><span>{f.q}</span><span className="text-muted-foreground group-open:rotate-45 transition">+</span></summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
      <div className="mt-12 p-8 rounded-3xl gradient-luxe text-primary-foreground text-center">
        <div className="font-display text-2xl">Still need a hand?</div>
        <p className="mt-2 text-primary-foreground/70 text-sm">Write to us at care@beautymodel.in or WhatsApp +91 98000 00000.</p>
      </div>
    </div>
  );
}
