import type { Store, Vehicle } from "./driveon-types";

export const FALLBACK_COLORS = {
  primary: "#16a34a",
  secondary: "#111827",
  accent: "#f59e0b",
};

export const PLACEHOLDER_PHOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="#e5e7eb"/><text x="400" y="310" font-family="sans-serif" font-size="34" fill="#9ca3af" text-anchor="middle">Sem foto</text></svg>`,
  );

export function formatCurrency(value?: number | null): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function formatKm(value?: number | null): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return `${value.toLocaleString("pt-BR")} km`;
}

export function vehicleTitle(v: Vehicle): string {
  return [v.brand, v.model, v.version].filter(Boolean).join(" ").trim() || "Veículo";
}

export function vehiclePhoto(v: Vehicle): string {
  return v.photos?.[0] ?? PLACEHOLDER_PHOTO;
}

export function normalizePhone(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return digits.startsWith("55") ? digits : `55${digits}`;
}

export function whatsappLink(phone: string | null | undefined, message: string): string | null {
  const number = normalizePhone(phone);
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function vehicleWhatsappMessage(v: Vehicle, showPrice: boolean, url: string): string {
  const price = showPrice ? formatCurrency(v.price) : null;
  return `Olá! Tenho interesse no ${[v.brand, v.model, v.version].filter(Boolean).join(" ")}${
    v.year ? `, ano ${v.year}` : ""
  }${price ? `, anunciado por ${price}` : ""}. Link: ${url}`;
}

export function instagramUrl(handle?: string | null): string | null {
  if (!handle) return null;
  const value = handle.trim();
  if (!value) return null;
  if (value.startsWith("http")) return value;
  return `https://instagram.com/${value.replace(/^@/, "")}`;
}

export function formatPhone(phone?: string | null): string | null {
  if (!phone) return null;
  const d = phone.replace(/\D/g, "").replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return phone;
}

export function storeLocation(store: Store): string | null {
  const parts = [store.city, store.state].filter(Boolean);
  return parts.length ? parts.join(" - ") : null;
}

export function isReserved(v: Vehicle): boolean {
  return (v.status ?? "").toLowerCase() === "reserved";
}