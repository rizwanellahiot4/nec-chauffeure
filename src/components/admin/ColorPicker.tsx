import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

/* ---- colour-space helpers ---- */

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return [Math.round(h * 10) / 10, Math.round(s * 1000) / 10, Math.round(l * 1000) / 10];
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

/** Parse our stored HSL string "222.2 47.4% 11.2%" → [h, s, l] */
function parseHslString(hsl: string): [number, number, number] {
  const parts = hsl.replace(/%/g, '').trim().split(/\s+/).map(Number);
  if (parts.length >= 3 && parts.every(n => !isNaN(n))) return [parts[0], parts[1], parts[2]];
  return [0, 0, 50];
}

function toHslString(h: number, s: number, l: number) {
  return `${h} ${s}% ${l}%`;
}

/* ---- component ---- */

interface ColorPickerProps {
  label: string;
  description: string;
  value: string; // HSL string
  onChange: (hsl: string) => void;
}

const ColorPicker = ({ label, description, value, onChange }: ColorPickerProps) => {
  const [h, s, l] = parseHslString(value);
  const [r, g, b] = hslToRgb(h, s, l);
  const hex = rgbToHex(r, g, b);

  const handleHexChange = useCallback((newHex: string) => {
    const rgb = hexToRgb(newHex);
    if (!rgb) return;
    const [nh, ns, nl] = rgbToHsl(...rgb);
    onChange(toHslString(nh, ns, nl));
  }, [onChange]);

  const handleRgbChange = useCallback((channel: 'r' | 'g' | 'b', val: number) => {
    const clamped = Math.max(0, Math.min(255, val || 0));
    const newRgb: [number, number, number] = [r, g, b];
    if (channel === 'r') newRgb[0] = clamped;
    if (channel === 'g') newRgb[1] = clamped;
    if (channel === 'b') newRgb[2] = clamped;
    const [nh, ns, nl] = rgbToHsl(...newRgb);
    onChange(toHslString(nh, ns, nl));
  }, [r, g, b, onChange]);

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium block">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 w-full rounded-lg border border-input bg-background px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
          >
            <div
              className="w-9 h-9 rounded-md border border-border shrink-0 shadow-sm"
              style={{ backgroundColor: `hsl(${value})` }}
            />
            <div className="min-w-0">
              <span className="text-sm font-mono block truncate">{hex.toUpperCase()}</span>
              <span className="text-xs text-muted-foreground">R:{r} G:{g} B:{b}</span>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4 space-y-4" align="start">
          {/* Native color input as visual picker */}
          <div className="flex flex-col items-center gap-2">
            <input
              type="color"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              className="w-full h-32 rounded-lg cursor-pointer border-0 p-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-border [&::-webkit-color-swatch]:border [&::-moz-color-swatch]:rounded-lg [&::-moz-color-swatch]:border-border [&::-moz-color-swatch]:border"
            />
          </div>

          {/* Hex input */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">HEX</label>
            <Input
              value={hex.toUpperCase()}
              onChange={(e) => handleHexChange(e.target.value)}
              className="font-mono text-sm h-9"
              maxLength={7}
            />
          </div>

          {/* RGB inputs */}
          <div className="grid grid-cols-3 gap-2">
            {([['R', r, 'r'], ['G', g, 'g'], ['B', b, 'b']] as const).map(([ch, val, key]) => (
              <div key={ch}>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{ch}</label>
                <Input
                  type="number"
                  min={0}
                  max={255}
                  value={val}
                  onChange={(e) => handleRgbChange(key, parseInt(e.target.value))}
                  className="font-mono text-sm h-9"
                />
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="flex items-center gap-2 pt-1 border-t border-border">
            <div className="w-6 h-6 rounded border border-border" style={{ backgroundColor: `hsl(${value})` }} />
            <span className="text-xs text-muted-foreground font-mono">{value}</span>
          </div>
        </PopoverContent>
      </Popover>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

export default ColorPicker;
