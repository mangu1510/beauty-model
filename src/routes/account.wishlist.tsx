import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { products } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/account/wishlist")({ component: Wishlist });

function Wishlist() {
  const { wishlist } = useStore();
  const items = products.filter(p => wishlist.includes(p.id));
  if (items.length === 0) return (
    <div className="text-center py-20">
      <Heart className="h-10 w-10 mx-auto text-muted-foreground" />
      <div className="mt-4 font-display text-2xl">Nothing saved yet.</div>
      <Link to="/shop" className="inline-block mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm tracking-[0.18em] uppercase">Explore</Link>
    </div>
  );
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10">
      {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  );
}
