import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface DomainFunctionConfig {
  id: string;
  name: string;
  formula: string;
  domainInterval: string;
  rangeInterval: string;
  domainDescription: string;
  rangeDescription: string;
  compute: (x: number) => number | null;
  isValidInput: (x: number) => boolean;
  invalidReason?: string;
  defaultX: number;
  minX: number;
  maxX: number;
}

const FUNCTIONS: DomainFunctionConfig[] = [
  {
    id: 'rational',
    name: 'Fungsi Rasional: f(x) = 4 / (x - 3)',
    formula: 'f(x) = 4 / (x - 3)',
    domainInterval: '{x ∈ ℝ | x ≠ 3}  atau  (-∞, 3) ∪ (3, ∞)',
    rangeInterval: '{y ∈ ℝ | y ≠ 0}  atau  (-∞, 0) ∪ (0, ∞)',
    domainDescription: 'Domain mencakup seluruh sumbu horizontal kecuali x = 3 (penyebut menjadi 0).',
    rangeDescription: 'Range mencakup seluruh sumbu vertikal kecuali y = 0 (pembilang konstan 4 ≠ 0).',
    compute: (x) => {
      if (Math.abs(x - 3) < 0.08) return null;
      return 4 / (x - 3);
    },
    isValidInput: (x) => Math.abs(x - 3) >= 0.08,
    invalidReason: 'Pembagian oleh nol tidak terdefinisi pada bilangan real (x = 3 bukan anggota Domain).',
    defaultX: 5,
    minX: -4,
    maxX: 8
  },
  {
    id: 'sqrt',
    name: 'Fungsi Akar: f(x) = √(x - 2)',
    formula: 'f(x) = √(x - 2)',
    domainInterval: '{x ∈ ℝ | x ≥ 2}  atau  [2, ∞)',
    rangeInterval: '{y ∈ ℝ | y ≥ 0}  atau  [0, ∞)',
    domainDescription: 'Nilai di bawah lambang akar kuadrat harus non-negatif: x - 2 ≥ 0 ⟹ x ≥ 2.',
    rangeDescription: 'Hasil akar kuadrat real selalu non-negatif: y ≥ 0.',
    compute: (x) => {
      if (x < 2) return null;
      return Math.sqrt(x - 2);
    },
    isValidInput: (x) => x >= 2,
    invalidReason: 'Nilai di bawah akar negatif menghasilkan bilangan imajiner, bukan fungsi real.',
    defaultX: 6,
    minX: -2,
    maxX: 8
  },
  {
    id: 'parabola',
    name: 'Fungsi Kuadrat: f(x) = x² - 4',
    formula: 'f(x) = x² - 4',
    domainInterval: 'Seluruh Bilangan Real ℝ atau (-∞, ∞)',
    rangeInterval: '{y ∈ ℝ | y ≥ -4}  atau  [-4, ∞)',
    domainDescription: 'Polinomial menerima setiap masukan x real tanpa batasan.',
    rangeDescription: 'Karena x² ≥ 0, nilai minimum kurva adalah y = -4 (di titik puncak x = 0).',
    compute: (x) => x * x - 4,
    isValidInput: () => true,
    defaultX: 2,
    minX: -4,
    maxX: 4
  },
  {
    id: 'linear',
    name: 'Fungsi Linear: f(x) = 2x + 1',
    formula: 'f(x) = 2x + 1',
    domainInterval: 'Seluruh Bilangan Real ℝ atau (-∞, ∞)',
    rangeInterval: 'Seluruh Bilangan Real ℝ atau (-∞, ∞)',
    domainDescription: 'Garis lurus tak hingga mencakup seluruh garis sumbu-x.',
    rangeDescription: 'Garis lurus menjangkau seluruh nilai tinggi sumbu-y.',
    compute: (x) => 2 * x + 1,
    isValidInput: () => true,
    defaultX: 1.5,
    minX: -4,
    maxX: 4
  }
];

