import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Heart, Award } from "lucide-react";
import { products, formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/account/")({ component: Overview });

function Overview() {
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { Icon: Package, label: "Active orders", value: "2" },
          { Icon: Heart, label: "Wishlist", value: "5" },
          { Icon: Award, label: "Loyalty pearls", value: "142" },
        ].map(({ Icon, label, value }) => (
          <div key={label} className="p-6 rounded-2xl bg-card border">
            <Icon className="h-5 w-5 text-primary mb-3" />
            <div className="font-display text-3xl">{value}</div>
            <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-3xl gradient-luxe text-primary-foreground p-8">
        <div className="text-xs tracking-[0.3em] uppercase text-gold">Loyalty</div>
        <h2 className="mt-2 font-display text-3xl">58 pearls until <span className="text-gradient-gold">Atelier tier</span></h2>
        <div className="mt-6 h-2 rounded-full bg-primary-foreground/10 overflow-hidden"><div className="h-full gradient-gold" style={{ width: "71%" }} /></div>
      </div>
      <div>
        <h2 className="font-display text-2xl mb-4">Recommended for you</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.slice(0, 4).map(p => (
            <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="block group">
              <div className="aspect-square rounded-2xl mb-3 group-hover:scale-[1.02] transition" style={{ backgroundImage: p.image }} />
              <div className="text-sm font-medium truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground">{formatPrice(p.price)}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
