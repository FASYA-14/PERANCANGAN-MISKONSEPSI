import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Preset {
  name: string;
  expression: string;
  evaluator: (x: number) => number | null;
}

const PRESETS: Preset[] = [
  { name: 'Linear: 2x + 1 (U-01)', expression: '2x + 1', evaluator: (x) => 2 * x + 1 },
  { name: 'Kuadrat: x² (U-02)', expression: 'x²', evaluator: (x) => x * x },
  { name: 'Kuadrat Tergeser: (x - 3)² + 2', expression: '(x - 3)² + 2', evaluator: (x) => Math.pow(x - 3, 2) + 2 },
  { name: 'Rasional: 4 / (x - 3)', expression: '4 / (x - 3)', evaluator: (x) => Math.abs(x - 3) < 0.08 ? null : 4 / (x - 3) },
  { name: 'Akar: √(x - 2)', expression: '√(x - 2)', evaluator: (x) => x < 2 ? null : Math.sqrt(x - 2) },
  { name: 'Nilai Mutlak: |x - 1| - 2', expression: '|x - 1| - 2', evaluator: (x) => Math.abs(x - 1) - 2 }
];

export const FunctionSandbox: React.FC = () => {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);
  const [scale, setScale] = useState<number>(36);
  const [probeX, setProbeX] = useState<number>(1.0);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activePreset = PRESETS[selectedPresetIdx];

  const evaluateActive = (x: number): number | null => {
    try {
      return activePreset.evaluator(x);
    } catch {
      return null;
    }
  };

  const probeY = evaluateActive(probeX);

  // High-DPI Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = 640;
    const logicalHeight = 440;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    ctx.scale(dpr, dpr);

    const originX = logicalWidth / 2;
    const originY = logicalHeight / 2;

    ctx.clearRect(0, 0, logicalWidth, logicalHeight);

    // 1. Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = originX % scale; x < logicalWidth; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, logicalHeight);
      ctx.stroke();
    }
    for (let y = originY % scale; y < logicalHeight; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(logicalWidth, y);
      ctx.stroke();
    }

    // 2. Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.25;

    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(logicalWidth, originY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, logicalHeight);
    ctx.stroke();

    // Axis markings
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';

    const maxUnits = Math.ceil(logicalWidth / (2 * scale));
    for (let i = -maxUnits; i <= maxUnits; i++) {
      if (i === 0) continue;
      const px = originX + i * scale;
      if (px > 10 && px < logicalWidth - 10) {
        ctx.fillText(i.toString(), px, originY + 14);
      }
      const py = originY - i * scale;
      if (py > 10 && py < logicalHeight - 10) {
        ctx.fillText(i.toString(), originX - 12, py + 4);
      }
    }

    // 3. Draw Function Curve
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let started = false;
    const step = 0.04;
    const minX = -logicalWidth / (2 * scale);
    const maxX = logicalWidth / (2 * scale);

    for (let x = minX; x <= maxX; x += step) {
      if (activePreset.expression.includes('4 / (x - 3)') && Math.abs(x - 3) < 0.15) {
        started = false;
        continue;
      }
      const y = evaluateActive(x);
      if (y !== null && !isNaN(y)) {
        const px = originX + x * scale;
        const py = originY - y * scale;
        if (py >= -150 && py <= logicalHeight + 150) {
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          started = false;
        }
      } else {
        started = false;
      }
    }
    ctx.stroke();

    // 4. Draw Probe Point
    if (probeY !== null && !isNaN(probeY)) {
      const px = originX + probeX * scale;
      const py = originY - probeY * scale;

      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, originY);
      ctx.stroke();

      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(originX, py);
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillText(`(${probeX.toFixed(1)}, ${probeY.toFixed(2)})`, px + 10, py - 6);
    }

    // 5. Crosshair on hover
    if (hoverCoord) {
      const hpx = originX + hoverCoord.x * scale;
      const hpy = originY - hoverCoord.y * scale;

      ctx.save();
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hpx, 0);
      ctx.lineTo(hpx, logicalHeight);
      ctx.moveTo(0, hpy);
      ctx.lineTo(logicalWidth, hpy);
      ctx.stroke();
      ctx.restore();
    }
  }, [selectedPresetIdx, scale, probeX, hoverCoord]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;

    const logicalWidth = 640;
    const logicalHeight = 440;
    const originX = logicalWidth / 2;
    const originY = logicalHeight / 2;

    const normX = (xPx * (logicalWidth / rect.width) - originX) / scale;
    const normY = (originY - yPx * (logicalHeight / rect.height)) / scale;

    setHoverCoord({ x: parseFloat(normX.toFixed(2)), y: parseFloat(normY.toFixed(2)) });
  }, [scale]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
            Laboratorium Eksplorasi Fungsi Matematika
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            Kalkulator Grafik & Titik Koordinat Bebas
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Uji kurva fungsi matematika apa pun dengan penelusuran titik kontinu dan kontrol skala kanvas presisi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.min(s + 6, 60))}
            className="p-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors active:scale-98"
            title="Perbesar Skala (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s - 6, 20))}
            className="p-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors active:scale-98"
            title="Perkecil Skala (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setScale(36);
              setProbeX(1.0);
            }}
            className="p-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors active:scale-98"
            title="Reset Tampilan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-3 pb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-800 font-mono">
              f(x) = {activePreset.expression}
            </span>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span>Skala: {scale}px/unit</span>
              {hoverCoord && (
                <span className="text-slate-400">
                  Kursor: ({hoverCoord.x}, {hoverCoord.y})
                </span>
              )}
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white relative flex justify-center">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverCoord(null)}
              className="w-full max-w-[640px] h-auto cursor-crosshair select-none"
            />
          </div>

          {/* Tracer Slider & Number Input */}
          <div className="w-full mt-4 space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="tracer-slider" className="font-medium text-slate-700">
                Titik Penelusur Koordinat:
              </label>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-500">x =</span>
                <input
                  type="number"
                  min="-6"
                  max="6"
                  step="0.1"
                  value={parseFloat(probeX.toFixed(2))}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      setProbeX(Math.max(-6, Math.min(6, val)));
                    }
                  }}
                  className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-right font-bold text-indigo-700 focus:outline-none"
                />
              </div>
            </div>
            <input
              id="tracer-slider"
              type="range"
              min="-6"
              max="6"
              step="0.1"
              value={probeX}
              onChange={(e) => setProbeX(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Preset Selector & Readout (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
              Koleksi Model Preset:
            </h3>

            <div className="space-y-2">
              {PRESETS.map((preset, idx) => {
                const isSelected = selectedPresetIdx === idx;
                return (
                  <button
                    key={preset.name}
                    onClick={() => setSelectedPresetIdx(idx)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="font-medium text-slate-900">{preset.name}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                      f(x) = {preset.expression}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coordinate Readout */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs space-y-2 text-xs">
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              Inspeksi Nilai Koordinat:
            </div>
            <div className="font-mono space-y-1.5 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Masukan x:</span>
                <span className="text-blue-400 font-bold">{probeX.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Keluaran f(x):</span>
                <span className="text-emerald-400 font-bold">{probeY !== null ? probeY.toFixed(2) : 'Tak Terdefinisi'}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Pasangan Titik:</span>
                <span className="text-amber-400 font-bold">({probeX.toFixed(1)}, {probeY !== null ? probeY.toFixed(2) : 'ø'})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
