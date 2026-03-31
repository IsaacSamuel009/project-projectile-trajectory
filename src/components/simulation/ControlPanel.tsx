import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Rocket } from "lucide-react";

interface Props {
  v0: number;
  angle: number;
  h0: number;
  airResistance: boolean;
  dragCoeff: number;
  onV0Change: (v: number) => void;
  onAngleChange: (a: number) => void;
  onH0Change: (h: number) => void;
  onAirResistanceChange: (v: boolean) => void;
  onDragCoeffChange: (d: number) => void;
}

const SliderControl = ({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) => (
  <div className="space-y-3">
    <div className="flex justify-between items-baseline">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <span className="font-mono text-sm text-foreground">
        {value.toFixed(step < 1 ? 2 : 0)}
        <span className="text-muted-foreground ml-1">{unit}</span>
      </span>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={([v]) => onChange(v)}
      className="py-1"
    />
  </div>
);

const ControlPanel = ({
  v0,
  angle,
  h0,
  airResistance,
  dragCoeff,
  onV0Change,
  onAngleChange,
  onH0Change,
  onAirResistanceChange,
  onDragCoeffChange,
}: Props) => (
  <div className="glass-panel p-5 md:p-6 space-y-6">
    <div className="flex items-center gap-2">
      <Rocket className="w-4 h-4 text-primary" />
      <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
        Parâmetros
      </h2>
    </div>

    <SliderControl
      label="Velocidade Inicial (v₀)"
      value={v0}
      min={1}
      max={100}
      step={1}
      unit="m/s"
      onChange={onV0Change}
    />

    <SliderControl
      label="Ângulo de Lançamento (θ)"
      value={angle}
      min={1}
      max={89}
      step={1}
      unit="°"
      onChange={onAngleChange}
    />

    <SliderControl
      label="Altura Inicial (h₀)"
      value={h0}
      min={0}
      max={50}
      step={0.5}
      unit="m"
      onChange={onH0Change}
    />

    <div className="border-t border-border pt-5 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-muted-foreground">
          Resistência do Ar
        </Label>
        <Switch
          checked={airResistance}
          onCheckedChange={onAirResistanceChange}
        />
      </div>

      {airResistance && (
        <SliderControl
          label="Coef. de Arrasto (k)"
          value={dragCoeff}
          min={0.01}
          max={0.2}
          step={0.01}
          unit=""
          onChange={onDragCoeffChange}
        />
      )}
    </div>
  </div>
);

export default ControlPanel;
