import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, CheckCircle2, XCircle, Table as TableIcon, HelpCircle, Activity } from 'lucide-react';

export const NotationInterpretationVisualizer: React.FC = () => {
  const [selectedFunction, setSelectedFunction] = useState<'linear' | 'quadratic'>('linear');
  const [inputA, setInputA] = useState<number>(3);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Computations
  const evaluate = (x: number) => {
    if (selectedFunction === 'linear') {
      return 2 * x + 1; // f(x) = 2x + 1
    } else {
      return x * x - 2; // f(x) = x^2 - 2
    }
  };

  const outputValue = evaluate(inputA);
  const tableRows = [-3, -2, -1, 0, 1, 2, 3, 4, 5];

  // Canvas drawing dimensions
  const logicalWidth = 600;
  const logicalHeight = 360;
  const originX = logicalWidth / 2;
  const originY = logicalHeight / 2 + (selectedFunction === 'quadratic' ? 40 : 0);
  const scale = 32; // pixels per unit

  const toCanvasX = useCallback((x: number) => originX + x * scale, [originX, scale]);
  const toCanvasY = useCallback((y: number) => originY - y * scale, [originY, scale]);
  const toMathX = useCallback((cx: number) => (cx - originX) / scale, [originX, scale]);
  const toMathY = useCallback((cy: number) => (originY - cy) / scale, [originY, scale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, logicalWidth, logicalHeight);

    // Grid lines
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;

    for (let x = -10; x <= 10; x++) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, logicalHeight);
      ctx.stroke();
    }
    for (let y = -8; y <= 12; y++) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(logicalWidth, cy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;

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

    // Axis Labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let x = -8; x <= 8; x += 2) {
      if (x === 0) continue;
      const cx = toCanvasX(x);
      if (cx > 20 && cx < logicalWidth - 20) {
        ctx.fillText(x.toString(), cx, originY + 5);
      }
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = -6; y <= 10; y += 2) {
      if (y === 0) continue;
      const cy = toCanvasY(y);
      if (cy > 20 && cy < logicalHeight - 20) {
        ctx.fillText(y.toString(), originX - 6, cy);
      }
    }

    // Draw Function Curve
    ctx.beginPath();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;

    let started = false;
    for (let px = 0; px <= logicalWidth; px += 2) {
      const mathX = toMathX(px);
      const mathY = evaluate(mathX);
      const py = toCanvasY(mathY);

      if (py >= -20 && py <= logicalHeight + 20) {
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      } else {
        started = false;
      }
    }
    ctx.stroke();

    // Plot discrete table points
    tableRows.forEach((xVal) => {
      const yVal = evaluate(xVal);
      const cx = toCanvasX(xVal);
      const cy = toCanvasY(yVal);

      if (cx >= 0 && cx <= logicalWidth && cy >= 0 && cy <= logicalHeight) {
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#cbd5e1';
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // Highlight active point (inputA, outputValue)
    const activeCx = toCanvasX(inputA);
    const activeCy = toCanvasY(outputValue);

    // Dashed projection to axes
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#a5b4fc';
    ctx.lineWidth = 1.5;
    // to X-axis
    ctx.moveTo(activeCx, activeCy);
    ctx.lineTo(activeCx, originY);
    // to Y-axis
    ctx.moveTo(activeCx, activeCy);
    ctx.lineTo(originX, activeCy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glow ring
    ctx.beginPath();
    ctx.arc(activeCx, activeCy, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
    ctx.fill();

    // Solid active dot
    ctx.beginPath();
    ctx.arc(activeCx, activeCy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#4f46e5';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Coordinate badge
    const badgeText = `(${inputA}, ${outputValue})`;
    ctx.font = 'bold 12px JetBrains Mono, monospace';
    const textWidth = ctx.measureText(badgeText).width;
    const badgeX = Math.min(Math.max(activeCx - textWidth / 2 - 8, 10), logicalWidth - textWidth - 26);
    const badgeY = activeCy < 50 ? activeCy + 16 : activeCy - 34;

    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, textWidth + 16, 24, 6);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, badgeX + 8, badgeY + 12);

    // Hover crosshair if active
    if (hoverCoord) {
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(hoverCoord.x, 0);
      ctx.lineTo(hoverCoord.x, logicalHeight);
      ctx.moveTo(0, hoverCoord.y);
      ctx.lineTo(logicalWidth, hoverCoord.y);
      ctx.stroke();
    }
  }, [selectedFunction, inputA, hoverCoord, toCanvasX, toCanvasY, toMathX, toMathY]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverCoord({ x, y });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const mathX = Math.round(toMathX(clientX));
    if (mathX >= -3 && mathX <= 5) {
      setInputA(mathX);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          Modul 4: Jembatan Representasi & Penafsiran Notasi Fungsi f(a)
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Meluruskan miskonsepsi umum di mana peserta didik menganggap notasi fungsi <strong>f(a)</strong> sebagai 
          perkalian aljabar antara variabel f dengan variabel a (f × a), serta menghubungkan 4 representasi: 
          <strong> Simbolik, Mesin Input-Output, Tabel Nilai, dan Koordinat Grafik</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Dynamic Notation Evaluation & Contrast (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Function Selector & Input Slider */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Pilih Rumus Fungsi:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFunction('linear')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    selectedFunction === 'linear'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  f(x) = 2x + 1
                </button>
                <button
                  onClick={() => setSelectedFunction('quadratic')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    selectedFunction === 'quadratic'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  f(x) = x² - 2
                </button>
              </div>
            </div>

            {/* Slider & Number Input for a */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="input-a-slider" className="font-medium text-slate-700">
                  Ubah Nilai Argumen Masukan (a):
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-xs">Nilai Masukan:</span>
                  <input
                    type="number"
                    min="-3"
                    max="5"
                    step="1"
                    value={inputA}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= -3 && val <= 5) setInputA(val);
                    }}
                    className="w-16 px-2 py-0.5 text-center font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <input
                id="input-a-slider"
                type="range"
                min="-3"
                max="5"
                step="1"
                value={inputA}
                onChange={(e) => setInputA(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>a = -3</span>
                <span>a = 0</span>
                <span>a = +5</span>
              </div>
            </div>
          </div>

          {/* Canvas: Real-time Coordinate Graph */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Representasi Geometris: Plot Titik ({inputA}, f({inputA}))
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">Klik grid untuk memindahkan titik a</span>
            </div>

            <div className="relative rounded-lg border border-slate-200 overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                style={{ width: '100%', height: `${logicalHeight}px` }}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={() => setHoverCoord(null)}
                onClick={handleCanvasClick}
                className="cursor-crosshair block"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  Kurva Kontinu f(x)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full border border-slate-500 bg-slate-300"></span>
                  Titik Diskrit Tabel
                </span>
              </div>
              <span className="font-mono text-indigo-700 font-semibold">
                Koordinat Aktif: ({inputA}, {outputValue})
              </span>
            </div>
          </div>

          {/* Deep Contrast: Correct Mapping vs Multiplication Misconception */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Correct Column */}
            <div className="bg-emerald-50/90 border border-emerald-300/80 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                Konsep Benar: Pemetaan Masukan
              </div>
              <div className="text-xs text-emerald-800 space-y-2 leading-relaxed">
                <p>
                  <strong>f</strong> adalah nama aturan relasi, bukan besaran aljabar. Angka di dalam kurung disubstitusikan ke setiap kemunculan variabel masukan x.
                </p>
                <div className="bg-white/80 p-3 rounded-lg border border-emerald-200 font-mono text-xs text-emerald-950 space-y-1">
                  <div>f(x) = {selectedFunction === 'linear' ? '2x + 1' : 'x² - 2'}</div>
                  <div className="text-indigo-600 font-semibold">
                    f({inputA}) = {selectedFunction === 'linear' ? `2(${inputA}) + 1` : `(${inputA})² - 2`}
                  </div>
                  <div className="text-emerald-700 font-bold text-sm">
                    f({inputA}) = {outputValue}
                  </div>
                </div>
                <div className="text-[11px] text-emerald-700">
                  ⇒ Membentuk pasangan koordinat titik di grafik: <strong>({inputA}, {outputValue})</strong>
                </div>
              </div>
            </div>

            {/* Misconception Column */}
            <div className="bg-rose-50/90 border border-rose-300/80 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                Miskonsepsi: Perkalian Aljabar
              </div>
              <div className="text-xs text-rose-800 space-y-2 leading-relaxed">
                <p>
                  Siswa yang salah mengira tanda kurung berdampingan selalu berarti perkalian aljabar 
                  (seperti 3(4) = 12).
                </p>
                <div className="bg-white/80 p-3 rounded-lg border border-rose-200 font-mono text-xs text-rose-950 space-y-1">
                  <div className="text-rose-700 line-through">f({inputA}) = f × {inputA}</div>
                  <div className="text-rose-700 line-through">Hasil keliru: {inputA}f</div>
                  <div className="text-[11px] text-rose-600 font-sans italic mt-1">
                    "Berapa nilai variabel f? Apakah f = 1?"
                  </div>
                </div>
                <div className="text-[11px] text-rose-700">
                  Kekeliruan ini membuat siswa gagal memahami konsep grafik fungsi Cartesius.
                </div>
              </div>
            </div>
          </div>

          {/* Machine Flow Diagram */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Visualisasi Alur Substitusi:
            </div>
            <div className="flex items-center justify-center gap-3 py-2 text-xs font-mono">
              <span className="bg-blue-600 px-3 py-1.5 rounded-lg font-bold">
                Masukan x = {inputA}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="bg-indigo-700 px-3 py-1.5 rounded-lg font-bold">
                Aturan f({inputA})
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="bg-emerald-600 px-3 py-1.5 rounded-lg font-bold">
                Keluaran y = {outputValue}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Dynamic Synchronized Value Table (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <TableIcon className="w-4 h-4 text-indigo-600" />
                Tabel Nilai Representasi Tabular:
              </h3>
              <span className="text-[11px] text-slate-500">Tersinkronisasi Otomatis</span>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 text-xs">
              <table className="w-full text-center">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-mono">
                  <tr>
                    <th className="py-2 px-3">x (Masukan)</th>
                    <th className="py-2 px-3">Proses Substitusi</th>
                    <th className="py-2 px-3">f(x) (Keluaran)</th>
                    <th className="py-2 px-3">Titik (x, y)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {tableRows.map((xVal) => {
                    const yVal = evaluate(xVal);
                    const isCurrent = xVal === inputA;

                    return (
                      <tr
                        key={xVal}
                        className={`transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-indigo-100 font-bold text-indigo-950'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                        onClick={() => setInputA(xVal)}
                      >
                        <td className="py-2 px-3">{xVal}</td>
                        <td className="py-2 px-3 text-[11px] text-slate-500">
                          {selectedFunction === 'linear' ? `2(${xVal})+1` : `(${xVal})²-2`}
                        </td>
                        <td className="py-2 px-3 text-emerald-700 font-semibold">{yVal}</td>
                        <td className="py-2 px-3 text-indigo-700">
                          ({xVal}, {yVal})
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="text-[11px] text-slate-500 italic">
              Klik baris tabel di atas untuk langsung menguji nilai masukan fungsi tersebut.
            </div>
          </div>

          {/* Research Insight */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
            <div className="font-semibold flex items-center gap-1.5 text-amber-950">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              Pentingnya Koneksi Multi-Representasi (Ayeh, 2025):
            </div>
            <p className="leading-relaxed">
              Peserta didik sering terisolasi hanya pada manipulasi rumus aljabar tanpa memahami 
              bahwa tabel nilai dan titik grafik koordinat adalah satu kesatuan wujud yang sama dari sebuah fungsi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
