import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/customers")({ component: AdminCustomers });

const customers = Array.from({ length: 10 }).map((_, i) => ({
  name: ["Aanya Krishnan", "Riya Mehta", "Sara Patel", "Maya Desai", "Tara Verma", "Ishita Rao", "Neha Joshi", "Diya Shah", "Anika Iyer", "Kavya Nair"][i],
  email: `customer${i + 1}@bm.in`,
  orders: 1 + i * 2,
  spent: 1490 + i * 2200,
  tier: i > 6 ? "Atelier" : i > 3 ? "Botanica" : "Petal",
}));

function AdminCustomers() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Customers</h1>
      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground bg-muted/40"><tr><th className="text-left p-4">Customer</th><th className="text-left">Email</th><th className="text-right">Orders</th><th className="text-right">Spent</th><th className="text-right pr-4">Tier</th></tr></thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.email} className="border-t hover:bg-muted/30">
                <td className="p-4 flex items-center gap-3"><div className="h-9 w-9 rounded-full gradient-gold flex items-center justify-center text-primary font-medium">{c.name[0]}</div>{c.name}</td>
                <td className="text-muted-foreground">{c.email}</td>
                <td className="text-right">{c.orders}</td>
                <td className="text-right tabular-nums">₹{c.spent.toLocaleString("en-IN")}</td>
                <td className="text-right pr-4"><span className="text-xs px-2 py-1 rounded-full bg-secondary">{c.tier}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
