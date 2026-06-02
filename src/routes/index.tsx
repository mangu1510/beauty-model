import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Award, Leaf, RefreshCw, Sparkles, Star, Truck } from "lucide-react";
import { categories, products, reviews, testimonials, formatPrice } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beauty Model — Future-luxury beauty, vanity & botanical rituals" },
      { name: "description", content: "Discover hand-crafted Make-up vanity, Bath and body, Salon essentials and Self care rituals. Refillable, vegan, made in India." },
      { property: "og:title", content: "Beauty Model — Future-luxury beauty" },
      { property: "og:description", content: "Hand-crafted Make-up vanity, Bath and body, Salon essentials and Self care rituals." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Categories />
      <Trending />
      <Story />
      <BeforeAfter />
      <Counters />
      <Press />
      <Reviews />
      <Gallery />
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden noise-bg">
      {/* floating particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6 + (i % 4) * 4,
            height: 6 + (i % 4) * 4,
            left: `${(i * 73) % 100}%`,
            top: `${(i * 41) % 100}%`,
            background: i % 2 ? "color-mix(in oklab, var(--gold) 50%, transparent)" : "color-mix(in oklab, var(--emerald-deep) 30%, transparent)",
            filter: "blur(1px)",
          }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8 grid lg:grid-cols-2 gap-12 items-center pt-12 pb-24 min-h-[92vh]">
        <motion.div style={{ y }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs tracking-[0.2em] uppercase mb-8">
            <Sparkles className="h-3 w-3 text-gold" /> New · Aurora Vanity Mirror
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}
            className="font-display text-[12vw] sm:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tighter">
            A botanical<br/>future of <span className="italic text-gradient-gold">beauty</span>.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-8 max-w-md text-foreground/70 leading-relaxed">
            Refillable luxury Make-up vanity, Bath and body, and Salon essentials — quietly designed for the rituals you keep.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-3">
            <Link to="/shop" className="group inline-flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground rounded-full text-sm tracking-[0.18em] uppercase hover:opacity-90 transition shadow-luxe">
              Discover the ritual <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/shop" search={{ cat: "self-care" } as any} className="inline-flex items-center gap-2 px-7 py-4 border border-foreground/20 rounded-full text-sm tracking-[0.18em] uppercase hover:bg-muted transition">
              Self care
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-12 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><Star className="h-3.5 w-3.5 fill-gold text-gold" /> 4.9 · 12,400+ reviews</div>
            <div>·</div>
            <div>As featured in Vogue India</div>
          </motion.div>
        </motion.div>

        {/* visual */}
        <motion.div style={{ scale }} className="relative aspect-square w-full max-w-xl ml-auto">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, var(--gold), var(--emerald-deep), var(--gold))", filter: "blur(60px)", opacity: 0.4 }} />
          <div className="absolute inset-8 rounded-full glass shadow-luxe" />
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-16 rounded-full overflow-hidden shadow-luxe" style={{ backgroundImage: products[0].image }} />
          {/* floating chips */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
            className="absolute -left-4 top-12 glass rounded-2xl p-4 shadow-soft animate-float-slow">
            <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Bestseller</div>
            <div className="font-display text-lg mt-1">Velvet Lip Serum</div>
            <div className="text-xs mt-1">{formatPrice(products[0].price)}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
            className="absolute -right-4 bottom-16 glass rounded-2xl p-4 shadow-soft animate-float-slow" style={{ animationDelay: "1s" }}>
            <div className="flex items-center gap-2"><Leaf className="h-4 w-4 text-primary" /><div className="font-display text-sm">100% botanical</div></div>
            <div className="text-xs text-muted-foreground mt-1">Refillable · Vegan</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <div className="overflow-hidden border-y border-foreground/10 bg-cream">
      <div className="animate-marquee py-6 flex gap-16 whitespace-nowrap font-display text-3xl sm:text-5xl text-foreground/30">
        {Array.from({ length: 2 }).map((_, k) => (
          <div key={k} className="flex gap-16 shrink-0 items-center">
            <span>Refillable luxury</span><span className="text-gold">✦</span>
            <span>Hand-cut neem</span><span className="text-gold">✦</span>
            <span>Vegan, always</span><span className="text-gold">✦</span>
            <span>Made in India</span><span className="text-gold">✦</span>
            <span>Carbon-neutral</span><span className="text-gold">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Categories() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-8 py-24">
      <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
        <div>
          <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">The Atelier</div>
          <h2 className="font-display text-5xl md:text-6xl tracking-tighter">Four worlds, one ritual.</h2>
        </div>
        <Link to="/shop" className="text-sm underline-offset-4 hover:underline">Shop all →</Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <Link to="/shop" search={{ cat: c.id } as any} className="group block relative aspect-[3/4] rounded-3xl overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `radial-gradient(circle at 30% 30%, hsl(${c.hue} 30% 88%), hsl(${c.hue} 35% 60%) 60%, hsl(${c.hue} 40% 30%) 100%)` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                <div className="text-[10px] tracking-[0.2em] uppercase opacity-70">0{i + 1}</div>
                <div className="font-display text-3xl mt-1">{c.name}</div>
                <div className="text-sm opacity-80 mt-1">{c.tagline}</div>
                <div className="mt-4 inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">Explore <ArrowRight className="h-3 w-3" /></div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Trending() {
  const featured = products.slice(0, 8);
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-8 py-16">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Trending</div>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter">Loved this season</h2>
        </div>
        <Link to="/shop" className="text-sm underline-offset-4 hover:underline">View all →</Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
        {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-8 py-24">
      <div className="rounded-[3rem] overflow-hidden gradient-luxe text-primary-foreground p-8 sm:p-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-6">— The story</div>
          <h2 className="font-display text-4xl md:text-6xl tracking-tighter leading-[1.05]">Built slowly,<br/><span className="italic text-gradient-gold">in small batches.</span></h2>
          <p className="mt-8 text-primary-foreground/70 max-w-md leading-relaxed">From cold-pressed rose otto in Kannauj to neem branches gathered in Coorg, every product begins as something living. We work with seventeen artisans, two perfumers, and a small lab in Mumbai.</p>
          <Link to="/about" className="mt-10 inline-flex items-center gap-2 text-gold hover:gap-4 transition-all text-sm tracking-[0.2em] uppercase">Read our story <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[Leaf, RefreshCw, Award, Truck].map((Icon, i) => (
            <div key={i} className="glass-dark rounded-2xl p-6">
              <Icon className="h-6 w-6 text-gold mb-4" />
              <div className="font-display text-lg">{["Botanical", "Refillable", "Heirloom", "Carbon-neutral"][i]}</div>
              <div className="text-xs text-primary-foreground/60 mt-2">{["98% plant-derived", "Glass + brass refills", "Lifetime warranty on tools", "Doorstep delivery"][i]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeforeAfter() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-8 py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Real results</div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tighter">28 days, visible glow.</h2>
        <p className="mt-4 text-muted-foreground">In a panel study with 142 women, the Rose Otto Facial Oil delivered a measurable shift in luminosity.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: "Skin luminosity", value: "+38%" },
          { label: "Hydration (corneometer)", value: "+62%" },
          { label: "Felt softer", value: "94%" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="rounded-3xl p-10 bg-secondary/40 text-center">
            <div className="font-display text-6xl text-gradient-gold">{s.value}</div>
            <div className="mt-3 text-sm text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Counters() {
  const stats = [
    { v: "12,400+", l: "Five-star reviews" },
    { v: "17", l: "Artisans on payroll" },
    { v: "98%", l: "Plant-derived" },
    { v: "0", l: "Plastic in shipping" },
  ];
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-20 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
            <div className="font-display text-5xl md:text-6xl text-gradient-gold">{s.v}</div>
            <div className="mt-2 text-xs tracking-[0.2em] uppercase text-primary-foreground/60">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Press() {
  return (
    <section className="py-16 border-y border-foreground/10">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {testimonials.map((t, i) => (
          <div key={i} className="text-center">
            <div className="font-display text-2xl tracking-[0.18em] text-foreground/40">{t.logo}</div>
            <div className="mt-3 text-xs text-muted-foreground italic">"{t.quote}"</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-8 py-24">
      <div className="text-center mb-12">
        <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">In their words</div>
        <h2 className="font-display text-4xl md:text-5xl tracking-tighter">From our circle.</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="rounded-3xl p-8 bg-card border shadow-soft">
            <div className="flex gap-0.5 mb-4">{Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="h-4 w-4 fill-gold text-gold" />)}</div>
            <div className="font-display text-xl">"{r.title}"</div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{r.body}</p>
            <div className="mt-6 text-xs text-muted-foreground">— {r.name} · {r.date}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-8 py-16">
      <div className="text-center mb-10">
        <div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">@botanica</div>
        <h2 className="font-display text-3xl md:text-4xl tracking-tighter">In the wild.</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {products.slice(0, 12).map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
            className="aspect-square rounded-2xl hover:scale-[1.04] transition-transform cursor-pointer" style={{ backgroundImage: p.image }} />
        ))}
      </div>
    </section>
  );
}
