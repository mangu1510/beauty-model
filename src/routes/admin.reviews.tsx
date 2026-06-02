import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { reviews, products } from "@/lib/mock-data";
export const Route = createFileRoute("/admin/reviews")({ component: AdminReviews });
function AdminReviews() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">Reviews · moderation</h1>
      <div className="space-y-3">
        {reviews.concat(reviews).map((r, i) => (
          <div key={i} className="p-5 rounded-2xl border bg-card flex gap-4">
            <div className="h-12 w-12 rounded-xl shrink-0" style={{ backgroundImage: products[i % products.length].image }} />
            <div className="flex-1">
              <div className="flex items-center justify-between"><div className="font-medium">{r.name} · {products[i % products.length].name}</div><div className="text-xs text-muted-foreground">{r.date}</div></div>
              <div className="flex gap-0.5 my-1">{Array.from({ length: r.rating }).map((_, k) => <Star key={k} className="h-3 w-3 fill-gold text-gold" />)}</div>
              <div className="text-sm">{r.body}</div>
              <div className="mt-3 flex gap-2"><button className="px-3 py-1 text-xs rounded-full bg-emerald-deep text-cream">Approve</button><button className="px-3 py-1 text-xs rounded-full border">Reject</button></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
