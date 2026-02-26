const G = 9.8;

export interface ProjectileParams {
  v0: number;       // m/s
  angle: number;    // degrees
  h0: number;       // m
  airResistance: boolean;
  dragCoeff?: number; // simplified drag coefficient
}

export interface ProjectileResult {
  maxHeight: number;
  range: number;
  totalTime: number;
  trajectory: { x: number; y: number }[];
  trajectoryAir?: { x: number; y: number }[];
}

export function simulate(params: ProjectileParams): ProjectileResult {
  const { v0, angle, h0, airResistance } = params;
  const rad = (angle * Math.PI) / 180;
  const v0x = v0 * Math.cos(rad);
  const v0y = v0 * Math.sin(rad);

  // Time when projectile hits ground: h0 + v0y*t - 0.5*g*t^2 = 0
  const discriminant = v0y * v0y + 2 * G * h0;
  const totalTime = discriminant >= 0 ? (v0y + Math.sqrt(discriminant)) / G : 0;

  const maxHeight = h0 + (v0y * v0y) / (2 * G);
  const range = v0x * totalTime;

  // Generate trajectory points (no air resistance)
  const steps = 200;
  const dt = totalTime / steps;
  const trajectory: { x: number; y: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    const x = v0x * t;
    const y = h0 + v0y * t - 0.5 * G * t * t;
    if (y < 0 && i > 0) {
      trajectory.push({ x, y: 0 });
      break;
    }
    trajectory.push({ x, y: Math.max(0, y) });
  }

  // Air resistance simulation (Euler method)
  let trajectoryAir: { x: number; y: number }[] | undefined;
  if (airResistance) {
    const k = params.dragCoeff ?? 0.05; // simplified drag
    trajectoryAir = [];
    let x = 0, y = h0, vx = v0x, vy = v0y;
    const dtAir = 0.01;
    
    for (let i = 0; i < 50000; i++) {
      trajectoryAir.push({ x, y });
      const speed = Math.sqrt(vx * vx + vy * vy);
      const ax = -k * speed * vx;
      const ay = -G - k * speed * vy;
      vx += ax * dtAir;
      vy += ay * dtAir;
      x += vx * dtAir;
      y += vy * dtAir;
      if (y <= 0) {
        trajectoryAir.push({ x, y: 0 });
        break;
      }
    }
    // Downsample for performance
    if (trajectoryAir.length > 200) {
      const step = Math.floor(trajectoryAir.length / 200);
      trajectoryAir = trajectoryAir.filter((_, i) => i % step === 0 || i === trajectoryAir!.length - 1);
    }
  }

  return { maxHeight, range, totalTime, trajectory, trajectoryAir };
}
