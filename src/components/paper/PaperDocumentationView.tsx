import React, { useState } from 'react';
import { BookOpen, GraduationCap, Users, Mail, FileText, CheckCircle2, Award, Printer } from 'lucide-react';

export const PaperDocumentationView: React.FC = () => {
  const [lang, setLang] = useState<'id' | 'en'>('id');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Paper Header Dossier */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-semibold">
            <GraduationCap className="w-4 h-4" />
            Naskah Riset Pendidikan Ilmu Komputer · FPMIPA UPI
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            PERANCANGAN SISTEM CERDAS BERBASIS ANALISIS MISKONSEPSI UNTUK MENGHASILKAN VISUALISASI ADAPTIF PADA PEMBELAJARAN FUNGSI MATEMATIKA MENUJU EDUCATION 5.0
          </h1>

          <div className="text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-slate-900">
              Yahfasyat Asabir Abuya¹, Muhammad Aqsah Aufasyaif², Leonard Gilardino³
            </div>
            <div className="text-slate-500">
              Pendidikan Ilmu Komputer, FPMIPA, Universitas Pendidikan Indonesia
            </div>
            <div className="text-indigo-600 font-mono text-[11px] flex items-center justify-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              yahfasyat14@student.upi.edu
            </div>
          </div>
        </div>

        {/* Abstract Box with Toggle ID/EN */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              {lang === 'id' ? 'ABSTRAK' : 'ABSTRACT'}
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setLang('id')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  lang === 'id' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Indonesia
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  lang === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {lang === 'id' ? (
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify bg-slate-50 p-4 rounded-xl border border-slate-200">
              Konsep fungsi matematika menuntut peserta didik menghubungkan representasi simbolik, tabel, dan grafik. 
              Kesulitan menghubungkan representasi tersebut dapat menyebabkan pemahaman yang terbatas terhadap konsep fungsi. 
              Artikel ini bertujuan merancang konsep sistem pembelajaran yang memetakan kemungkinan miskonsepsi pada materi fungsi 
              dan memberikan umpan balik melalui visualisasi grafik yang sesuai. Metode yang digunakan adalah studi literatur terarah 
              dan perancangan konseptual sistem. Literatur tentang pemahaman konsep fungsi, miskonsepsi, tes diagnostik empat tingkat, 
              dan desain pembelajaran digunakan sebagai dasar untuk menyusun alur sistem, kategori respons, serta skenario pengujian fungsional. 
              Rancangan mencakup tes diagnostik empat tingkat, aturan pemetaan jawaban ke kategori pemahaman, dan visualisasi fungsi interaktif. 
              Rancangan ini diharapkan menjadi dasar pengembangan media Edu-Tech yang mendukung pembelajaran fungsi secara lebih visual dan responsif.
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify bg-slate-50 p-4 rounded-xl border border-slate-200">
              The concept of mathematical functions requires learners to connect symbolic, tabular, and graphical representations. 
              Difficulty connecting these representations may lead to limited understanding of function concepts. 
              This article proposes a learning-system design that maps possible misconceptions in functions and provides feedback through relevant graph visualizations. 
              The method consists of a focused literature review and conceptual system design. Literature on function understanding, misconceptions, 
              four-tier diagnostic tests, and instructional design informs the system workflow, response categories, and functional test scenarios. 
              The proposed design includes a four-tier diagnostic test, rules for mapping responses to understanding categories, and interactive function visualization. 
              The design is intended as a foundation for developing an Edu-Tech tool that supports more visual and responsive learning of functions.
            </p>
          )}

          <div className="text-xs text-slate-600">
            <strong>Kata kunci:</strong> fungsi matematika, miskonsepsi, tes diagnostik empat tingkat, visualisasi adaptif, Education 5.0
          </div>
        </div>

        {/* 5 Theoretical Pillars from UPI Paper */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">
            Pilar Konseptual & Rujukan Teoretis Miskonsepsi:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-2">
              <div className="font-bold text-indigo-950">
                1. Prototipe Mental & Uji Garis Vertikal
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Tall & Bakar (1992):</strong> Siswa sering membentuk gambaran prototipe sempit mengenai fungsi 
                berdasarkan contoh visual yang familier (misal lingkaran dianggap fungsi karena bentuknya simetris). 
                Sistem menyediakan Uji Garis Vertikal dinamis untuk membuktikan aturan satu masukan tepat satu keluaran.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
              <div className="font-bold text-emerald-950">
                2. Domain & Range Sebagai Proyeksi Koordinat
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Procedia Social Sciences (2009):</strong> Miskonsepsi tertukarnya domain dan range serta pengabaian 
                syarat pecahan (penyebut ≠ 0) dan akar kuadrat (≥ 0). Sistem memproyeksikan interval warna sumbu-x (Domain) 
                dan sumbu-y (Range) beserta simulator Mesin Fungsi.
              </p>
            </div>

            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
              <div className="font-bold text-amber-950">
                3. Transformasi Parameter & Translasi
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Parhizgar et al. (2022):</strong> Kesulitan memahami mengapa f(x - h) bergeser ke kanan untuk h positif. 
                Sistem menyediakan slider interaktif dengan jejak kurva induk (ghost trace) dan pelacak titik puncak (h, k).
              </p>
            </div>

            <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2">
              <div className="font-bold text-purple-950">
                4. Makna Geometris Turunan & Garis Singgung
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Ayeh (2025) & Misconception in Calculus-I:</strong> Menyamakan nilai turunan f'(a) dengan nilai ketinggian 
                fungsi f(a), serta mengira fungsi kontinu (|x|) otomatis terturunkan. Sistem menyediakan garis singgung dinamis 
                dan transisi garis sekan limit h → 0.
              </p>
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2 md:col-span-2 lg:col-span-2">
              <div className="font-bold text-blue-950">
                5. Instrumen Diagnostik Empat Tingkat (Four-Tier CRI)
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Oat-ngam & Chaimongkol (2024):</strong> Memisahkan tebakan dari miskonsepsi sejati dengan mengukur 
                tingkat keyakinan (Certainty of Response Index) pada jawaban dan alasan matematis untuk menghasilkan diagnosis adaptif.
              </p>
            </div>
          </div>
        </div>

        {/* DIMAS-TI Competition Note */}
        <div className="bg-slate-900 text-white p-5 rounded-xl space-y-2 text-xs">
          <div className="font-bold text-amber-400 flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            Kesesuaian dengan Panduan Kompetisi DIMAS-TI & Riset Lanjutan
          </div>
          <p className="text-slate-300 leading-relaxed">
            Aplikasi web ini merupakan implementasi prototipe penuh yang berhasil dibangun untuk memvalidasi secara empiris 
            seluruh rancangan alur sistem, pohon keputusan diagnosis 4-tingkat, dan modul visualisasi fungsi adaptif 
            yang dirancang oleh tim mahasiswa FPMIPA UPI.
          </p>
        </div>
      </div>
    </div>
  );
};
