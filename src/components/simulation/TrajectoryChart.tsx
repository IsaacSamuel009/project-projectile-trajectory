import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
} from "recharts";
import type { ProjectileResult, TrajectoryPoint } from "@/lib/physics/projectile";
import type { Planet } from "@/lib/physics/planets";
import { Play, Pause, RotateCcw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import VectorOverlay from "./VectorOverlay";

interface Props {
  result: ProjectileResult;
  showAir: boolean;
  planetResults?: { planet: Planet; result: ProjectileResult }[];
}

const SPEED_OPTIONS = [0.5, 1, 2] as const;

const TrajectoryChart = ({ result, showAir, planetResults = [] }: Props) => {
  const [animIndex, setAnimIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [showVectors, setShowVectors] = useState(false);
  const rafRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const durationMs = Math.max((result.totalTime * 400) / speed, 500);

  const stop = useCallback(() => {
    setPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    stop();
    setAnimIndex(null);
  }, [result, stop]);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const idx = Math.floor(progress * (result.trajectory.length - 1));
      setAnimIndex(idx);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPlaying(false);
      }
    },
    [durationMs, result.trajectory.length]
  );

  const handlePlay = () => {
    if (playing) { stop(); return; }
    startTimeRef.current = 0;
    setPlaying(true);
    rafRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => { stop(); setAnimIndex(null); };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const currentPoint = animIndex !== null ? result.trajectory[animIndex] : null;
  const currentAirPoint =
    animIndex !== null && showAir && result.trajectoryAir
      ? result.trajectoryAir[Math.min(animIndex, result.trajectoryAir.length - 1)]
      : null;

  // Compute chart bounds for vector overlay
  const chartBounds = useMemo(() => {
    const allPoints = [
      ...result.trajectory,
      ...(result.trajectoryAir ?? []),
      ...planetResults.flatMap((pr) => pr.result.trajectory),
    ];
    if (!allPoints.length) return null;
    const xs = allPoints.map((p) => p.x);
    const ys = allPoints.map((p) => p.y);
    return {
      xMin: 0,
      xMax: Math.max(...xs) * 1.05 || 1,
      yMin: 0,
      yMax: Math.max(...ys) * 1.1 || 1,
    };
  }, [result, planetResults]);

  return (
    <div className="glass-panel p-4 md:p-6 glow-primary">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
          Trajetória do Projétil
        </h2>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={showVectors ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowVectors(!showVectors)}
            className="gap-1.5 text-xs"
          >
            {showVectors ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            Vetores
          </Button>
          <div className="flex items-center gap-0.5 mr-1">
            {SPEED_OPTIONS.map((s) => (
              <Button
                key={s}
                variant={speed === s ? "default" : "ghost"}
                size="sm"
                onClick={() => setSpeed(s)}
                className="text-xs px-2 h-7 min-w-0"
              >
                {s}x
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handlePlay} className="gap-1.5 text-xs">
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {playing ? "Pausar" : "Animar"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1.5 text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={420}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 20%)" strokeOpacity={0.5} />
            <XAxis
              dataKey="x" type="number" name="Distância" unit=" m"
              tick={{ fill: "hsl(215 12% 55%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(220 14% 20%)" }}
              label={{ value: "Distância (m)", position: "bottom", fill: "hsl(215 12% 55%)", fontSize: 12 }}
            />
            <YAxis
              dataKey="y" type="number" name="Altura" unit=" m"
              tick={{ fill: "hsl(215 12% 55%)", fontSize: 12 }}
              axisLine={{ stroke: "hsl(220 14% 20%)" }}
              label={{ value: "Altura (m)", angle: -90, position: "insideLeft", fill: "hsl(215 12% 55%)", fontSize: 12 }}
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
            <Legend wrapperStyle={{ color: "hsl(210 20% 92%)", fontSize: 12 }} />

            {/* Main trajectory */}
            <Scatter
              name="Terra (sem resist.)"
              data={result.trajectory}
              fill="hsl(160 80% 50%)"
              line={{ stroke: "hsl(160 80% 50%)", strokeWidth: 2 }}
              shape={() => null}
              legendType="line"
            />

            {/* Air resistance */}
            {showAir && result.trajectoryAir && (
              <Scatter
                name="Terra (com resist.)"
                data={result.trajectoryAir}
                fill="hsl(35 95% 55%)"
                line={{ stroke: "hsl(35 95% 55%)", strokeWidth: 2, strokeDasharray: "6 3" }}
                shape={() => null}
                legendType="line"
              />
            )}

            {/* Planet trajectories */}
            {planetResults.map(({ planet, result: pr }) => (
              <Scatter
                key={planet.id}
                name={`${planet.emoji} ${planet.name}`}
                data={pr.trajectory}
                fill={planet.color}
                line={{ stroke: planet.color, strokeWidth: 1.5, strokeDasharray: "4 2" }}
                shape={() => null}
                legendType="line"
              />
            ))}

            {/* Animated dots */}
            {currentPoint && (
              <ReferenceDot x={currentPoint.x} y={currentPoint.y} r={7}
                fill="hsl(160 80% 50%)" stroke="hsl(160 80% 90%)" strokeWidth={2} />
            )}
            {currentAirPoint && (
              <ReferenceDot x={currentAirPoint.x} y={currentAirPoint.y} r={7}
                fill="hsl(35 95% 55%)" stroke="hsl(35 95% 80%)" strokeWidth={2} />
            )}
            {planetResults.map(({ planet, result: pr }) => {
              if (animIndex === null) return null;
              const idx = Math.min(animIndex, pr.trajectory.length - 1);
              const pt = pr.trajectory[idx];
              return pt ? (
                <ReferenceDot key={planet.id} x={pt.x} y={pt.y} r={5}
                  fill={planet.color} stroke="white" strokeWidth={1} />
              ) : null;
            })}
          </ScatterChart>
        </ResponsiveContainer>

        {/* Vector overlay */}
        {showVectors && (
          <div className="absolute" style={{ top: 10, left: 10, right: 20, bottom: 20 }}>
            <VectorOverlay point={currentPoint} chartBounds={chartBounds} show={showVectors} />
          </div>
        )}
      </div>

      {/* Vector legend */}
      {showVectors && (
        <div className="flex gap-4 mt-2 text-[11px] font-mono text-muted-foreground justify-center">
          <span><span className="inline-block w-3 h-0.5 bg-[hsl(200,80%,60%)] mr-1 align-middle" /> Vx (horizontal)</span>
          <span><span className="inline-block w-3 h-0.5 bg-[hsl(340,80%,60%)] mr-1 align-middle" /> Vy (vertical)</span>
          <span><span className="inline-block w-3 h-0.5 bg-[hsl(50,90%,60%)] mr-1 align-middle" /> V (resultante)</span>
        </div>
      )}

      {/* Current point info */}
      {currentPoint && (
        <div className="mt-3 flex gap-4 text-xs font-mono text-muted-foreground justify-center flex-wrap">
          <span>t = {currentPoint.t.toFixed(2)}s</span>
          <span>x = {currentPoint.x.toFixed(2)}m</span>
          <span>y = {currentPoint.y.toFixed(2)}m</span>
          <span>Vx = {currentPoint.vx.toFixed(2)}m/s</span>
          <span>Vy = {currentPoint.vy.toFixed(2)}m/s</span>
          <span>|V| = {Math.sqrt(currentPoint.vx ** 2 + currentPoint.vy ** 2).toFixed(2)}m/s</span>
        </div>
      )}
    </div>
  );
};

export default TrajectoryChart;
