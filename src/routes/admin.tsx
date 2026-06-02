import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { BarChart3, Bell, FileText, Image as ImageIcon, LayoutDashboard, MessageSquare, Package, ShoppingCart, Tag, Users, Settings as SettingsIcon } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Beauty Model" }] }),
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/coupons", label: "Coupons", icon: Tag },
  { to: "/admin/banners", label: "Banners", icon: ImageIcon },
  { to: "/admin/cms", label: "CMS", icon: FileText },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

function AdminLayout() {
  const path = useRouterState({ select: s => s.location.pathname });
  return (
    <div className="dark min-h-screen bg-background text-foreground flex">
      <aside className="w-64 bg-sidebar text-sidebar-foreground p-6 hidden lg:block min-h-screen sticky top-0">
        <Logo className="text-2xl" imgClassName="h-14" />
        <div className="text-[10px] tracking-[0.3em] uppercase text-sidebar-foreground/50 mt-1">Atelier console</div>
        <nav className="mt-10 space-y-1">
          {items.map(i => {
            const Icon = i.icon;
            const active = i.exact ? path === i.to : path.startsWith(i.to);
            return (
              <Link key={i.to} to={i.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${active ? "bg-sidebar-accent text-gold" : "hover:bg-sidebar-accent/60"}`}>
                <Icon className="h-4 w-4" /> {i.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-10 p-4 rounded-2xl border border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60">Admin · Aanya K.</div>
          <div className="text-sm mt-1">Owner</div>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-border flex items-center px-6 sticky top-0 bg-background/80 backdrop-blur z-10">
          <div className="text-sm text-muted-foreground">{path.replace("/admin", "Admin") || "Admin"}</div>
          <div className="ml-auto flex items-center gap-3">
            <input placeholder="Search…" className="px-4 py-1.5 rounded-full bg-muted text-sm outline-none w-64" />
            <button className="p-2 hover:bg-muted rounded-full"><Bell className="h-4 w-4" /></button>
          </div>
        </header>
        <div className="p-8"><Outlet /></div>
      </div>
    </div>
  );
}
