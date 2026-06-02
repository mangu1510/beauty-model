import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/account/addresses")({ component: Addresses });

const addresses = [
  { tag: "Home", name: "Aanya Krishnan", line: "12 Lavelle Rd, Bangalore 560001", phone: "+91 98450 12345", default: true },
  { tag: "Office", name: "Aanya Krishnan", line: "WeWork, Galaxy Wing, Mumbai 400063", phone: "+91 98450 12345" },
];
function Addresses() {
  return (
    <div className="space-y-4">
      {addresses.map((a, i) => (
        <div key={i} className="p-6 rounded-2xl bg-card border">
          <div className="flex justify-between"><span className="text-xs px-2 py-1 bg-secondary rounded-full uppercase tracking-wider">{a.tag}{a.default && " · default"}</span><button className="text-xs underline">Edit</button></div>
          <div className="mt-3 font-medium">{a.name}</div>
          <div className="text-sm text-muted-foreground">{a.line}</div>
          <div className="text-sm text-muted-foreground">{a.phone}</div>
        </div>
      ))}
      <button className="w-full p-6 border-2 border-dashed rounded-2xl flex items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-muted/40"><Plus className="h-4 w-4" /> Add address</button>
    </div>
  );
}
