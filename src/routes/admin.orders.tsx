import { createFileRoute } from "@tanstack/react-router";
import { formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

const statuses = ["Processing", "Shipped", "Out for delivery", "Delivered", "Returned"];
const orders = Array.from({ length: 14 }).map((_, i) => ({
  id: "AUR-" + (480000 + i * 17),
  customer: ["Aanya K.", "Riya M.", "Sara P.", "Maya D.", "Tara V.", "Ishita R."][i % 6],
  items: 1 + (i % 4),
  total: 990 + i * 320,
  status: statuses[i % statuses.length],
  date: `${10 + (i % 18)} May`,
}));

function AdminOrders() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Orders</h1>
      <div className="flex gap-2 mb-4 flex-wrap">{["All", ...statuses].map(s => <button key={s} className="px-4 py-1.5 rounded-full bg-muted text-sm hover:bg-secondary">{s}</button>)}</div>
      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground bg-muted/40"><tr><th className="text-left p-4">Order</th><th className="text-left">Customer</th><th className="text-left">Date</th><th className="text-right">Items</th><th className="text-right">Total</th><th className="text-right pr-4">Status</th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t hover:bg-muted/30">
                <td className="p-4 font-medium">{o.id}</td>
                <td>{o.customer}</td>
                <td className="text-muted-foreground">{o.date}</td>
                <td className="text-right">{o.items}</td>
                <td className="text-right tabular-nums">{formatPrice(o.total)}</td>
                <td className="text-right pr-4"><span className="text-xs px-2 py-1 rounded-full bg-secondary">{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
