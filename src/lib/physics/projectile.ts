export interface ProjectileParams {
  v0: number;
  angle: number;
  h0: number;
  airResistance: boolean;
  dragCoeff?: number;
  gravity?: number;
}

export interface TrajectoryPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
}

export interface ProjectileResult {
  maxHeight: number;
  range: number;
  totalTime: number;
  trajectory: TrajectoryPoint[];
  trajectoryAir?: TrajectoryPoint[];
}

export function simulate(params: ProjectileParams): ProjectileResult {
  const { v0, angle, h0, airResistance, gravity } = params;
  const G = gravity ?? 9.8;
  const rad = (angle * Math.PI) / 180;
  const v0x = v0 * Math.cos(rad);
  const v0y = v0 * Math.sin(rad);

  const discriminant = v0y * v0y + 2 * G * h0;
  const totalTime = discriminant >= 0 ? (v0y + Math.sqrt(discriminant)) / G : 0;

  const maxHeight = h0 + (v0y * v0y) / (2 * G);
  const range = v0x * totalTime;

  const steps = 200;
  const dt = totalTime / steps;
  const trajectory: TrajectoryPoint[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    const x = v0x * t;
    const y = h0 + v0y * t - 0.5 * G * t * t;
    const vy = v0y - G * t;
    if (y < 0 && i > 0) {
      trajectory.push({ x, y: 0, vx: v0x, vy, t });
      break;
    }
    trajectory.push({ x, y: Math.max(0, y), vx: v0x, vy, t });
  }

  let trajectoryAir: TrajectoryPoint[] | undefined;
  if (airResistance) {
    const k = params.dragCoeff ?? 0.05;
    trajectoryAir = [];
    let x = 0, y = h0, vx = v0x, vy = v0y;
    const dtAir = 0.01;
    let t = 0;

    for (let i = 0; i < 50000; i++) {
      trajectoryAir.push({ x, y, vx, vy, t });
      const speed = Math.sqrt(vx * vx + vy * vy);
      const ax = -k * speed * vx;
      const ay = -G - k * speed * vy;
      vx += ax * dtAir;
      vy += ay * dtAir;
      x += vx * dtAir;
      y += vy * dtAir;
      t += dtAir;
      if (y <= 0) {
        trajectoryAir.push({ x, y: 0, vx, vy, t });
        break;
      }
    }
    if (trajectoryAir.length > 200) {
      const step = Math.floor(trajectoryAir.length / 200);
      trajectoryAir = trajectoryAir.filter((_, i) => i % step === 0 || i === trajectoryAir!.length - 1);
    }
  }

  return { maxHeight, range, totalTime, trajectory, trajectoryAir };
}
