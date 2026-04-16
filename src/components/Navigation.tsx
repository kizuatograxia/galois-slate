import { memo } from "react";

export type SectionKey = "calculators" | "converters" | "academia";

interface NavigationProps {
  active: SectionKey;
  onChange: (key: SectionKey) => void;
}

const TABS: { key: SectionKey; label: string }[] = [
  { key: "calculators", label: "Calculadoras" },
  { key: "converters", label: "Conversores" },
  { key: "academia", label: "Academia" },
];

const Navigation = memo(({ active, onChange }: NavigationProps) => {
  return (
    <nav
      className="absolute top-0 left-0 right-0 z-30 flex justify-center pt-6 pb-4"
      aria-label="Seções principais"
    >
      <ul className="flex items-center gap-8 sm:gap-12 font-serif-display text-sm tracking-widest uppercase">
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <li key={tab.key}>
              <button
                type="button"
                onClick={() => onChange(tab.key)}
                aria-current={isActive ? "page" : undefined}
                className={`relative pb-2 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-px h-[2px] rounded-full transition-all duration-300 ${
                    isActive ? "bg-accent opacity-100 scale-x-100" : "bg-accent opacity-0 scale-x-0"
                  }`}
                  style={{ transformOrigin: "center" }}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

Navigation.displayName = "Navigation";

export default Navigation;
