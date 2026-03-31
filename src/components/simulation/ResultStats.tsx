import type { ProjectileResult } from "@/lib/physics/projectile";
import type { Planet } from "@/lib/physics/planets";
import { ArrowUp, MoveHorizontal, Clock } from "lucide-react";

interface Props {
  result: ProjectileResult;
  planetResults?: { planet: Planet; result: ProjectileResult }[];
}

const stats = [
  { key: "maxHeight" as const, label: "Altura Máxima", unit: "m", icon: ArrowUp, color: "text-primary" },
  { key: "range" as const, label: "Alcance", unit: "m", icon: MoveHorizontal, color: "text-accent" },
  { key: "totalTime" as const, label: "Tempo de Voo", unit: "s", icon: Clock, color: "text-foreground" },
];

const ResultStats = ({ result, planetResults = [] }: Props) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map(({ key, label, unit, icon: Icon, color }) => (
        <div key={key} className="glass-panel p-5 flex flex-col gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="stat-label">{label}</span>
            <span className="text-[10px] text-muted-foreground ml-auto">🌍 Terra</span>
          </div>
          <span className={`stat-value ${color}`}>
            {result[key].toFixed(2)}
            <span className="text-sm text-muted-foreground ml-1">{unit}</span>
          </span>
          {/* Planet comparisons */}
          {planetResults.length > 0 && (
            <div className="border-t border-border/30 pt-2 mt-1 space-y-1">
              {planetResults.map(({ planet, result: pr }) => (
                <div key={planet.id} className="flex justify-between text-xs font-mono text-muted-foreground">
                  <span>{planet.emoji} {planet.name}</span>
                  <span>{pr[key].toFixed(2)} {unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default ResultStats;
