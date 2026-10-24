import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CurveOption {
  id: string;
  name: string;
  equation: string;
  isFunction: boolean;
  domain: [number, number];
  computeY: (x: number) => number[];
  description: string;
}

const CURVES: CurveOption[] = [
  {
    id: 'circle',
    name: 'Lingkaran (x² + y² = 25)',
    equation: 'x² + y² = 25',
    isFunction: false,
    domain: [-5, 5],
    computeY: (x) => {
      const val = 25 - x * x;
      if (val < -0.001) return [];
      if (Math.abs(val) < 0.001) return [0];
      const root = Math.sqrt(val);
      return [root, -root];
    },
    description: 'Relasi lingkaran jari-jari r = 5. Memotong garis vertikal di dua titik untuk setiap x ∈ (-5, 5).'
  },
  {
    id: 'horizontal_parabola',
    name: 'Parabola Horizontal (y² = 4x)',
    equation: 'y² = 4x',
    isFunction: false,
    domain: [0, 6],
    computeY: (x) => {
      if (x < -0.001) return [];
      if (Math.abs(x) < 0.001) return [0];
      const root = Math.sqrt(4 * x);
      return [root, -root];
    },
    description: 'Parabola terbuka ke arah sumbu-x positif. Untuk setiap x > 0, menghasilkan dua nilai keluaran ±2√x.'
  },
  {
    id: 'vertical_parabola',
    name: 'Parabola Vertikal: f(x) = x²',
    equation: 'y = x²',
    isFunction: true,
    domain: [-3.5, 3.5],
    computeY: (x) => [x * x],
    description: 'Fungsi kuadrat terbuka ke atas. Setiap masukan x dipetakan ke tepat satu nilai keluaran x².'
  },
  {
    id: 'cubic_function',
    name: 'Fungsi Kubik: f(x) = x³ - 2x',
    equation: 'y = x³ - 2x',
    isFunction: true,
    domain: [-2.5, 2.5],
    computeY: (x) => [Math.pow(x, 3) - 2 * x],
    description: 'Polinomial kubik. Meskipun kurva berbelok, setiap garis vertikal memotong tepat di 1 titik.'
  },
  {
    id: 'linear_function',
    name: 'Garis Lurus: f(x) = 2x + 1',
    equation: 'y = 2x + 1',
    isFunction: true,
    domain: [-4, 4],
    computeY: (x) => [2 * x + 1],
    description: 'Fungsi linear dengan kemiringan m = 2 dan intersep (0, 1). Memenuhi aturan pemetaan fungsi.'
  }
];

