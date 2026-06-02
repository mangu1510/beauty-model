import { Link } from "@tanstack/react-router";
import { useRouterState } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  const path = useRouterState({ select: s => s.location.pathname });
  if (path.startsWith("/admin") || path.startsWith("/checkout")) return null;
  return (
    <footer className="mt-32 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-20">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <h3 className="font-display text-4xl md:text-5xl leading-tight">A botanical ritual,<br/><span className="text-gradient-gold italic">in your inbox.</span></h3>
            <p className="mt-6 text-primary-foreground/70 max-w-md">Early access to new launches, refills, and the rare drops we make in tiny batches.</p>
            <form className="mt-8 flex max-w-md gap-2 border-b border-primary-foreground/30 pb-3" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Your email" required className="flex-1 bg-transparent placeholder:text-primary-foreground/50 outline-none" />
              <button className="text-sm tracking-[0.2em] uppercase hover:text-gold transition">Subscribe →</button>
            </form>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
            <Col title="Shop" links={[["All", "/shop"], ["Make-up vanity", "/shop?cat=make-up-vanity"], ["Bath and body", "/shop?cat=bath-and-body"], ["Self care", "/shop?cat=self-care"], ["Salon", "/shop?cat=salon"]]} />
            <Col title="Brand" links={[["Story", "/about"], ["Sustainability", "/about"], ["Press", "/about"], ["Journal", "/about"]]} />
            <Col title="Care" links={[["Help", "/help"], ["Shipping", "/help"], ["Returns", "/help"], ["Contact", "/help"]]} />
            <Col title="Account" links={[["Sign in", "/login"], ["Orders", "/account/orders"], ["Wishlist", "/account/wishlist"], ["Admin", "/admin"]]} />
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs text-primary-foreground/60">
          <div>© {new Date().getFullYear()} Beauty Model · Hand-built in India</div>
          <div className="flex gap-4">
            <Instagram className="h-4 w-4 hover:text-gold cursor-pointer" />
            <Twitter className="h-4 w-4 hover:text-gold cursor-pointer" />
            <Youtube className="h-4 w-4 hover:text-gold cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50 mb-4">{title}</div>
      <ul className="space-y-2.5">
        {links.map(([l, h]) => (
          <li key={l}><Link to={h} className="text-primary-foreground/80 hover:text-gold transition-colors">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
}
