import type { ProjectileResult } from "@/lib/projectile";
import { ArrowUp, MoveHorizontal, Clock } from "lucide-react";

interface Props {
  result: ProjectileResult;
}

const stats = [
  {
    key: "maxHeight" as const,
    label: "Altura Máxima",
    unit: "m",
    icon: ArrowUp,
    color: "text-primary",
  },
  {
    key: "range" as const,
    label: "Alcance",
    unit: "m",
    icon: MoveHorizontal,
    color: "text-accent",
  },
  {
    key: "totalTime" as const,
    label: "Tempo de Voo",
    unit: "s",
    icon: Clock,
    color: "text-foreground",
  },
];

const ResultStats = ({ result }: Props) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {stats.map(({ key, label, unit, icon: Icon, color }) => (
      <div
        key={key}
        className="glass-panel p-5 flex flex-col gap-2 animate-fade-in"
      >
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="stat-label">{label}</span>
        </div>
        <span className={`stat-value ${color}`}>
          {result[key].toFixed(2)}
          <span className="text-sm text-muted-foreground ml-1">{unit}</span>
        </span>
      </div>
    ))}
  </div>
);

export default ResultStats;
