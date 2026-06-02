import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award, Check, ChevronDown, Heart, Leaf, Minus, Plus, RefreshCw, Shield, Star, Truck, ZoomIn } from "lucide-react";
import { useState } from "react";
import { getProductBySlug } from "@/lib/api";
import { products, formatPrice, reviews, faqs } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    try {
      const product = await getProductBySlug(params.slug);
      return { product };
    } catch {
      const product = products.find((p) => p.slug === params.slug);
      if (!product) throw notFound();
      return { product };
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.product.name} — Beauty Model` },
      { name: "description", content: loaderData.product.description },
      { property: "og:title", content: `${loaderData.product.name} — Beauty Model` },
      { property: "og:description", content: loaderData.product.tagline },
    ] : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [shade, setShade] = useState(product.shades?.[0]?.name);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const liked = wishlist.includes(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const gallery = [product.image, product.image, product.image, product.image];

  return (
    <div>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 pt-6 text-xs text-muted-foreground">
        <Link to="/">Home</Link> · <Link to="/shop">Shop</Link> · <span className="text-foreground">{product.name}</span>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-10 grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <motion.div layout onClick={() => setZoom(!zoom)} className="relative aspect-square rounded-3xl overflow-hidden cursor-zoom-in" style={{ backgroundImage: gallery[imgIdx] }}>
            <button className="absolute top-4 right-4 h-10 w-10 rounded-full glass flex items-center justify-center"><ZoomIn className="h-4 w-4" /></button>
            <div className="absolute bottom-4 left-4 px-3 py-1.5 glass text-xs rounded-full">360° view available</div>
            {zoom && <div className="absolute inset-0 scale-150 transition-transform" style={{ backgroundImage: gallery[imgIdx], backgroundSize: "150%", backgroundPosition: "center" }} />}
          </motion.div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {gallery.map((g, i) => (
              <button key={i} onClick={() => setImgIdx(i)} className={`aspect-square rounded-2xl ring-2 transition ${imgIdx === i ? "ring-primary" : "ring-transparent"}`} style={{ backgroundImage: g }} />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="flex flex-wrap gap-2 mb-3">
            {product.badges?.map((b: string) => <span key={b} className="text-[10px] tracking-[0.18em] uppercase px-2.5 py-1 bg-secondary rounded-full">{b}</span>)}
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tighter">{product.name}</h1>
          <p className="mt-2 text-muted-foreground">{product.tagline}</p>

          <div className="mt-4 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" /> {product.rating}</div>
            <span className="text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <div className="font-display text-4xl">{formatPrice(product.price)}</div>
            {product.compareAt && <div className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAt)}</div>}
            {product.compareAt && <div className="text-sm text-emerald-deep font-medium mb-1.5">Save {formatPrice(product.compareAt - product.price)}</div>}
          </div>

          <p className="mt-8 text-foreground/80 leading-relaxed">{product.description}</p>

          {product.shades && (
            <div className="mt-8">
              <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Shade · <span className="text-foreground">{shade}</span></div>
              <div className="flex flex-wrap gap-2">
                {product.shades.map((s: { name: string; hex: string }) => (
                  <button key={s.name} onClick={() => setShade(s.name)}
                    className={`relative h-10 w-10 rounded-full ring-offset-2 ring-offset-background transition ${shade === s.name ? "ring-2 ring-primary" : "ring-1 ring-border"}`}
                    style={{ backgroundColor: s.hex }} title={s.name}
                  >{shade === s.name && <Check className="absolute inset-0 m-auto h-4 w-4 text-white mix-blend-difference" />}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="inline-flex items-center border rounded-full">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-3"><Minus className="h-4 w-4" /></button>
              <span className="px-4 tabular-nums">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="p-3"><Plus className="h-4 w-4" /></button>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => addToCart(product.id, shade, qty)}
              className="flex-1 py-4 bg-primary text-primary-foreground rounded-full text-sm tracking-[0.18em] uppercase hover:opacity-90 transition shadow-luxe">
              Add to bag · {formatPrice(product.price * qty)}
            </motion.button>
            <button onClick={() => toggleWishlist(product.id)} className="h-14 w-14 border rounded-full flex items-center justify-center hover:bg-muted">
              <Heart className={`h-5 w-5 ${liked ? "fill-destructive text-destructive" : ""}`} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              [Truck, "Free over ₹1500", "2–4 day delivery"],
              [Shield, "Authentic", "Direct from atelier"],
              [RefreshCw, "30-day returns", "No questions asked"],
              [Leaf, "Refillable", "Glass + brass refills"],
            ].map(([Icon, t, s], i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/40">
                {/* @ts-ignore */}
                <Icon className="h-4 w-4 mt-0.5 text-primary" />
                <div className="text-xs"><div className="font-medium text-foreground">{t as string}</div><div className="text-muted-foreground">{s as string}</div></div>
              </div>
            ))}
          </div>

          {/* Details / Ingredients accordion */}
          <div className="mt-10 border-t">
            {[
              { t: "Ingredients", c: product.ingredients?.join(" · ") || "Full INCI on packaging." },
              { t: "How to use", c: "A drop is enough. Warm between fingertips and press into clean skin, morning and night." },
              { t: "Details", c: product.details.join(" · ") },
              { t: "Shipping & returns", c: "Complimentary shipping over ₹1500 across India. 30-day returns on unopened items." },
            ].map((item, i) => (
              <details key={i} className="border-b py-4 group">
                <summary className="flex justify-between cursor-pointer font-medium list-none"><span>{item.t}</span><ChevronDown className="h-4 w-4 group-open:rotate-180 transition" /></summary>
                <p className="mt-3 text-sm text-muted-foreground">{item.c}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div>
            <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Reviews</div>
            <h2 className="font-display text-4xl">{product.rating} <span className="text-muted-foreground text-2xl">/ 5</span></h2>
            <div className="flex gap-0.5 mt-2">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-gold text-gold" />)}</div>
            <div className="text-sm text-muted-foreground mt-2">Based on {product.reviews} verified buyers</div>
            <button className="mt-6 px-5 py-3 border rounded-full text-sm hover:bg-muted">Write a review</button>
          </div>
          <div className="lg:col-span-2 space-y-6">
            {reviews.map(r => (
              <div key={r.id} className="p-6 rounded-2xl border">
                <div className="flex justify-between mb-2"><div className="font-medium">{r.name} {r.verified && <span className="text-[10px] ml-2 px-2 py-0.5 bg-secondary rounded-full">Verified</span>}</div><div className="text-xs text-muted-foreground">{r.date}</div></div>
                <div className="flex gap-0.5 mb-2">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-gold text-gold" />)}</div>
                <div className="font-display text-lg">{r.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-8 py-16">
        <h2 className="font-display text-3xl text-center mb-8">Questions, answered.</h2>
        {faqs.map((f, i) => (
          <button key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)} className="block w-full text-left border-b py-5">
            <div className="flex justify-between font-medium"><span>{f.q}</span><Plus className={`h-4 w-4 transition ${openFaq === i ? "rotate-45" : ""}`} /></div>
            {openFaq === i && <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>}
          </button>
        ))}
      </section>

      {/* Related */}
      <section className="mx-auto max-w-[1400px] px-4 sm:px-8 py-16">
        <h2 className="font-display text-3xl mb-8">Pairs beautifully with</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
          {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* Sticky mobile add to bag */}
      <div className="fixed bottom-4 left-4 right-4 z-30 lg:hidden">
        <button onClick={() => addToCart(product.id, shade, qty)} className="w-full py-4 bg-primary text-primary-foreground rounded-full text-sm tracking-[0.18em] uppercase shadow-luxe">
          Add · {formatPrice(product.price * qty)}
        </button>
      </div>
    </div>
  );
}
