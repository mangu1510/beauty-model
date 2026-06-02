import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <h2 className="mt-4 font-display text-xl">This ritual was not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for has drifted away. Let's bring you home.</p>
        <div className="mt-8">
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm tracking-[0.18em] uppercase text-primary-foreground hover:opacity-90 transition">Return home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Something didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">A small hiccup. Try again or head back home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90">Try again</button>
          <a href="/" className="rounded-full border px-5 py-2.5 text-sm hover:bg-muted">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Beauty Model — Future-luxury beauty & botanical rituals" },
      { name: "description", content: "Hand-crafted Make-up vanity, Bath and body, Salon essentials and Self care rituals from Beauty Model. Refillable luxury, made in India." },
      { name: "author", content: "Beauty Model" },
      { property: "og:title", content: "Beauty Model — Future-luxury beauty" },
      { property: "og:description", content: "Hand-crafted Make-up vanity, Bath and body, Salon essentials and Self care rituals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#2d4a3d" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
        <SearchOverlay />
      </StoreProvider>
    </QueryClientProvider>
  );
}
