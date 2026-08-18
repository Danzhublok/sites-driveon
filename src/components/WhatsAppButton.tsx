import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  href,
  label = "WhatsApp",
  className,
  size = "default",
}: {
  href: string | null;
  label?: string;
  className?: string;
  size?: "default" | "sm";
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 bg-brand font-semibold uppercase tracking-widest text-brand-foreground transition-opacity hover:opacity-85",
        size === "sm" ? "px-4 py-2.5 text-xs" : "px-6 py-3 text-xs",
        className,
      )}
    >
      <MessageCircle className="size-4" />
      {label}
    </a>
  );
}

export function FloatingWhatsApp({ href }: { href: string | null }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-brand px-4 text-brand-foreground shadow-xl transition-transform hover:scale-105 sm:px-5"
    >
      <MessageCircle className="size-6" />
      <span className="hidden text-xs font-bold uppercase tracking-widest sm:inline">
        Falar no WhatsApp
      </span>
    </a>
  );
}
