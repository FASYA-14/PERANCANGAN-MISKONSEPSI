import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

interface DerivativeCurve {
  id: string;
  name: string;
  formula: string;
  derivativeFormula: string;
  evalF: (x: number) => number;
  evalDF: (x: number) => number | null;
  defaultC: number;
  minC: number;
  maxC: number;
  stepC: number;
  description: string;
}

const DERIVATIVE_CURVES: DerivativeCurve[] = [
  {
    id: 'quadratic',
    name: 'Fungsi Kuadrat: f(x) = x² - 4x + 3',
    formula: 'f(x) = x² - 4x + 3',
    derivativeFormula: 'f\'(x) = 2x - 4',
    evalF: (x) => x * x - 4 * x + 3,
    evalDF: (x) => 2 * x - 4,
    defaultC: 1,
    minC: -1,
    maxC: 5,
    stepC: 0.1,
    description: 'Parabola terbuka ke atas. Pada x = 1 (akar fungsi), nilai f(1) = 0 namun garis singgung memiliki kemiringan f\'(1) = -2.'
  },
  {
    id: 'cubic',
    name: 'Fungsi Kubik: f(x) = x³ - 3x',
    formula: 'f(x) = x³ - 3x',
    derivativeFormula: 'f\'(x) = 3x² - 3',
    evalF: (x) => Math.pow(x, 3) - 3 * x,
    evalDF: (x) => 3 * x * x - 3,
    defaultC: 0,
    minC: -2.5,
    maxC: 2.5,
    stepC: 0.1,
    description: 'Fungsi kubik dengan titik stasioner f\'(x) = 0 di x = -1 dan x = 1. Di titik belok x = 0, garis singgung memotong kurva.'
  },
  {
    id: 'absolute',
    name: 'Nilai Mutlak: f(x) = |x| (Titik Sudut)',
    formula: 'f(x) = |x|',
    derivativeFormula: 'f\'(x) = -1 (x < 0)  |  +1 (x > 0)  |  Tak Ada di x = 0',
    evalF: (x) => Math.abs(x),
    evalDF: (x) => {
      if (Math.abs(x) < 0.05) return null;
      return x > 0 ? 1 : -1;
    },
    defaultC: 0,
    minC: -3,
    maxC: 3,
    stepC: 0.1,
    description: 'Grafik kontinu di seluruh ℝ tetapi memiliki titik sudut tajam (corner) di (0,0) sehingga limit turunan tidak ada.'
  }
];

