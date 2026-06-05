import { Link } from "@tanstack/react-router";

export function Logo({ className = "", imgClassName = "h-20" }: { className?: string; imgClassName?: string }) {
  const logoSrc = `${import.meta.env.BASE_URL}logo.svg`;

  return (
    <Link to="/" className={`inline-flex items-center ${className}`}>
      <img src={logoSrc} alt="Brand logo" className={imgClassName} />
    </Link>
  );
}
