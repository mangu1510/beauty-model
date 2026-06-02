import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Bell, Heart, LogOut, MapPin, Package, Settings, Sparkles, User } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Beauty Model" }] }),
  component: AccountLayout,
});

const tabs = [
  { to: "/account", label: "Overview", icon: User, exact: true },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/preferences", label: "Beauty preferences", icon: Sparkles },
  { to: "/account/notifications", label: "Notifications", icon: Bell },
  { to: "/account/settings", label: "Settings", icon: Settings },
];

function AccountLayout() {
  const { user, remoteSignOut } = useStore();
  const path = useRouterState({ select: s => s.location.pathname });
  const name = user?.name || "Friend";

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-12">
      <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Account</div>
      <h1 className="font-display text-4xl md:text-5xl tracking-tighter">Hello, {name}.</h1>
      <p className="mt-2 text-muted-foreground">142 loyalty pearls · Botanica tier</p>

      <div className="mt-10 grid lg:grid-cols-[260px_1fr] gap-10">
        <aside className="space-y-1">
          {tabs.map(t => {
            const Icon = t.icon;
            const active = t.exact ? path === t.to : path.startsWith(t.to);
            return (
              <Link key={t.to} to={t.to} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                <Icon className="h-4 w-4" /> {t.label}
              </Link>
            );
          })}
          <button onClick={remoteSignOut} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm hover:bg-muted text-destructive w-full"><LogOut className="h-4 w-4" /> Sign out</button>
        </aside>
        <div><Outlet /></div>
      </div>
    </div>
  );
}
