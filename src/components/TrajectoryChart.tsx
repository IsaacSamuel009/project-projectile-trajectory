import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { ProjectileResult } from "@/lib/projectile";

interface Props {
  result: ProjectileResult;
  showAir: boolean;
}

const TrajectoryChart = ({ result, showAir }: Props) => {
  return (
    <div className="glass-panel p-4 md:p-6 glow-primary">
      <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
        Trajetória do Projétil
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(220 14% 20%)"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="x"
            type="number"
            name="Distância"
            unit=" m"
            tick={{ fill: "hsl(215 12% 55%)", fontSize: 12 }}
            axisLine={{ stroke: "hsl(220 14% 20%)" }}
            label={{
              value: "Distância (m)",
              position: "bottom",
              fill: "hsl(215 12% 55%)",
              fontSize: 12,
            }}
          />
          <YAxis
            dataKey="y"
            type="number"
            name="Altura"
            unit=" m"
            tick={{ fill: "hsl(215 12% 55%)", fontSize: 12 }}
            axisLine={{ stroke: "hsl(220 14% 20%)" }}
            label={{
              value: "Altura (m)",
              angle: -90,
              position: "insideLeft",
              fill: "hsl(215 12% 55%)",
              fontSize: 12,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220 18% 10%)",
              border: "1px solid hsl(220 14% 18%)",
              borderRadius: "8px",
              color: "hsl(210 20% 92%)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
            }}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Legend
            wrapperStyle={{ color: "hsl(210 20% 92%)", fontSize: 12 }}
          />
          <Scatter
            name="Sem resistência"
            data={result.trajectory}
            fill="hsl(160 80% 50%)"
            line={{ stroke: "hsl(160 80% 50%)", strokeWidth: 2 }}
            shape={() => null}
            legendType="line"
          />
          {showAir && result.trajectoryAir && (
            <Scatter
              name="Com resistência do ar"
              data={result.trajectoryAir}
              fill="hsl(35 95% 55%)"
              line={{
                stroke: "hsl(35 95% 55%)",
                strokeWidth: 2,
                strokeDasharray: "6 3",
              }}
              shape={() => null}
              legendType="line"
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrajectoryChart;