export const VerticalLineTestVisualizer: React.FC = () => {
  const [selectedCurveId, setSelectedCurveId] = useState<string>('circle');
  const [scanX, setScanX] = useState<number>(3.0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanSpeed, setScanSpeed] = useState<number>(1);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeCurve = CURVES.find((c) => c.id === selectedCurveId) || CURVES[0];

  // Animation loop with adjustable speed
  useEffect(() => {
    let animId: number;
    let direction = 0.03 * scanSpeed;

    const loop = () => {
      if (isScanning) {
        setScanX((prev) => {
          let next = prev + direction;
          if (next > 4.8) {
            direction = -0.03 * scanSpeed;
            next = 4.8;
          } else if (next < -4.8) {
            direction = 0.03 * scanSpeed;
            next = -4.8;
          }
          return next;
        });
        animId = requestAnimationFrame(loop);
      }
    };

    if (isScanning) {
      animId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animId);
  }, [isScanning, scanSpeed]);

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

    // 1. Coordinate Grid
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

    // Axis Ticks & Numbers
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = -7; i <= 7; i++) {
      if (i === 0) continue;
      const px = originX + i * scale;
      if (px > 20 && px < logicalWidth - 20) {
        ctx.beginPath();
        ctx.moveTo(px, originY - 3);
        ctx.lineTo(px, originY + 3);
        ctx.stroke();
        ctx.fillText(i.toString(), px, originY + 5);
      }

      const py = originY - i * scale;
      if (py > 20 && py < logicalHeight - 20) {
        ctx.beginPath();
        ctx.moveTo(originX - 3, py);
        ctx.lineTo(originX + 3, py);
        ctx.stroke();
        ctx.save();
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(i.toString(), originX - 6, py);
        ctx.restore();
      }
    }

    // Origin label
    ctx.fillText('0', originX - 8, originY + 5);

    // Axis Header Labels
    ctx.fillStyle = '#475569';
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('x (Masukan / Domain)', logicalWidth - 75, originY - 16);
    ctx.save();
    ctx.translate(originX + 12, 16);
    ctx.fillText('y (Keluaran / Range)', 0, 0);
    ctx.restore();

    // 3. Draw Selected Curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;

    if (activeCurve.id === 'circle') {
      ctx.beginPath();
      ctx.arc(originX, originY, 5 * scale, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      let started = false;
      const step = 0.04;

      for (let x = -8; x <= 8; x += step) {
        const yVals = activeCurve.computeY(x);
        if (yVals.length > 0) {
          const px = originX + x * scale;
          const py = originY - yVals[0] * scale;
          if (py >= -100 && py <= logicalHeight + 100) {
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          }
        }
      }
      ctx.stroke();

      if (activeCurve.id === 'horizontal_parabola') {
        ctx.beginPath();
        started = false;
        for (let x = -8; x <= 8; x += step) {
          const yVals = activeCurve.computeY(x);
          if (yVals.length > 1) {
            const px = originX + x * scale;
            const py = originY - yVals[1] * scale;
            if (py >= -100 && py <= logicalHeight + 100) {
              if (!started) {
                ctx.moveTo(px, py);
                started = true;
              } else {
                ctx.lineTo(px, py);
              }
            }
          }
        }
        ctx.stroke();
      }
    }

    // 4. Draw Scanning Vertical Line: x = scanX
    const lineX = originX + scanX * scale;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lineX, 0);
    ctx.lineTo(lineX, logicalHeight);
    ctx.stroke();
    ctx.restore();

    // Label for scanning line
    ctx.fillStyle = '#dc2626';
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`x = ${scanX.toFixed(2)}`, lineX + 6, 20);

    // 5. Intersections
    const intersections = activeCurve.computeY(scanX);

    intersections.forEach((yVal) => {
      const py = originY - yVal * scale;

      // Glow ring
      ctx.beginPath();
      ctx.arc(lineX, py, 9, 0, Math.PI * 2);
      ctx.fillStyle = intersections.length > 1 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)';
      ctx.fill();

      // Intersection node
      ctx.beginPath();
      ctx.arc(lineX, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = intersections.length > 1 ? '#dc2626' : '#059669';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Coordinate marker
      ctx.fillStyle = '#0f172a';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillText(`(${scanX.toFixed(2)}, ${yVal.toFixed(2)})`, lineX + 10, py - 4);
    });

    // 6. Draw Mouse Hover Crosshair if hovering
    if (hoverCoord) {
      const hpx = originX + hoverCoord.x * scale;
      const hpy = originY - hoverCoord.y * scale;

      ctx.save();
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hpx, 0);
      ctx.lineTo(hpx, logicalHeight);
      ctx.moveTo(0, hpy);
      ctx.lineTo(logicalWidth, hpy);
      ctx.stroke();
      ctx.restore();
    }
  }, [activeCurve, scanX, hoverCoord]);

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

  const handleMouseLeave = () => {
    setHoverCoord(null);
  };

  const currentIntersections = activeCurve.computeY(scanX);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
              Laboratorium Analisis Relasi & Fungsi
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Uji Garis Vertikal (Vertical Line Test)
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Jika ada satu garis vertikal yang memotong kurva di lebih dari 1 titik, 
              maka satu nilai masukan x menghasilkan banyak keluaran y. Kondisi ini melanggar definisi formal fungsi matematika.
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsScanning(!isScanning)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs active:scale-98"
            >
              {isScanning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Jeda
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Pindai Otomatis
                </>
              )}
            </button>

            {/* Speed Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-[11px] font-mono">
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setScanSpeed(spd)}
                  className={`px-2 py-1 rounded transition-colors ${
                    scanSpeed === spd
                      ? 'bg-white text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setIsScanning(false);
                setScanX(3.0);
              }}
              className="p-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors active:scale-98"
              title="Reset ke Titik Uji x = 3.0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport & Configuration Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Canvas Viewport (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-3 pb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-800">{activeCurve.name}</span>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span>Garis Uji: x = {scanX.toFixed(2)}</span>
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
              onMouseLeave={handleMouseLeave}
              className="w-full max-w-[600px] h-auto cursor-crosshair select-none"
            />
          </div>

          {/* Interactive Slider & Numeric Input */}
          <div className="w-full mt-4 space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="scan-slider" className="font-medium text-slate-700">
                Posisi Garis Uji Vertikal:
              </label>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-500">x =</span>
                <input
                  type="number"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={parseFloat(scanX.toFixed(2))}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      setIsScanning(false);
                      setScanX(Math.max(-5, Math.min(5, val)));
                    }
                  }}
                  className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-right font-bold text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <input
              id="scan-slider"
              type="range"
              min="-5"
              max="5"
              step="0.05"
              value={scanX}
              onChange={(e) => {
                setIsScanning(false);
                setScanX(parseFloat(e.target.value));
              }}
              className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>x = -5.0</span>
              <span>x = 0.0</span>
              <span>x = +5.0</span>
            </div>
          </div>
        </div>

        {/* Right Configuration & Analysis Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Curve Selector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
                Daftar Relasi yang Diuji:
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">5 Model</span>
            </div>

            <div className="space-y-2">
              {CURVES.map((curve) => {
                const isSelected = selectedCurveId === curve.id;
                return (
                  <button
                    key={curve.id}
                    onClick={() => {
                      setSelectedCurveId(curve.id);
                      setScanX(curve.id === 'circle' ? 3.0 : curve.id === 'horizontal_parabola' ? 2.0 : 1.5);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-900">{curve.name}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">{curve.equation}</div>
                    </div>
                    <span
                      className={`text-[11px] font-mono font-medium ${
                        curve.isFunction ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {curve.isFunction ? 'Fungsi' : 'Bukan Fungsi'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-Time Mathematical Verdict */}
          <div
            className={`border rounded-xl p-5 shadow-xs transition-all ${
              currentIntersections.length > 1
                ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                : currentIntersections.length === 1
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              {currentIntersections.length > 1 ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : currentIntersections.length === 1 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <div className="w-5 h-5 text-slate-400 shrink-0 mt-0.5 font-mono text-xs">ø</div>
              )}

              <div className="space-y-1.5 flex-1">
                <div className="font-bold text-sm tracking-tight">
                  {currentIntersections.length > 1
                    ? 'HASIL UJI: BUKAN FUNGSI y = f(x)'
                    : currentIntersections.length === 1
                    ? 'HASIL UJI: MEMENUHI DEFINISI FUNGSI'
                    : 'DI LUAR DAERAH ASAL (DOMAIN)'}
                </div>

                <div className="text-xs leading-relaxed">
                  {currentIntersections.length > 1 ? (
                    <>
                      Pada nilai masukan <strong className="font-mono">x = {scanX.toFixed(2)}</strong>, garis vertikal memotong kurva di <strong className="font-mono">{currentIntersections.length} titik potong</strong>:{' '}
                      <span className="font-mono font-bold text-rose-900">
                        {currentIntersections.map((y) => y.toFixed(2)).join(' dan ')}
                      </span>. 
                      Karena satu masukan memiliki dua nilai keluaran berbeda, relasi ini tidak memenuhi syarat fungsi.
                    </>
                  ) : currentIntersections.length === 1 ? (
                    <>
                      Pada nilai masukan <strong className="font-mono">x = {scanX.toFixed(2)}</strong>, garis vertikal memotong kurva tepat di <strong className="font-mono">1 titik</strong>: y = {currentIntersections[0].toFixed(2)}. 
                      Setiap elemen masukan dipetakan ke tepat satu nilai keluaran.
                    </>
                  ) : (
                    <>Nilai x = {scanX.toFixed(2)} berada di luar interval daerah asal kurva ini.</>
                  )}
                </div>

                {currentIntersections.length > 1 && (
                  <div className="mt-2 pt-2 border-t border-rose-200/60 font-mono text-[11px] text-rose-800">
                    Pasangan terurut: ({scanX.toFixed(2)}, {currentIntersections[0].toFixed(2)}) dan ({scanX.toFixed(2)}, {currentIntersections[1].toFixed(2)})
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
