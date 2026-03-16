import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';

interface NumberStepperProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const NumberStepper = ({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  helperText,
}: NumberStepperProps) => {
  const updateValue = (nextValue: number) => onChange(clamp(nextValue, min, max));

  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-11 w-11"
          onClick={() => updateValue(value - step)}
          disabled={value <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => updateValue(Number(event.target.value) || 0)}
          className="h-11 text-center bg-card"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-11 w-11"
          onClick={() => updateValue(value + step)}
          disabled={value >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {helperText ? <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p> : null}
    </div>
  );
};

export default NumberStepper;
