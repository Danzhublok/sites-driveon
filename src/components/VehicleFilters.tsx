import { useState } from "react";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";

export type Filters = {
  q: string;
  brand: string;
  transmission: string;
  fuel: string;
  status: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxKm: string;
  sort: string;
};

export const EMPTY_FILTERS: Filters = {
  q: "",
  brand: "",
  transmission: "",
  fuel: "",
  status: "",
  minPrice: "",
  maxPrice: "",
  minYear: "",
  maxKm: "",
  sort: "recent",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

const inputClass =
  "h-10 rounded-none border border-input bg-background px-3 text-sm font-normal text-foreground outline-none focus:border-brand";

export function VehicleFilters({
  filters,
  onChange,
  onClear,
  brands,
  transmissions,
  fuels,
  showStatusFilter,
  showPrices,
  resultCount,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
  brands: string[];
  transmissions: string[];
  fuels: string[];
  showStatusFilter: boolean;
  showPrices: boolean;
  resultCount: number;
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const activeFilters = [
    filters.brand,
    filters.transmission,
    filters.fuel,
    filters.status,
    filters.minPrice,
    filters.maxPrice,
    filters.minYear,
    filters.maxKm,
  ].filter(Boolean).length;

  return (
    <div className="surface-card space-y-4 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
          <SlidersHorizontal className="size-4 text-brand" /> Filtros
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-brand underline-offset-4 hover:underline"
        >
          Limpar filtros
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-none border border-input px-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={filters.q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="Marca, modelo ou versão"
          aria-label="Buscar"
          className="h-11 w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="lg:hidden">
        <Field label="Ordenar por">
          <select
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value })}
            className={inputClass}
          >
            <option value="recent">Mais recentes</option>
            {showPrices ? <option value="price-asc">Menor preço</option> : null}
            {showPrices ? <option value="price-desc">Maior preço</option> : null}
            <option value="year-desc">Ano mais novo</option>
            <option value="year-asc">Ano mais antigo</option>
            <option value="km-asc">Menor quilometragem</option>
          </select>
        </Field>
      </div>

      <button
        type="button"
        onClick={() => setAdvancedOpen((open) => !open)}
        aria-expanded={advancedOpen}
        className="flex h-11 w-full items-center justify-between border border-input px-3 text-xs font-bold uppercase tracking-widest lg:hidden"
      >
        <span>Mais filtros{activeFilters ? ` (${activeFilters})` : ""}</span>
        <ChevronDown
          className={`size-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`${advancedOpen ? "grid" : "hidden"} gap-4 sm:grid-cols-2 lg:grid lg:grid-cols-1`}
      >
        <Field label="Marca">
          <select
            value={filters.brand}
            onChange={(e) => onChange({ brand: e.target.value })}
            className={inputClass}
          >
            <option value="">Todas</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        {showPrices ? (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Preço mín.">
              <input
                type="number"
                inputMode="numeric"
                value={filters.minPrice}
                onChange={(e) => onChange({ minPrice: e.target.value })}
                placeholder="0"
                className={inputClass}
              />
            </Field>
            <Field label="Preço máx.">
              <input
                type="number"
                inputMode="numeric"
                value={filters.maxPrice}
                onChange={(e) => onChange({ maxPrice: e.target.value })}
                placeholder="200000"
                className={inputClass}
              />
            </Field>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Ano mín.">
            <input
              type="number"
              inputMode="numeric"
              value={filters.minYear}
              onChange={(e) => onChange({ minYear: e.target.value })}
              placeholder="2010"
              className={inputClass}
            />
          </Field>
          <Field label="KM máx.">
            <input
              type="number"
              inputMode="numeric"
              value={filters.maxKm}
              onChange={(e) => onChange({ maxKm: e.target.value })}
              placeholder="100000"
              className={inputClass}
            />
          </Field>
        </div>

        {transmissions.length ? (
          <Field label="Câmbio">
            <select
              value={filters.transmission}
              onChange={(e) => onChange({ transmission: e.target.value })}
              className={inputClass}
            >
              <option value="">Todos</option>
              {transmissions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        ) : null}

        {fuels.length ? (
          <Field label="Combustível">
            <select
              value={filters.fuel}
              onChange={(e) => onChange({ fuel: e.target.value })}
              className={inputClass}
            >
              <option value="">Todos</option>
              {fuels.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>
        ) : null}

        {showStatusFilter ? (
          <Field label="Status">
            <select
              value={filters.status}
              onChange={(e) => onChange({ status: e.target.value })}
              className={inputClass}
            >
              <option value="">Todos</option>
              <option value="available">Disponível</option>
              <option value="reserved">Reservado</option>
            </select>
          </Field>
        ) : null}

        <div className="hidden lg:block">
          <Field label="Ordenar por">
            <select
              value={filters.sort}
              onChange={(e) => onChange({ sort: e.target.value })}
              className={inputClass}
            >
              <option value="recent">Mais recentes</option>
              {showPrices ? <option value="price-asc">Menor preço</option> : null}
              {showPrices ? <option value="price-desc">Maior preço</option> : null}
              <option value="year-desc">Ano mais novo</option>
              <option value="year-asc">Ano mais antigo</option>
              <option value="km-asc">Menor quilometragem</option>
            </select>
          </Field>
        </div>
      </div>

      <p
        className="border-t border-border pt-4 text-center text-sm text-muted-foreground lg:text-left"
        aria-live="polite"
      >
        <span className="font-bold text-foreground">{resultCount}</span> veículo(s) encontrado(s)
      </p>
    </div>
  );
}
