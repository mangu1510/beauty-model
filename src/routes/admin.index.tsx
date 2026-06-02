import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDown, ArrowUp } from "lucide-react";
import { products, categories, formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

const revenue = Array.from({ length: 12 }).map((_, i) => ({ m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], v: 200000 + Math.round(Math.sin(i / 2) * 80000 + i * 12000) }));
const cats = [{ n: "Make-up vanity", v: 38 }, { n: "Bath and body", v: 22 }, { n: "Self care", v: 28 }, { n: "Salon", v: 18 }];

function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">Good morning, Aanya.</h1>
        <p className="text-muted-foreground mt-1">Here is your atelier today.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Revenue", v: "₹24.8L", d: "+18.2%", up: true },
          { l: "Orders", v: "1,284", d: "+12.4%", up: true },
          { l: "Customers", v: "8,492", d: "+9.1%", up: true },
          { l: "AOV", v: "₹1,932", d: "−2.4%", up: false },
        ].map(s => (
          <div key={s.l} className="p-6 rounded-2xl border bg-card">
            <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">{s.l}</div>
            <div className="font-display text-3xl mt-2">{s.v}</div>
            <div className={`text-xs mt-2 inline-flex items-center gap-1 ${s.up ? "text-emerald-deep" : "text-destructive"}`}>{s.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />} {s.d}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-6 rounded-2xl border bg-card">
          <div className="font-display text-xl mb-4">Revenue · 12 months</div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={revenue}>
                <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--gold)" stopOpacity={0.6} /><stop offset="100%" stopColor="var(--gold)" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="m" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v/100000}L`} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area dataKey="v" stroke="var(--gold)" strokeWidth={2} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-6 rounded-2xl border bg-card">
          <div className="font-display text-xl mb-4">By category</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={cats}>
                <XAxis dataKey="n" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <Bar dataKey="v" fill="var(--primary)" radius={[8,8,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="p-6 rounded-2xl border bg-card">
        <div className="font-display text-xl mb-4">Top products</div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground"><tr><th className="text-left py-2">Product</th><th className="text-left">Category</th><th className="text-right">Sold</th><th className="text-right">Revenue</th></tr></thead>
          <tbody>
            {products.slice(0, 6).map(p => (
              <tr key={p.id} className="border-t">
                <td className="py-3 flex items-center gap-3"><div className="h-10 w-10 rounded-lg" style={{ backgroundImage: p.image }} />{p.name}</td>
                <td>{categories.find(c => c.id === p.category)?.name ?? p.category}</td>
                <td className="text-right tabular-nums">{p.reviews}</td>
                <td className="text-right tabular-nums">{formatPrice(p.price * p.reviews)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
