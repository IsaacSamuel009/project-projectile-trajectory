import { useState, useMemo } from "react";
import { simulate } from "@/lib/projectile";
import ControlPanel from "@/components/ControlPanel";
import TrajectoryChart from "@/components/TrajectoryChart";
import ResultStats from "@/components/ResultStats";
import { Target } from "lucide-react";

const Index = () => {
  const [v0, setV0] = useState(30);
  const [angle, setAngle] = useState(45);
  const [h0, setH0] = useState(0);
  const [airResistance, setAirResistance] = useState(false);
  const [dragCoeff, setDragCoeff] = useState(0.05);

  const result = useMemo(
    () => simulate({ v0, angle, h0, airResistance, dragCoeff }),
    [v0, angle, h0, airResistance, dragCoeff]
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center gap-3 pb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center glow-primary">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Simulador de Lançamento Oblíquo
            </h1>
            <p className="text-sm text-muted-foreground">
              Movimento de projétil com análise em tempo real
            </p>
          </div>
        </header>

        {/* Stats */}
        <ResultStats result={result} />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <ControlPanel
            v0={v0}
            angle={angle}
            h0={h0}
            airResistance={airResistance}
            dragCoeff={dragCoeff}
            onV0Change={setV0}
            onAngleChange={setAngle}
            onH0Change={setH0}
            onAirResistanceChange={setAirResistance}
            onDragCoeffChange={setDragCoeff}
          />
          <TrajectoryChart result={result} showAir={airResistance} />
        </div>

        {/* Equations info */}
        <div className="glass-panel p-5 text-sm text-muted-foreground font-mono space-y-1">
          <p>x(t) = v₀·cos(θ)·t</p>
          <p>y(t) = h₀ + v₀·sin(θ)·t − ½·g·t²</p>
          <p className="text-xs mt-2">g = 9,8 m/s²</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
