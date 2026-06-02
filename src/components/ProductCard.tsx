import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { formatPrice, type Product } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const liked = wishlist.includes(product.id);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: (index % 4) * 0.05 }}
      className="group relative"
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden" style={{ backgroundImage: product.image }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {product.isNew && <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase bg-background/80 backdrop-blur rounded-full">New</span>}
          {product.isBestseller && !product.isNew && <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase gradient-gold text-gold-foreground rounded-full">Bestseller</span>}
          {product.compareAt && <span className="absolute top-3 right-3 px-2 py-1 text-[10px] bg-primary text-primary-foreground rounded-full">−{Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%</span>}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className="absolute bottom-3 right-3 h-9 w-9 rounded-full glass flex items-center justify-center hover:scale-110 transition"
            aria-label="Wishlist"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : ""}`} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product.id, product.shades?.[0]?.name); }}
            className="absolute bottom-3 left-3 right-14 py-2.5 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
          >Add to bag</button>
        </div>
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="font-medium hover:text-primary transition-colors block truncate">{product.name}</Link>
          <div className="text-xs text-muted-foreground truncate">{product.tagline}</div>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            <Star className="h-3 w-3 fill-gold text-gold" />
            <span>{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews})</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-medium tabular-nums">{formatPrice(product.price)}</div>
          {product.compareAt && <div className="text-xs text-muted-foreground line-through tabular-nums">{formatPrice(product.compareAt)}</div>}
        </div>
      </div>
    </motion.div>
  );
}
