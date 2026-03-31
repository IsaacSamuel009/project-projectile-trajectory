import type { TrajectoryPoint } from "@/lib/physics/projectile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  trajectory: TrajectoryPoint[];
}

const DataTable = ({ trajectory }: Props) => {
  // Sample ~20 points
  const step = Math.max(1, Math.floor(trajectory.length / 20));
  const sampled = trajectory.filter((_, i) => i % step === 0 || i === trajectory.length - 1);

  return (
    <div className="glass-panel p-4 md:p-5">
      <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">
        📊 Dados Numéricos
      </h2>
      <div className="max-h-64 overflow-auto rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="font-mono text-xs">t (s)</TableHead>
              <TableHead className="font-mono text-xs">x (m)</TableHead>
              <TableHead className="font-mono text-xs">y (m)</TableHead>
              <TableHead className="font-mono text-xs">Vx (m/s)</TableHead>
              <TableHead className="font-mono text-xs">Vy (m/s)</TableHead>
              <TableHead className="font-mono text-xs">|V| (m/s)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampled.map((p, i) => (
              <TableRow key={i} className="border-border/30 text-xs font-mono">
                <TableCell>{p.t.toFixed(2)}</TableCell>
                <TableCell>{p.x.toFixed(2)}</TableCell>
                <TableCell>{p.y.toFixed(2)}</TableCell>
                <TableCell>{p.vx.toFixed(2)}</TableCell>
                <TableCell>{p.vy.toFixed(2)}</TableCell>
                <TableCell>{Math.sqrt(p.vx ** 2 + p.vy ** 2).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
