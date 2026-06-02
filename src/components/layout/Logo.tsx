import { Link } from "@tanstack/react-router";

export function Logo({ className = "", imgClassName = "h-20" }: { className?: string; imgClassName?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center ${className}`}>
      <img src="/logo.svg" alt="Brand logo" className={imgClassName} />
    </Link>
  );
}
