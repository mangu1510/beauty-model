import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/preferences")({ component: Prefs });

function Prefs() {
  return (
    <div className="space-y-8">
      <Block title="Skin profile">
        <div className="grid sm:grid-cols-2 gap-3">
          {["Dry", "Oily", "Combination", "Sensitive"].map(t => <Chip key={t}>{t}</Chip>)}
        </div>
      </Block>
      <Block title="Concerns">
        <div className="flex flex-wrap gap-2">
          {["Glow", "Anti-aging", "Hydration", "Pigmentation", "Texture", "Pores"].map(t => <Chip key={t}>{t}</Chip>)}
        </div>
      </Block>
      <Block title="Shade family">
        <div className="flex flex-wrap gap-2">
          {["Fair", "Light", "Medium", "Tan", "Deep", "Rich"].map(t => <Chip key={t}>{t}</Chip>)}
        </div>
      </Block>
    </div>
  );
}
const Block = ({ title, children }: any) => <div><div className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">{title}</div>{children}</div>;
const Chip = ({ children }: any) => <button className="px-4 py-2 rounded-full bg-muted hover:bg-secondary text-sm">{children}</button>;