export const DomainRangeVisualizer: React.FC = () => {
  const [selectedFnId, setSelectedFnId] = useState<string>('rational');
  const activeFn = FUNCTIONS.find((f) => f.id === selectedFnId) || FUNCTIONS[0];
  const [probeX, setProbeX] = useState<number>(activeFn.defaultX);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setProbeX(activeFn.defaultX);
  }, [selectedFnId]);

  const outputY = activeFn.compute(probeX);
  const isProbeValid = activeFn.isValidInput(probeX);

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
    const scale = 34; // 34px per unit

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

    // 2. Highlight Domain on X-Axis (Blue ribbon)
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#3b82f6';
    if (activeFn.id === 'rational') {
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(originX + 3 * scale - 4, originY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(originX + 3 * scale + 4, originY);
      ctx.lineTo(logicalWidth, originY);
      ctx.stroke();

      // Hollow hole at x = 3
      ctx.beginPath();
      ctx.arc(originX + 3 * scale, originY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (activeFn.id === 'sqrt') {
      ctx.beginPath();
      ctx.moveTo(originX + 2 * scale, originY);
      ctx.lineTo(logicalWidth, originY);
      ctx.stroke();

      // Solid endpoint at x = 2
      ctx.beginPath();
      ctx.arc(originX + 2 * scale, originY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#2563eb';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(logicalWidth, originY);
      ctx.stroke();
    }

    // 3. Highlight Range on Y-Axis (Emerald ribbon)
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#10b981';
    if (activeFn.id === 'rational') {
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, originY - 4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(originX, originY + 4);
      ctx.lineTo(originX, logicalHeight);
      ctx.stroke();

      // Hollow hole at y = 0
      ctx.beginPath();
      ctx.arc(originX, originY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (activeFn.id === 'sqrt') {
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(originX, originY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#059669';
      ctx.fill();
    } else if (activeFn.id === 'parabola') {
      ctx.beginPath();
      ctx.moveTo(originX, originY - (-4) * scale);
      ctx.lineTo(originX, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(originX, originY + 4 * scale, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#059669';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, logicalHeight);
      ctx.stroke();
    }

    // 4. Coordinate Axes & Labels
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.25;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(logicalWidth, originY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, logicalHeight);
    ctx.stroke();

    // Ticks & Numbers
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';

    for (let i = -8; i <= 8; i++) {
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

    // 5. Draw Function Curve
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;

    const step = 0.04;
    for (let x = -9; x <= 9; x += step) {
      if (activeFn.id === 'rational' && Math.abs(x - 3) < 0.15) {
        started = false;
        continue;
      }
      const y = activeFn.compute(x);
      if (y !== null && !isNaN(y)) {
        const px = originX + x * scale;
        const py = originY - y * scale;
        if (py >= -100 && py <= logicalHeight + 100) {
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

    // 6. Draw Asymptote if Rational
    if (activeFn.id === 'rational') {
      const asympX = originX + 3 * scale;
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(asympX, 0);
      ctx.lineTo(asympX, logicalHeight);
      ctx.stroke();

      ctx.fillStyle = '#dc2626';
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Asimtot: x = 3', asympX + 6, 24);
      ctx.restore();
    }

    // 7. Draw Probe Point and Coordinate Projections
    if (isProbeValid && outputY !== null) {
      const px = originX + probeX * scale;
      const py = originY - outputY * scale;

      // Dotted projection to X-axis (Domain input)
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, originY);
      ctx.stroke();

      // Dotted projection to Y-axis (Range output)
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(originX, py);
      ctx.stroke();
      ctx.restore();

      // Node on curve
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Coordinate label
      ctx.fillStyle = '#0f172a';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillText(`(${probeX.toFixed(1)}, ${outputY.toFixed(2)})`, px + 10, py - 6);

      // Marker on X-axis (Domain)
      ctx.beginPath();
      ctx.arc(px, originY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#2563eb';
      ctx.fill();

      // Marker on Y-axis (Range)
      ctx.beginPath();
      ctx.arc(originX, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#059669';
      ctx.fill();
    }

    // 8. Crosshair
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
  }, [activeFn, probeX, outputY, isProbeValid, hoverCoord]);

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
    const scale = 34;

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
              Laboratorium Representasi Koordinat & Pemetaan
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Eksplorasi Daerah Asal (Domain) & Daerah Hasil (Range)
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Domain adalah proyeksi himpunan nilai masukan pada sumbu-x (horizontal), sedangkan Range adalah proyeksi himpunan nilai keluaran pada sumbu-y (vertikal). 
              Geser titik uji untuk mengamati bagaimana nilai masukan diproses oleh aturan fungsi.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas & Dynamic Slider Stage (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-3 pb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-800 font-mono">{activeFn.name}</span>
            <div className="flex items-center gap-4 text-[11px] font-medium">
              <span className="flex items-center gap-1.5 text-blue-700">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                Domain (Sumbu-X)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                Range (Sumbu-Y)
              </span>
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

          {/* Precision Probe Slider & Number Input */}
          <div className="w-full mt-4 space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="probe-slider" className="font-medium text-slate-700">
                Nilai Masukan Titik Uji (x ∈ Domain):
              </label>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-500">x =</span>
                <input
                  type="number"
                  min={activeFn.minX}
                  max={activeFn.maxX}
                  step="0.1"
                  value={parseFloat(probeX.toFixed(2))}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      setProbeX(Math.max(activeFn.minX, Math.min(activeFn.maxX, val)));
                    }
                  }}
                  className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-right font-bold text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <input
              id="probe-slider"
              type="range"
              min={activeFn.minX}
              max={activeFn.maxX}
              step="0.1"
              value={probeX}
              onChange={(e) => setProbeX(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>x = {activeFn.minX}</span>
              <span>x = {((activeFn.minX + activeFn.maxX) / 2).toFixed(1)}</span>
              <span>x = {activeFn.maxX}</span>
            </div>
          </div>
        </div>

        {/* Function Machine & Mathematical Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Function Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
              Pilih Model Fungsi:
            </h3>
            <div className="space-y-2">
              {FUNCTIONS.map((fn) => {
                const isSelected = selectedFnId === fn.id;
                return (
                  <button
                    key={fn.id}
                    onClick={() => setSelectedFnId(fn.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">{fn.name}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        Domain: {fn.domainInterval}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mathematical Pipeline (Function Machine) */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs space-y-3.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Alur Pemetaan Fungsi (Pipeline)</span>
              <span className="font-mono text-indigo-400 text-[11px]">{activeFn.formula}</span>
            </div>

            <div className="flex items-center justify-between gap-2 py-1 text-xs">
              {/* Input Box */}
              <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-center">
                <div className="text-[10px] text-slate-400 uppercase">Input x</div>
                <div className="text-base font-mono font-bold text-blue-400 mt-0.5">
                  {probeX.toFixed(1)}
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />

              {/* Machine Engine */}
              <div className="flex-1 bg-indigo-950 border border-indigo-700/60 rounded-lg p-2.5 text-center">
                <div className="text-[10px] text-indigo-300 uppercase">Aturan f</div>
                <div className="text-xs font-mono font-semibold text-indigo-200 mt-0.5 truncate">
                  {activeFn.id === 'rational' ? '4 / (x - 3)' : activeFn.id === 'sqrt' ? '√(x - 2)' : 'x² - 4'}
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />

              {/* Output Box */}
              <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-center">
                <div className="text-[10px] text-slate-400 uppercase">Output y</div>
                <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">
                  {isProbeValid && outputY !== null ? outputY.toFixed(2) : 'Tak Terdefinisi'}
                </div>
              </div>
            </div>

            {/* Validation Message */}
            {!isProbeValid ? (
              <div className="bg-rose-950/80 border border-rose-800 rounded-lg p-3 text-xs text-rose-200 flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Peringatan Domain:</strong> {activeFn.invalidReason}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-lg p-2.5 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Masukan valid: menghasilkan titik koordinat ({probeX.toFixed(1)}, {outputY !== null ? outputY.toFixed(2) : 'ø'}).</span>
              </div>
            )}
          </div>

          {/* Domain vs Range Precision Analysis Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 text-xs">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wide">
              Interval Formal Daerah Asal & Daerah Hasil:
            </h4>
            <div className="space-y-2 leading-relaxed">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-950">
                <div className="font-bold text-blue-900 mb-0.5">Daerah Asal (Domain Sumbu-X):</div>
                <div className="font-mono text-xs text-blue-800 mb-1">{activeFn.domainInterval}</div>
                <p className="text-slate-600 text-[11px]">{activeFn.domainDescription}</p>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-emerald-950">
                <div className="font-bold text-emerald-900 mb-0.5">Daerah Hasil (Range Sumbu-Y):</div>
                <div className="font-mono text-xs text-emerald-800 mb-1">{activeFn.rangeInterval}</div>
                <p className="text-slate-600 text-[11px]">{activeFn.rangeDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
