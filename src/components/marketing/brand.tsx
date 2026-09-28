import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import logoAsset from "@/assets/mackdish-logo.svg.asset.json";

export function Brand() {
  return (
    <Link
      to="/"
      className="group inline-flex items-center"
      aria-label="Mackdish Solutions home"
    >
      <img
        src={logoAsset.url}
        alt="Mackdish Solutions"
        className="h-11 w-auto object-contain"
      />
    </Link>
  );
}

export function TextLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
    >
      {children}
      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
