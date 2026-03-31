import { PLANETS, type Planet } from "@/lib/physics/planets";
import { cn } from "@/lib/utils";

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
}

const PlanetSelector = ({ selected, onToggle }: Props) => (
  <div className="glass-panel p-5 space-y-3">
    <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
      🌌 Comparar Planetas
    </h2>
    <div className="grid grid-cols-3 gap-2">
      {PLANETS.map((p) => {
        const active = selected.includes(p.id);
        return (
          <button
            key={p.id}
            onClick={() => onToggle(p.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs transition-all",
              active
                ? "border-primary/60 bg-primary/10 text-foreground"
                : "border-border/40 bg-card/40 text-muted-foreground hover:border-border hover:bg-card/80"
            )}
          >
            <span className="text-lg">{p.emoji}</span>
            <span className="font-medium">{p.name}</span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {p.gravity} m/s²
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default PlanetSelector;
