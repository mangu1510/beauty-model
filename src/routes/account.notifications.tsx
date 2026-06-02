import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/notifications")({ component: Notifs });
const items = [
  { t: "Your order is out for delivery", s: "AUR-481209 will arrive today.", time: "2h ago", unread: true },
  { t: "New drop: Aurora Vanity Mirror", s: "Limited 200 pieces available now.", time: "1d ago" },
  { t: "Loyalty milestone", s: "You earned 28 pearls this month.", time: "3d ago" },
];
function Notifs() {
  return (
    <div className="space-y-3">
      {items.map((n, i) => (
        <div key={i} className={`p-5 rounded-2xl border ${n.unread ? "bg-secondary/40" : "bg-card"}`}>
          <div className="flex justify-between"><div className="font-medium">{n.t}</div><div className="text-xs text-muted-foreground">{n.time}</div></div>
          <div className="text-sm text-muted-foreground mt-1">{n.s}</div>
        </div>
      ))}
    </div>
  );
}