export const DerivativeVisualizer: React.FC = () => {
  const [selectedCurveId, setSelectedCurveId] = useState<string>('quadratic');
  const activeCurve = DERIVATIVE_CURVES.find((c) => c.id === selectedCurveId) || DERIVATIVE_CURVES[0];
  const [pointC, setPointC] = useState<number>(activeCurve.defaultC);
  const [showSecant, setShowSecant] = useState<boolean>(false);
  const [deltaH, setDeltaH] = useState<number>(1.0);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setPointC(activeCurve.defaultC);
  }, [selectedCurveId]);

  const fVal = activeCurve.evalF(pointC);
  const dfVal = activeCurve.evalDF(pointC);
  const isDifferentiable = dfVal !== null;

  // Secant calculations
  const secantX2 = pointC + deltaH;
  const secantY2 = activeCurve.evalF(secantX2);
  const secantSlope = (secantY2 - fVal) / deltaH;

  // High-DPI Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = 600;
    const logicalHeight = 440;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    ctx.scale(dpr, dpr);

    const originX = logicalWidth / 2;
    const originY = logicalHeight / 2;
    const scale = 36; // 36px per math unit

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

    for (let i = -7; i <= 7; i++) {
      if (i === 0) continue;
      const px = originX + i * scale;
      if (px > 20 && px < logicalWidth - 20) {
        ctx.fillText(i.toString(), px, originY + 14);
      }
      const py = originY - i * scale;
      if (py > 20 && py < logicalHeight - 20) {
        ctx.fillText(i.toString(), originX - 12, py + 4);
      }
    }

    // 3. Curve f(x)
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let started = false;
    const step = 0.04;
    for (let x = -8; x <= 8; x += step) {
      const y = activeCurve.evalF(x);
      const px = originX + x * scale;
      const py = originY - y * scale;

      if (py >= -150 && py <= logicalHeight + 150) {
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();

    const pointPx = originX + pointC * scale;
    const pointPy = originY - fVal * scale;

    // 4. Tangent Line (if differentiable)
    if (isDifferentiable) {
      const slope = dfVal;
      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const tMinX = pointC - 4;
      const tMaxX = pointC + 4;
      const tMinY = slope * (tMinX - pointC) + fVal;
      const tMaxY = slope * (tMaxX - pointC) + fVal;

      ctx.moveTo(originX + tMinX * scale, originY - tMinY * scale);
      ctx.lineTo(originX + tMaxX * scale, originY - tMaxY * scale);
      ctx.stroke();
      ctx.restore();

      // Slope triangle
      if (Math.abs(slope) > 0.1) {
        const dx = 1;
        const dy = slope * dx;
        const p1x = pointPx;
        const p1y = pointPy;
        const p2x = originX + (pointC + dx) * scale;
        const p2y = pointPy;
        const p3y = originY - (fVal + dy) * scale;

        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.lineTo(p2x, p3y);
        ctx.stroke();

        ctx.fillStyle = '#b45309';
        ctx.font = '10px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('Δx = 1', (p1x + p2x) / 2, p1y + 12);
        ctx.fillText(`m = ${slope.toFixed(2)}`, p2x + 16, (p2y + p3y) / 2);
        ctx.restore();
      }
    }

    // 5. Secant Line (if enabled)
    if (showSecant && isDifferentiable) {
      const p2x = originX + secantX2 * scale;
      const p2y = originY - secantY2 * scale;

      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.75;
      ctx.beginPath();

      const sMinX = pointC - 3;
      const sMaxX = secantX2 + 3;
      const sMinY = secantSlope * (sMinX - pointC) + fVal;
      const sMaxY = secantSlope * (sMaxX - pointC) + fVal;

      ctx.moveTo(originX + sMinX * scale, originY - sMinY * scale);
      ctx.lineTo(originX + sMaxX * scale, originY - sMaxY * scale);
      ctx.stroke();
      ctx.restore();

      // Secant point Q
      ctx.beginPath();
      ctx.arc(p2x, p2y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#065f46';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillText(`Q(${secantX2.toFixed(1)}, ${secantY2.toFixed(1)})`, p2x + 8, p2y - 6);
    }

    // 6. Point of Tangency P(c, f(c))
    ctx.beginPath();
    ctx.arc(pointPx, pointPy, 6, 0, Math.PI * 2);
    ctx.fillStyle = isDifferentiable ? '#4f46e5' : '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillText(`P(${pointC.toFixed(1)}, ${fVal.toFixed(2)})`, pointPx + 10, pointPy - 8);

    // Guide lines to axes
    ctx.save();
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(pointPx, pointPy);
    ctx.lineTo(pointPx, originY);
    ctx.moveTo(pointPx, pointPy);
    ctx.lineTo(originX, pointPy);
    ctx.stroke();
    ctx.restore();

    // 7. Crosshair on hover
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
  }, [activeCurve, pointC, fVal, dfVal, isDifferentiable, showSecant, deltaH, secantX2, secantY2, secantSlope, hoverCoord]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;

    const logicalWidth = 600;
    const logicalHeight = 440;
    const originX = logicalWidth / 2;
    const originY = logicalHeight / 2;
    const scale = 36;

    const normX = (xPx * (logicalWidth / rect.width) - originX) / scale;
    const normY = (originY - yPx * (logicalHeight / rect.height)) / scale;

    setHoverCoord({ x: parseFloat(normX.toFixed(2)), y: parseFloat(normY.toFixed(2)) });
  }, []);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
              Laboratorium Kalkulus & Geometri Diferensial
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Makna Geometris Turunan f'(a) & Garis Singgung
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Membedakan antara nilai fungsi f(a) (ketinggian posisi titik) dengan nilai turunan f'(a) (kemiringan sesaat garis singgung), 
              serta mengamati transisi garis sekan limit h → 0.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSecant(!showSecant)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                showSecant
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {showSecant ? 'Garis Sekan Aktif' : 'Tampilkan Garis Sekan (h → 0)'}
            </button>
            <button
              onClick={() => {
                setPointC(activeCurve.defaultC);
                setDeltaH(1.0);
              }}
              className="p-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors active:scale-98"
              title="Reset Titik"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Viewport (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-3 pb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-800 font-mono">{activeCurve.name}</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-blue-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                f(x)
              </span>
              <span className="flex items-center gap-1.5 text-rose-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                Garis Singgung (f')
              </span>
              {showSecant && (
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  Garis Sekan
                </span>
              )}
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white relative flex justify-center">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverCoord(null)}
              className="w-full max-w-[600px] h-auto cursor-crosshair select-none"
            />
          </div>

          {/* Precision Controls */}
          <div className="w-full mt-4 space-y-3 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="point-c-slider" className="font-medium text-slate-700">
                  Titik Singgung (x = a):
                </label>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-slate-500">a =</span>
                  <input
                    type="number"
                    min={activeCurve.minC}
                    max={activeCurve.maxC}
                    step={activeCurve.stepC}
                    value={parseFloat(pointC.toFixed(2))}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) {
                        setPointC(Math.max(activeCurve.minC, Math.min(activeCurve.maxC, val)));
                      }
                    }}
                    className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-right font-bold text-indigo-700 focus:outline-none"
                  />
                </div>
              </div>
              <input
                id="point-c-slider"
                type="range"
                min={activeCurve.minC}
                max={activeCurve.maxC}
                step={activeCurve.stepC}
                value={pointC}
                onChange={(e) => setPointC(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>x = {activeCurve.minC}</span>
                <span>x = {((activeCurve.minC + activeCurve.maxC) / 2).toFixed(1)}</span>
                <span>x = {activeCurve.maxC}</span>
              </div>
            </div>

            {/* Secant step slider */}
            {showSecant && isDifferentiable && (
              <div className="space-y-1 pt-2 border-t border-slate-100 bg-emerald-50/40 p-3 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="delta-h-slider" className="font-medium text-emerald-900">
                    Selang Inkrementasi (h = Δx):
                  </label>
                  <span className="font-mono text-emerald-800 font-bold text-xs">
                    h = {deltaH.toFixed(2)}  (Kemiringan Sekan = {secantSlope.toFixed(2)})
                  </span>
                </div>
                <input
                  id="delta-h-slider"
                  type="range"
                  min="0.05"
                  max="2.5"
                  step="0.05"
                  value={deltaH}
                  onChange={(e) => setDeltaH(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-emerald-200 rounded-lg cursor-pointer accent-emerald-600"
                />
                <div className="text-[11px] text-emerald-700 font-mono">
                  Limit gradien: lim[h→0] (f(a+h) - f(a))/h = {dfVal !== null ? dfVal.toFixed(2) : '-'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analytical Readout Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Curve Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
              Pilih Fungsi Turunan:
            </h3>
            <div className="space-y-2">
              {DERIVATIVE_CURVES.map((curve) => {
                const isSelected = selectedCurveId === curve.id;
                return (
                  <button
                    key={curve.id}
                    onClick={() => setSelectedCurveId(curve.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">{curve.name}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {curve.derivativeFormula}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mathematical Metric Readout */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
              Komparasi Ketinggian Posisi vs Kemiringan Garis Singgung:
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Function Height */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-center">
                <div className="text-[10px] text-blue-700 uppercase font-semibold">
                  Posisi Ketinggian f(a)
                </div>
                <div className="text-lg font-mono font-bold text-blue-950 mt-1">
                  f({pointC.toFixed(1)}) = {fVal.toFixed(2)}
                </div>
                <div className="text-[11px] text-blue-800 mt-0.5 font-mono">
                  Titik ({pointC.toFixed(1)}, {fVal.toFixed(2)})
                </div>
              </div>

              {/* Tangent Slope */}
              <div
                className={`border rounded-xl p-3.5 text-center ${
                  isDifferentiable
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : 'bg-amber-50/70 border-amber-300 text-amber-950'
                }`}
              >
                <div className="text-[10px] uppercase font-semibold">
                  {isDifferentiable ? 'Kemiringan Garis Singgung f\'(a)' : 'Status Keterdiferensialan'}
                </div>
                <div className="text-lg font-mono font-bold mt-1">
                  {isDifferentiable ? `f'(${pointC.toFixed(1)}) = ${dfVal.toFixed(2)}` : 'Tidak Ada'}
                </div>
                <div className="text-[11px] mt-0.5">
                  {isDifferentiable
                    ? dfVal > 0
                      ? 'Kurva sedang NAIK'
                      : dfVal < 0
                      ? 'Kurva sedang TURUN'
                      : 'Mendatar (Stasioner)'
                    : 'Titik Sudut Tajam'}
                </div>
              </div>
            </div>

            {/* Non-differentiability alert */}
            {!isDifferentiable && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-950 space-y-1">
                <div className="font-bold text-rose-900">
                  Keterdiferensialan Gagal di x = 0:
                </div>
                <p className="leading-relaxed text-[11px] text-rose-800">
                  Fungsi f(x) = |x| kontinu di x = 0, tetapi turunan kiri (-1) tidak sama dengan turunan kanan (+1). 
                  Karena limit turunan sepihak berbeda, tidak ada satu garis singgung tunggal yang terdefinisi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
