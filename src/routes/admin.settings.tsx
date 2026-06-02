import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });
function AdminSettings() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl mb-6">Settings</h1>
      <div className="space-y-3">
        {["Store information", "Payments", "Shipping zones", "Taxes", "Roles & permissions", "Integrations"].map(t => (
          <button key={t} className="w-full p-5 rounded-2xl border bg-card text-left hover:bg-muted/30 flex justify-between"><span>{t}</span><span className="text-muted-foreground">→</span></button>
        ))}
      </div>
    </div>
  );
}
