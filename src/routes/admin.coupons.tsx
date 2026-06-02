import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/coupons")({ component: Coupons });
const coupons = [
  { code: "BM10", desc: "10% off site-wide", uses: 482, exp: "31 Dec 2026", active: true },
  { code: "WELCOME15", desc: "15% off first order", uses: 1820, exp: "Always", active: true },
  { code: "MONSOON20", desc: "20% off self-care", uses: 144, exp: "30 Sep 2026", active: false },
];
function Coupons() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="font-display text-3xl">Coupons</h1><button className="px-4 py-2 rounded-full bg-gold text-gold-foreground text-sm flex items-center gap-2"><Plus className="h-4 w-4" /> New coupon</button></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(c => (
          <div key={c.code} className="p-6 rounded-2xl border bg-card">
            <div className="flex justify-between"><div className="font-display text-2xl text-gold">{c.code}</div><span className={`text-xs px-2 py-1 rounded-full ${c.active ? "bg-emerald-deep/20 text-emerald-deep" : "bg-muted"}`}>{c.active ? "Active" : "Paused"}</span></div>
            <div className="text-sm text-muted-foreground mt-2">{c.desc}</div>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground"><span>Used {c.uses}×</span><span>Expires {c.exp}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}
