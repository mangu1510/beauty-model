import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Input } from "./login";

export const Route = createFileRoute("/forgot")({
  head: () => ({ meta: [{ title: "Reset password — Beauty Model" }] }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <AuthShell>
      <h1 className="font-display text-5xl tracking-tighter">Forgot password?</h1>
      <p className="mt-3 text-muted-foreground">No worries. We'll send a reset link.</p>
      {sent ? (
        <div className="mt-10 p-6 rounded-2xl bg-secondary/40">
          <div className="font-display text-xl">Check your inbox.</div>
          <p className="mt-2 text-sm text-muted-foreground">A reset link is on its way to <span className="text-foreground">{email}</span>.</p>
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="mt-10 space-y-4">
          <Input label="Email" type="email" value={email} onChange={setEmail} />
          <button className="w-full py-4 bg-primary text-primary-foreground rounded-full text-sm tracking-[0.18em] uppercase">Send reset link</button>
        </form>
      )}
      <p className="mt-8 text-sm text-center text-muted-foreground"><Link to="/login" className="text-foreground underline-offset-4 hover:underline">Back to sign in</Link></p>
    </AuthShell>
  );
}
