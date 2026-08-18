const LANDING_PAGE = "https://driveon.danixzz-2by.workers.dev/";

export function DriveonBrand({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href={LANDING_PAGE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conheça a DRIVEON"
      className="group inline-flex items-center gap-2.5 transition-opacity hover:opacity-70"
    >
      <svg viewBox="0 0 72 52" className="h-9 w-12 shrink-0" aria-hidden="true">
        <path
          d="M31 5h17c12 0 21 9 21 21S60 47 48 47H30l8-9h10c7 0 12-5 12-12s-5-12-12-12H39L31 5Z"
          fill="currentColor"
        />
        <path
          d="M4 16h29l-6 8H10l-6-8Zm7 11h19l-6 8H17l-6-8Zm9 11h12l-7 9H13l7-9Z"
          fill="var(--brand)"
        />
      </svg>
      <span className="leading-none">
        <span className="block -skew-x-6 text-xl font-extrabold italic tracking-tight">
          DRIVE<span className="text-brand">ON</span>
        </span>
        {!compact ? (
          <span className="mt-1 block text-[6px] font-semibold tracking-[0.13em] opacity-60">
            VENDA MAIS CARROS. PERCA MENOS CLIENTES.
          </span>
        ) : null}
      </span>
    </a>
  );
}
