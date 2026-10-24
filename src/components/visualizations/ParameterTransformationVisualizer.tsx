import React, { useState, useEffect, useRef } from 'react';
import { Sliders, RotateCcw } from 'lucide-react';

export const ParameterTransformationVisualizer: React.FC = () => {
  const [modelType, setModelType] = useState<'quadratic' | 'linear'>('quadratic');

  // Quadratic parameters: f(x) = a(x - h)^2 + k
  const [quadA, setQuadA] = useState<number>(1);
  const [quadH, setQuadH] = useState<number>(3);
  const [quadK, setQuadK] = useState<number>(2);

  // Linear parameters: f(x) = ax + b
  const [linA, setLinA] = useState<number>(2);
  const [linB, setLinB] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleReset = () => {
    if (modelType === 'quadratic') {
      setQuadA(1);
      setQuadH(3);
      setQuadK(2);
    } else {
      setLinA(2);
      setLinB(1);
    }
  };

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
    const scale = 36; // 36px per unit

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

    // Numbers on axes
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

    // 3. Parent Function (Ghost curve in gray dashed line)
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.75;
    ctx.beginPath();

    if (modelType === 'quadratic') {
      let started = false;
      for (let x = -6; x <= 6; x += 0.05) {
        const y = x * x;
        const px = originX + x * scale;
        const py = originY - y * scale;
        if (py >= -100 && py <= logicalHeight + 100) {
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
      }
    } else {
      ctx.moveTo(originX - 6 * scale, originY - (-6) * scale);
      ctx.lineTo(originX + 6 * scale, originY - 6 * scale);
    }
    ctx.stroke();
    ctx.restore();

    // 4. Transformed Function Curve
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    if (modelType === 'quadratic') {
      let started = false;
      for (let x = -8; x <= 8; x += 0.04) {
        const y = quadA * Math.pow(x - quadH, 2) + quadK;
        const px = originX + x * scale;
        const py = originY - y * scale;
        if (py >= -200 && py <= logicalHeight + 200) {
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
      }
      ctx.stroke();

      // Vertex Point: (quadH, quadK)
      const vertexPx = originX + quadH * scale;
      const vertexPy = originY - quadK * scale;

      // Displacement lines
      ctx.save();
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.25;

      // Horizontal h
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(vertexPx, originY);
      ctx.stroke();

      // Vertical k
      ctx.beginPath();
      ctx.moveTo(vertexPx, originY);
      ctx.lineTo(vertexPx, vertexPy);
      ctx.stroke();
      ctx.restore();

      // Vertex point circle
      ctx.beginPath();
      ctx.arc(vertexPx, vertexPy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vertex label
      ctx.fillStyle = '#0f172a';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillText(`Puncak (${quadH.toFixed(1)}, ${quadK.toFixed(1)})`, vertexPx + 10, vertexPy - 8);

    } else {
      // Linear: f(x) = ax + b
      let started = false;
      for (let x = -8; x <= 8; x += 0.1) {
        const y = linA * x + linB;
        const px = originX + x * scale;
        const py = originY - y * scale;
        if (py >= -200 && py <= logicalHeight + 200) {
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
      }
      ctx.stroke();

      // Y-intercept (0, b)
      const interceptPx = originX;
      const interceptPy = originY - linB * scale;

      ctx.beginPath();
      ctx.arc(interceptPx, interceptPy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#065f46';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillText(`Intersep (0, ${linB.toFixed(1)})`, interceptPx + 10, interceptPy - 6);

      // Slope triangle
      const x1 = 1;
      const y1 = linA * x1 + linB;
      const x2 = 2;
      const y2 = linA * x2 + linB;

      const px1 = originX + x1 * scale;
      const py1 = originY - y1 * scale;
      const px2 = originX + x2 * scale;
      const py2 = originY - y2 * scale;

      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.75;
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();
      ctx.fillStyle = '#b45309';
      ctx.font = '10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Δx = 1', (px1 + px2) / 2, py1 + 12);
      ctx.fillText(`Δy = ${linA.toFixed(1)}`, px2 + 18, (py1 + py2) / 2);
      ctx.restore();
    }
  }, [modelType, quadA, quadH, quadK, linA, linB]);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">
              Laboratorium Transformasi Geometris & Translasi
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Transformasi Parameter Fungsi
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Mengamati pengaruh perubahan parameter koefisien arah (a), translasi horizontal (h), dan translasi vertikal (k) terhadap bentuk serta posisi kurva.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => setModelType('quadratic')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  modelType === 'quadratic'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kuadrat a(x - h)² + k
              </button>
              <button
                onClick={() => setModelType('linear')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  modelType === 'linear'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Linear ax + b
              </button>
            </div>

            <button
              onClick={handleReset}
              className="p-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors active:scale-98"
              title="Reset Parameter"
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
            <div className="font-mono text-xs font-bold text-indigo-700">
              {modelType === 'quadratic' ? (
                <>
                  f(x) = {quadA !== 1 ? `${quadA}` : ''}(x {quadH >= 0 ? `- ${quadH}` : `+ ${Math.abs(quadH)}`})² {quadK >= 0 ? `+ ${quadK}` : `- ${Math.abs(quadK)}`}
                </>
              ) : (
                <>
                  f(x) = {linA}x {linB >= 0 ? `+ ${linB}` : `- ${Math.abs(linB)}`}
                </>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-3 h-0.5 border-t border-dashed border-slate-400 inline-block"></span>
                Kurva Induk
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
                <span className="w-3 h-0.5 bg-indigo-600 inline-block"></span>
                Kurva Ditransformasikan
              </span>
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white relative flex justify-center">
            <canvas
              ref={canvasRef}
              className="w-full max-w-[600px] h-auto select-none"
            />
          </div>

          {/* Preset Buttons */}
          <div className="w-full mt-4 flex items-center justify-between gap-2 text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500 text-[11px]">Skenario Uji Cepat:</span>
            <div className="flex items-center gap-2">
              {modelType === 'quadratic' ? (
                <>
                  <button
                    onClick={() => { setQuadA(1); setQuadH(3); setQuadK(2); }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    (x-3)²+2 (Kanan 3, Atas 2)
                  </button>
                  <button
                    onClick={() => { setQuadA(1); setQuadH(-2); setQuadK(-3); }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    (x+2)²-3 (Kiri 2, Bawah 3)
                  </button>
                  <button
                    onClick={() => { setQuadA(-1); setQuadH(0); setQuadK(4); }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    -x²+4 (Refleksi)
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setLinA(2); setLinB(1); }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    U-01: 2x+1
                  </button>
                  <button
                    onClick={() => { setLinA(-1); setLinB(3); }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-mono"
                  >
                    -x+3 (Gradien Negatif)
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sliders Deck & Debunker Proof (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Sliders Container */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              Kontrol Parameter Numerik:
            </h3>

            {modelType === 'quadratic' ? (
              <div className="space-y-4 text-xs">
                {/* a parameter */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-medium">Koefisien a (Keterbukaan/Peregangan):</span>
                    <input
                      type="number"
                      step="0.5"
                      min="-3"
                      max="3"
                      value={quadA}
                      onChange={(e) => setQuadA(parseFloat(e.target.value) || 0.1)}
                      className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-right font-mono font-bold text-indigo-700 focus:outline-none"
                    />
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="0.5"
                    value={quadA}
                    onChange={(e) => setQuadA(parseFloat(e.target.value) || 0.1)}
                    className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-500">
                    {quadA > 0 ? 'Parabola terbuka ke ATAS' : quadA < 0 ? 'Parabola terbuka ke BAWAH (refleksi)' : 'Bukan parabola'}
                  </div>
                </div>

                {/* h parameter */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-medium">Parameter h (Translasi Horizontal):</span>
                    <input
                      type="number"
                      step="0.5"
                      min="-5"
                      max="5"
                      value={quadH}
                      onChange={(e) => setQuadH(parseFloat(e.target.value))}
                      className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-right font-mono font-bold text-amber-700 focus:outline-none"
                    />
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={quadH}
                    onChange={(e) => setQuadH(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-500 font-mono">
                    {quadH > 0 ? `Bergeser +${quadH} satuan ke KANAN` : quadH < 0 ? `Bergeser ${quadH} satuan ke KIRI` : 'Puncak di sumbu-y'}
                  </div>
                </div>

                {/* k parameter */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-medium">Parameter k (Translasi Vertikal):</span>
                    <input
                      type="number"
                      step="0.5"
                      min="-5"
                      max="5"
                      value={quadK}
                      onChange={(e) => setQuadK(parseFloat(e.target.value))}
                      className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-right font-mono font-bold text-emerald-700 focus:outline-none"
                    />
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={quadK}
                    onChange={(e) => setQuadK(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-500 font-mono">
                    {quadK > 0 ? `Puncak naik +${quadK} satuan ke ATAS` : quadK < 0 ? `Puncak turun ${quadK} satuan ke BAWAH` : 'Puncak di sumbu-x'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* a parameter (slope) */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-medium">Kemiringan / Gradien (a):</span>
                    <input
                      type="number"
                      step="0.5"
                      min="-4"
                      max="4"
                      value={linA}
                      onChange={(e) => setLinA(parseFloat(e.target.value))}
                      className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-right font-mono font-bold text-indigo-700 focus:outline-none"
                    />
                  </div>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="0.5"
                    value={linA}
                    onChange={(e) => setLinA(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-500">
                    Setiap Δx = 1, nilai y bertambah sebesar {linA}.
                  </div>
                </div>

                {/* b parameter (intercept) */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-medium">Intersep Sumbu-Y (b):</span>
                    <input
                      type="number"
                      step="0.5"
                      min="-5"
                      max="5"
                      value={linB}
                      onChange={(e) => setLinB(parseFloat(e.target.value))}
                      className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-xs text-right font-mono font-bold text-emerald-700 focus:outline-none"
                    />
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={linB}
                    onChange={(e) => setLinB(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-500">
                    Memotong sumbu-y pada koordinat (0, {linB}).
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mathematical Proof Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Prinsip Aljabar: Mengapa (x - 3)² Bergeser ke Kanan (+3)?
            </div>
            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                Siswa sering mengira tanda minus pada <span className="font-mono text-amber-300">(x - 3)</span> berarti kurva bergerak ke arah sumbu negatif (kiri).
              </p>
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg font-mono text-[11px] space-y-1.5">
                <div className="text-slate-400">Langkah Analitis:</div>
                <div>1. Kurva induk y = x² mencapai nilai minimum 0 saat x = 0.</div>
                <div>2. Pada kurva y = (x - 3)², nilai minimum 0 tercapai saat bagian dalam kurung sama dengan nol:</div>
                <div className="text-emerald-400 font-bold">   x - 3 = 0  ⟹  x = +3</div>
                <div>3. Akibatnya, nilai masukan x harus 3 satuan lebih besar untuk menghasilkan nilai keluaran kuadrat yang sama.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
