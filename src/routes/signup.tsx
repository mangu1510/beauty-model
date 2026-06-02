import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { AuthShell, Input, Divider, SocialRow } from "./login";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Join — Beauty Model" }] }),
  component: Signup,
});

function Signup() {
  const { remoteSignUp } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sentCode, setSentCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email],
  );

  const sendOtp = () => {
    const code = generateOtp();
    setSentCode(code);
    setOtp(["", "", "", "", "", ""]);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    if (pw.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    sendOtp();
    setStep("otp");
  };

  const handleVerify = async () => {
    const entered = otp.join("");
    if (entered !== sentCode) {
      setError("The code does not match. Try again or resend.");
      return;
    }
    try {
      await remoteSignUp(name, email, pw);
      navigate({ to: "/account" });
    } catch (err: any) {
      setError(err?.message || 'Failed to create account');
    }
  };

  const handleSocialClick = (service: string) => {
    if (service === "Google") {
      if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        window.location.href = "/api/auth/google";
        return;
      }
      setError("Google OAuth is not configured. Please use email and password.");
      return;
    }

    setError(`${service} sign-up is not configured yet.`);
  };

  if (step === "otp") {
    return (
      <AuthShell side="right">
        <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground">Step 2 of 2</div>
        <h1 className="mt-2 font-display text-4xl tracking-tighter">Verify your account.</h1>
        <p className="mt-3 text-muted-foreground">
          Enter the 6-digit code sent to <span className="text-foreground">{email}</span>.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          For demo mode, your code is <span className="font-medium text-foreground">{sentCode}</span>.
        </p>
        <div className="mt-10 flex gap-2 justify-center">
          {otp.map((value, index) => (
            <input
              key={index}
              value={value}
              maxLength={1}
              onChange={e => {
                const next = [...otp];
                next[index] = e.target.value.replace(/\D/, "");
                setOtp(next);
                if (e.target.value && index < 5) {
                  (e.target.parentElement?.children[index + 1] as HTMLInputElement)?.focus();
                }
              }}
              className="h-14 w-12 rounded-2xl text-center text-lg font-display bg-muted/40 border focus:border-primary outline-none"
            />
          ))}
        </div>
        {error ? <div className="mt-4 text-sm text-destructive">{error}</div> : null}
        <button onClick={handleVerify} className="mt-10 w-full py-4 bg-primary text-primary-foreground rounded-full text-sm tracking-[0.18em] uppercase shadow-luxe">
          Verify & enter
        </button>
        <p className="mt-6 text-sm text-center text-muted-foreground">
          Didn't receive it?{' '}
          <button onClick={() => sendOtp()} className="text-foreground underline-offset-4 hover:underline">
            Resend code
          </button>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell side="right">
      <h1 className="font-display text-5xl tracking-tighter">Begin your ritual.</h1>
      <p className="mt-3 text-muted-foreground">Save your shades, track your rituals, earn loyalty pearls.</p>
      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <Input label="Full name" value={name} onChange={setName} />
        <Input label="Email" type="email" value={email} onChange={setEmail} />
        <Input label="Password" type="password" value={pw} onChange={setPw} />
        {error ? <div className="text-sm text-destructive">{error}</div> : null}
        <button className="w-full py-4 bg-primary text-primary-foreground rounded-full text-sm tracking-[0.18em] uppercase shadow-luxe">Create account</button>
      </form>
      <Divider />
      <SocialRow onSocialClick={handleSocialClick} />
      <p className="mt-8 text-sm text-center text-muted-foreground">Already with us? <Link to="/login" className="text-foreground underline-offset-4 hover:underline">Sign in</Link></p>
    </AuthShell>
  );
}
