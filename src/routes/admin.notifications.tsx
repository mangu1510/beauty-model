import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/notifications")({ component: AdminNotifs });
function AdminNotifs() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Notifications · campaigns</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {["Aurora Vanity launch", "Refill week reminder", "Diwali edit preview", "Loyalty top-up"].map((t, i) => (
          <div key={i} className="p-5 rounded-2xl border bg-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Email · Push</div>
            <div className="font-display text-xl mt-1">{t}</div>
            <div className="text-sm text-muted-foreground mt-1">Scheduled · {12 + i} May, 9:00</div>
            <div className="mt-3 flex gap-2"><button className="px-3 py-1 text-xs rounded-full bg-primary text-primary-foreground">Edit</button><button className="px-3 py-1 text-xs rounded-full border">Send now</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
