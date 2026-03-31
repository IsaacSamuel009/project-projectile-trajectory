import type { TrajectoryPoint } from "@/lib/physics/projectile";

interface Props {
  point: TrajectoryPoint | null;
  chartBounds: { xMin: number; xMax: number; yMin: number; yMax: number } | null;
  show: boolean;
}

/**
 * Renders SVG velocity vectors overlaid on the chart.
 * Must be placed inside an absolutely positioned container matching chart area.
 */
const VectorOverlay = ({ point, chartBounds, show }: Props) => {
  if (!show || !point || !chartBounds) return null;

  const { xMin, xMax, yMin, yMax } = chartBounds;
  const w = 100; // percentage coordinates
  const h = 100;

  const px = ((point.x - xMin) / (xMax - xMin)) * w;
  const py = h - ((point.y - yMin) / (yMax - yMin)) * h;

  const scale = 0.3;
  const vxLen = (point.vx / (xMax - xMin)) * w * scale;
  const vyLen = -(point.vy / (yMax - yMin)) * h * scale;
  const speed = Math.sqrt(point.vx ** 2 + point.vy ** 2);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      <defs>
        <marker id="arrowVx" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="hsl(200 80% 60%)" />
        </marker>
        <marker id="arrowVy" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="hsl(340 80% 60%)" />
        </marker>
        <marker id="arrowV" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="hsl(50 90% 60%)" />
        </marker>
      </defs>

      {/* Vx - horizontal */}
      <line
        x1={`${px}%`} y1={`${py}%`}
        x2={`${px + vxLen}%`} y2={`${py}%`}
        stroke="hsl(200 80% 60%)" strokeWidth="0.4"
        markerEnd="url(#arrowVx)"
        vectorEffect="non-scaling-stroke"
      />

      {/* Vy - vertical */}
      <line
        x1={`${px}%`} y1={`${py}%`}
        x2={`${px}%`} y2={`${py + vyLen}%`}
        stroke="hsl(340 80% 60%)" strokeWidth="0.4"
        markerEnd="url(#arrowVy)"
        vectorEffect="non-scaling-stroke"
      />

      {/* V - resultant */}
      <line
        x1={`${px}%`} y1={`${py}%`}
        x2={`${px + vxLen}%`} y2={`${py + vyLen}%`}
        stroke="hsl(50 90% 60%)" strokeWidth="0.5"
        markerEnd="url(#arrowV)"
        vectorEffect="non-scaling-stroke"
      />

      {/* Labels */}
      <text x={`${px + vxLen / 2}%`} y={`${py + 3}%`} fill="hsl(200 80% 60%)" fontSize="2.5" textAnchor="middle" fontFamily="monospace">
        Vx={point.vx.toFixed(1)}
      </text>
      <text x={`${px + 4}%`} y={`${py + vyLen / 2}%`} fill="hsl(340 80% 60%)" fontSize="2.5" textAnchor="start" fontFamily="monospace">
        Vy={point.vy.toFixed(1)}
      </text>
      <text x={`${px + vxLen / 2 + 2}%`} y={`${py + vyLen / 2 - 1}%`} fill="hsl(50 90% 60%)" fontSize="2.5" textAnchor="start" fontFamily="monospace">
        V={speed.toFixed(1)}
      </text>
    </svg>
  );
};

export default VectorOverlay;
