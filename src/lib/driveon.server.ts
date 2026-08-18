import type { Catalog, Vehicle } from "./driveon-types";

const API_URL = "https://knlizobqalygwidmvjpx.supabase.co/functions/v1/catalog-api";
const CACHE_TTL_MS = 60_000;

let cache: { data: Catalog; expiresAt: number } | null = null;

function normalizeVehicle(raw: Record<string, unknown>): Vehicle | null {
  if (!raw || typeof raw !== "object" || typeof raw["id"] !== "string") return null;
  const photos = Array.isArray(raw["photos"])
    ? (raw["photos"] as unknown[]).filter((p): p is string => typeof p === "string" && p.length > 0)
    : [];
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
  const str = (v: unknown) => (typeof v === "string" && v.trim().length > 0 ? v.trim() : null);
  return {
    id: raw["id"] as string,
    brand: str(raw["brand"]),
    model: str(raw["model"]),
    version: str(raw["version"]),
    year: num(raw["year"]),
    km: num(raw["km"]),
    transmission: str(raw["transmission"]),
    fuel: str(raw["fuel"]),
    color: str(raw["color"]),
    price: num(raw["price"]),
    description: str(raw["description"]),
    photos,
    featured: raw["featured"] === true,
    status: str(raw["status"]) ?? "available",
    created_at: str(raw["created_at"]),
  };
}

export async function loadCatalog(): Promise<Catalog> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.data;

  const token = process.env["DRIVEON_CATALOG_TOKEN"];
  if (!token) throw new Error("Não foi possível carregar os dados da DRIVEON");

  let response: Response;
  try {
    response = await fetch(API_URL, {
      headers: { "X-Driveon-Token": token, Accept: "application/json" },
      signal: AbortSignal.timeout(12_000),
    });
  } catch {
    throw new Error("Não foi possível carregar os dados da DRIVEON");
  }

  if (!response.ok) {
    throw new Error("Não foi possível carregar os dados da DRIVEON");
  }

  const json = (await response.json()) as Record<string, unknown>;
  const store = json["store"];
  if (!store || typeof store !== "object") {
    throw new Error("Resposta inválida da DRIVEON");
  }

  const vehiclesRaw = Array.isArray(json["vehicles"]) ? (json["vehicles"] as Record<string, unknown>[]) : [];
  const vehicles = vehiclesRaw
    .map(normalizeVehicle)
    .filter((v): v is Vehicle => v !== null)
    .filter((v) => (v.status ?? "available").toLowerCase() !== "sold");

  const data: Catalog = {
    store: store as Catalog["store"],
    vehicles,
    updated_at: typeof json["updated_at"] === "string" ? (json["updated_at"] as string) : null,
  };

  cache = { data, expiresAt: now + CACHE_TTL_MS };
  return data;
}