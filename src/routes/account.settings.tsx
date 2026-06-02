import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/account/settings")({ component: Settings });
function Settings() {
  return (
    <div className="space-y-4">
      {["Profile information", "Email & password", "Privacy", "Connected accounts", "Delete account"].map(t => (
        <button key={t} className="w-full p-5 rounded-2xl bg-card border text-left hover:bg-muted/40 flex justify-between"><span>{t}</span><span className="text-muted-foreground">→</span></button>
      ))}
    </div>
  );
}
