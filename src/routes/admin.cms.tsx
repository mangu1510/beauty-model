import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/cms")({ component: CMS });
function CMS() {
  return (
    <div>
      <h1 className="font-display text-3xl mb-6">CMS · Pages</h1>
      <div className="grid md:grid-cols-[1fr_2fr] gap-6">
        <div className="space-y-2">
          {["Home hero", "Story", "Sustainability", "Press", "Help", "Privacy"].map((p, i) => (
            <button key={p} className={`w-full text-left p-4 rounded-xl border ${i === 0 ? "bg-secondary" : "bg-card hover:bg-muted/40"}`}>{p}</button>
          ))}
        </div>
        <div className="p-6 rounded-2xl border bg-card">
          <input defaultValue="A botanical future of beauty." className="w-full text-2xl font-display bg-transparent outline-none border-b pb-2" />
          <textarea rows={10} defaultValue="Refillable luxury makeup, heirloom vanity, and wild-harvested neem wood — quietly designed for the rituals you keep." className="mt-4 w-full bg-transparent outline-none resize-none" />
          <div className="mt-4 flex gap-2"><button className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm">Save changes</button><button className="px-4 py-2 rounded-full border text-sm">Preview</button></div>
        </div>
      </div>
    </div>
  );
}
