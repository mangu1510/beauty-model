import { createFileRoute } from "@tanstack/react-router";
import { products, formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/account/orders")({ component: Orders });

const orders = [
  { id: "AUR-481209", date: "12 May 2026", status: "Out for delivery", items: [products[0], products[6]], total: 4380 },
  { id: "AUR-479102", date: "28 Apr 2026", status: "Delivered", items: [products[2]], total: 690 },
  { id: "AUR-475889", date: "10 Apr 2026", status: "Delivered", items: [products[4], products[11]], total: 7180 },
];

function Orders() {
  return (
    <div className="space-y-4">
      {orders.map(o => (
        <div key={o.id} className="p-6 rounded-2xl bg-card border">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">{o.date}</div>
              <div className="font-display text-xl mt-1">{o.id}</div>
            </div>
            <span className={`px-3 py-1 text-xs rounded-full ${o.status === "Delivered" ? "bg-secondary" : "bg-emerald-deep text-cream"}`}>{o.status}</span>
          </div>
          <div className="mt-4 flex gap-3">
            {o.items.map(p => <div key={p.id} className="h-16 w-16 rounded-xl" style={{ backgroundImage: p.image }} title={p.name} />)}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <div className="text-sm text-muted-foreground">{o.items.length} items</div>
            <div className="font-display text-lg">{formatPrice(o.total)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
