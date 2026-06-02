import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Filter, Grid3x3, List, SlidersHorizontal, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { getCategories, getProducts, type Category, type Product } from "@/lib/api";
import { categories as fallbackCategories, products as fallbackProducts, formatPrice } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

const searchSchema = z.object({
  cat: fallback(z.enum(["make-up-vanity", "bath-and-body", "self-care", "salon", "all"]), "all").default("all"),
  sort: fallback(z.enum(["featured", "low", "high", "rating", "new"]), "featured").default("featured"),
});

export const Route = createFileRoute("/shop")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Shop — Beauty Model" },
      { name: "description", content: "Browse Make-up vanity, Bath and body, Salon essentials and Self care rituals." },
      { property: "og:title", content: "Shop — Beauty Model" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { cat, sort } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [maxPrice, setMaxPrice] = useState(6000);
  const [minRating, setMinRating] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [categoriesData, setCategoriesData] = useState<Category[]>(fallbackCategories);
  const [productsData, setProductsData] = useState<Product[]>(fallbackProducts);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then(setCategoriesData)
      .catch((error) => {
        console.error(error);
        setFetchError("Unable to load categories. Showing available items.");
      });
  }, []);

  useEffect(() => {
    setIsLoadingProducts(true);
    setFetchError(null);

    getProducts({ category: cat, sort, maxPrice, minRating })
      .then(setProductsData)
      .catch((error) => {
        console.error(error);
        setFetchError("Unable to load products. Showing cached items.");
      })
      .finally(() => setIsLoadingProducts(false));
  }, [cat, sort, maxPrice, minRating]);

  const filtered = useMemo(() => {
    let r = productsData.slice();
    if (cat !== "all") r = r.filter((p) => p.category === cat);
    r = r.filter((p) => p.price <= maxPrice && p.rating >= minRating);
    if (sort === "low") r.sort((a, b) => a.price - b.price);
    if (sort === "high") r.sort((a, b) => b.price - a.price);
    if (sort === "rating") r.sort((a, b) => b.rating - a.rating);
    if (sort === "new") r.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return r;
  }, [cat, sort, maxPrice, minRating, productsData]);

  return (
    <div>
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
          <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Atelier · {cat === "all" ? "All" : categoriesData.find((c) => c.id === cat)?.name}</div>
          <h1 className="font-display text-5xl md:text-7xl tracking-tighter">{cat === "all" ? "The Library." : categoriesData.find((c) => c.id === cat)?.name}</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">{cat === "all" ? "Every product, every ritual — quietly arranged." : categoriesData.find((c) => c.id === cat)?.tagline}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-10">
        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-3 mb-6">
          <Chip active={cat === "all"} onClick={() => navigate({ search: { cat: "all", sort } })}>All</Chip>
          {categoriesData.map((c) => (
            <Chip key={c.id} active={cat === c.id} onClick={() => navigate({ search: { cat: c.id, sort } })}>{c.name}</Chip>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="text-sm text-muted-foreground">{filtered.length} products</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setFiltersOpen(true)} className="lg:hidden inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
            <select value={sort} onChange={e => navigate({ search: { cat, sort: e.target.value as any } })} className="px-4 py-2 border rounded-full text-sm bg-background">
              <option value="featured">Featured</option>
              <option value="new">New arrivals</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
              <option value="rating">Top rated</option>
            </select>
            <div className="hidden sm:flex items-center border rounded-full">
              <button onClick={() => setView("grid")} className={`p-2 rounded-full ${view === "grid" ? "bg-muted" : ""}`}><Grid3x3 className="h-4 w-4" /></button>
              <button onClick={() => setView("list")} className={`p-2 rounded-full ${view === "list" ? "bg-muted" : ""}`}><List className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          <aside className="hidden lg:block">
            <Filters maxPrice={maxPrice} setMaxPrice={setMaxPrice} minRating={minRating} setMinRating={setMinRating} />
          </aside>

          {filtered.length === 0 ? (
            <div className="py-32 text-center text-muted-foreground">No products match your filters.</div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(p => <ListRow key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} className="absolute left-0 top-0 h-full w-[85%] bg-background p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6"><span className="font-display text-xl">Filters</span><button onClick={() => setFiltersOpen(false)}><X /></button></div>
            <Filters maxPrice={maxPrice} setMaxPrice={setMaxPrice} minRating={minRating} setMinRating={setMinRating} />
          </motion.div>
        </div>
      )}
    </div>
  );
}

const Chip = ({ active, onClick, children }: any) => (
  <button onClick={onClick} className={`shrink-0 px-5 py-2 rounded-full text-sm transition ${active ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-secondary"}`}>{children}</button>
);

function Filters({ maxPrice, setMaxPrice, minRating, setMinRating }: any) {
  return (
    <div className="space-y-8 sticky top-24">
      <div>
        <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 flex items-center gap-2"><Filter className="h-3 w-3" /> Price</div>
        <input type="range" min={500} max={6000} step={100} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹500</span><span>Up to {formatPrice(maxPrice)}</span></div>
      </div>
      <div>
        <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Rating</div>
        {[0, 4, 4.5, 4.8].map(r => (
          <label key={r} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm">
            <input type="radio" checked={minRating === r} onChange={() => setMinRating(r)} className="accent-primary" />
            {r === 0 ? "All ratings" : <><Star className="h-3 w-3 fill-gold text-gold" /> {r}+ stars</>}
          </label>
        ))}
      </div>
      <div>
        <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Promise</div>
        {["Vegan", "Refillable", "Plastic-free", "Made in India"].map(t => (
          <label key={t} className="flex items-center gap-2 py-1.5 cursor-pointer text-sm"><input type="checkbox" className="accent-primary" /> {t}</label>
        ))}
      </div>
    </div>
  );
}

function ListRow({ product }: any) {
  const { addToCart } = useStore();
  return (
    <Link to="/product/$slug" params={{ slug: product.slug }} className="group flex gap-6 p-4 rounded-2xl hover:bg-muted/40 transition">
      <div className="h-32 w-32 rounded-2xl shrink-0" style={{ backgroundImage: product.image }} />
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="font-display text-xl">{product.name}</div>
        <div className="text-sm text-muted-foreground">{product.tagline}</div>
        <div className="flex items-center gap-2 text-xs mt-1"><Star className="h-3 w-3 fill-gold text-gold" /> {product.rating} <span className="text-muted-foreground">({product.reviews})</span></div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 max-w-xl">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="font-display text-xl">{formatPrice(product.price)}</div>
          <button onClick={(e) => { e.preventDefault(); addToCart(product.id, product.shades?.[0]?.name); }}
            className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase">Add to bag</button>
        </div>
      </div>
    </Link>
  );
}
