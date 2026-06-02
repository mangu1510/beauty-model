import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { products, categories, formatPrice } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/products")({ component: AdminProducts });

function AdminProducts() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="font-display text-3xl">Products</h1>
        <div className="flex gap-2">
          <div className="relative"><Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input placeholder="Search products" className="pl-9 pr-4 py-2 rounded-full bg-muted text-sm w-64 outline-none" /></div>
          <button className="px-4 py-2 rounded-full bg-gold text-gold-foreground text-sm flex items-center gap-2"><Plus className="h-4 w-4" /> New product</button>
        </div>
      </div>
      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground bg-muted/40"><tr><th className="text-left p-4">Product</th><th className="text-left">SKU</th><th className="text-left">Category</th><th className="text-right">Price</th><th className="text-right">Stock</th><th className="text-right">Status</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t hover:bg-muted/30 cursor-pointer">
                <td className="p-4 flex items-center gap-3"><div className="h-10 w-10 rounded-lg shrink-0" style={{ backgroundImage: p.image }} /><div><div className="font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.tagline}</div></div></td>
                <td>{p.id.toUpperCase()}</td>
                <td>{categories.find(c => c.id === p.category)?.name ?? p.category}</td>
                <td className="text-right tabular-nums">{formatPrice(p.price)}</td>
                <td className="text-right tabular-nums">{200 - p.id.charCodeAt(1) * 3}</td>
                <td className="text-right pr-4"><span className="text-xs px-2 py-1 rounded-full bg-emerald-deep/20 text-emerald-deep">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
