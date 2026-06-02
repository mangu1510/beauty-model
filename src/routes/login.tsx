import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/layout/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Beauty Model" }] }),
  component: Login,
});

function Login() {
  const { remoteSignIn } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSocialClick = (service: string) => {
    if (service === "Google") {
      if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        window.location.href = "/api/auth/google";
        return;
      }
      setError("Google OAuth is not configured. Please use email and password.");
      return;
    }

    setError(`${service} login is not configured yet.`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter your email to sign in.");
      return;
    }
    setError(null);
    try {
      await remoteSignIn(email, pw);
      navigate({ to: "/account" });
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in');
    }
  };

  return (
    <AuthShell side="left">
      <h1 className="font-display text-5xl tracking-tighter">Welcome back.</h1>
      <p className="mt-3 text-muted-foreground">Your rituals, saved exactly as you left them.</p>
      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <Input label="Email" type="email" value={email} onChange={setEmail} />
        <Input label="Password" type="password" value={pw} onChange={setPw} />
        <div className="flex justify-between text-xs">
          <label className="flex items-center gap-2"><input type="checkbox" className="accent-primary" /> Remember me</label>
          <Link to="/forgot" className="underline-offset-4 hover:underline">Forgot password?</Link>
        </div>
        {error ? <div className="text-sm text-destructive">{error}</div> : null}
        <button className="w-full py-4 bg-primary text-primary-foreground rounded-full text-sm tracking-[0.18em] uppercase shadow-luxe">Sign in</button>
      </form>
      <Divider />
      <SocialRow onSocialClick={handleSocialClick} />
      <p className="mt-8 text-sm text-center text-muted-foreground">New here? <Link to="/signup" className="text-foreground underline-offset-4 hover:underline">Create an account</Link></p>
    </AuthShell>
  );
}

export function AuthShell({ children, side = "left" }: { children: React.ReactNode; side?: "left" | "right" }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className={`relative overflow-hidden gradient-luxe text-primary-foreground p-12 hidden lg:flex flex-col justify-between ${side === "right" ? "order-last" : ""}`}>
        <Logo className="text-3xl" imgClassName="h-16" />
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute right-12 bottom-32 h-72 w-72 rounded-full" style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)", filter: "blur(40px)", opacity: 0.4 }} />
        <div className="relative">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">— A note</div>
          <p className="font-display text-3xl leading-snug max-w-md">"The rituals you keep daily are the future you're quietly designing."</p>
          <div className="mt-6 text-sm text-primary-foreground/60">— Beauty Model</div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

export function Input({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs tracking-[0.18em] uppercase text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="mt-1.5 w-full px-4 py-3.5 rounded-full bg-muted/40 border border-transparent focus:border-primary focus:bg-background outline-none transition" />
    </label>
  );
}

export function Divider() {
  return (
    <div className="my-8 flex items-center gap-4 text-xs text-muted-foreground">
      <div className="flex-1 h-px bg-border" /> or continue with <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export function SocialRow({ onSocialClick }: { onSocialClick?: (service: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {["Google", "Apple", "Phone"].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onSocialClick?.(s)}
          className="py-3 rounded-full border text-sm hover:bg-muted transition"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
