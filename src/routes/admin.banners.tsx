import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { products } from "@/lib/mock-data";
export const Route = createFileRoute("/admin/banners")({ component: Banners });
function Banners() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="font-display text-3xl">Banners</h1><button className="px-4 py-2 rounded-full bg-gold text-gold-foreground text-sm flex items-center gap-2"><Plus className="h-4 w-4" /> New banner</button></div>
      <div className="grid md:grid-cols-2 gap-4">
        {products.slice(0, 4).map((p, i) => (
          <div key={p.id} className="rounded-2xl border bg-card overflow-hidden">
            <div className="aspect-[16/7]" style={{ backgroundImage: p.image }} />
            <div className="p-4 flex justify-between items-center">
              <div><div className="font-medium">Banner #{i + 1}</div><div className="text-xs text-muted-foreground">Homepage hero · {p.name}</div></div>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-deep/20 text-emerald-deep">Live</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
