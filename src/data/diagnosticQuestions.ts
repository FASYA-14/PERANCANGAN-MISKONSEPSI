import { DiagnosticQuestion } from '../types/math';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'q1',
    conceptArea: 'RELASI_FUNGSI',
    title: 'Item 1: Karakteristik Grafik Relasi vs Fungsi Matematis',
    tier1: {
      prompt: 'Perhatikan persamaan lingkaran x² + y² = 25 pada bidang koordinat Cartesius. Apakah kurva lingkaran tersebut merupakan grafik suatu fungsi y = f(x)?',
      mathExpression: 'x² + y² = 25',
      graphType: 'circle',
      options: [
        {
          id: 'q1_opt_a',
          text: 'Bukan fungsi y = f(x)',
          isCorrect: true,
          explanation: 'Tepat! Pada lingkaran, nilai masukan x di dalam interval (-5, 5) menghasilkan dua nilai keluaran y yang berbeda (misalnya untuk x = 0 menghasilkan y = 5 dan y = -5).'
        },
        {
          id: 'q1_opt_b',
          text: 'Merupakan fungsi y = f(x) karena memiliki bentuk kurva tertutup yang mulus',
          isCorrect: false,
          misconceptionCode: 'MC_VERTICAL_LINE_FAILURE',
          explanation: 'Miskonsepsi: Menganggap bahwa setiap kurva geometris kontinu atau tertutup otomatis merupakan fungsi matematika.'
        },
        {
          id: 'q1_opt_c',
          text: 'Merupakan fungsi y = f(x) hanya jika jari-jarinya berupa bilangan bulat positif',
          isCorrect: false,
          misconceptionCode: 'MC_VERTICAL_LINE_FAILURE',
          explanation: 'Miskonsepsi: Ukuran jari-jari tidak mempengaruhi definisi fundamental dari relasi versus fungsi.'
        },
        {
          id: 'q1_opt_d',
          text: 'Merupakan fungsi y = f(x) karena simetris terhadap sumbu-x dan sumbu-y',
          isCorrect: false,
          misconceptionCode: 'MC_VERTICAL_LINE_FAILURE',
          explanation: 'Miskonsepsi: Simetri terhadap sumbu-x justru menjadi penyebab utama gagalnya uji garis vertikal!'
        }
      ]
    },
    tier3: {
      prompt: 'Pilihlah satu alasan matematis yang paling mendasari pilihan jawaban Anda di atas:',
      reasons: [
        {
          id: 'q1_rsn_a',
          text: 'Jika ditarik garis vertikal x = c (dengan -5 < c < 5), garis tersebut memotong kurva di dua titik, sehingga ada satu nilai masukan x yang memiliki lebih dari satu nilai keluaran y.',
          isCorrect: true,
          explanation: 'Alasan sahih: Definisi fungsi mewajibkan setiap elemen daerah asal (x) dipetakan ke tepat satu elemen daerah kawan (y).'
        },
        {
          id: 'q1_rsn_b',
          text: 'Semua grafik yang dapat digambar persamaannya secara aljabar pasti memenuhi syarat sebagai fungsi matematis.',
          isCorrect: false,
          misconceptionCode: 'MC_VERTICAL_LINE_FAILURE',
          explanation: 'Miskonsepsi prototipe mental (Tall & Bakar, 1992): Menyamakan semua persamaan relasi dua variabel sebagai fungsi.'
        },
        {
          id: 'q1_rsn_c',
          text: 'Garis horizontal memotong kurva di dua titik, dan uji garis horizontal membuktikan bahwa kurva bukan fungsi.',
          isCorrect: false,
          misconceptionCode: 'MC_VERTICAL_LINE_FAILURE',
          explanation: 'Miskonsepsi: Mencampuradukkan Uji Garis Vertikal (uji fungsi) dengan Uji Garis Horizontal (uji fungsi satu-satu / injektif).'
        },
        {
          id: 'q1_rsn_d',
          text: 'Kurva tersebut memiliki nilai y yang nilainya selalu positif untuk setiap x.',
          isCorrect: false,
          explanation: 'Kekeliruan faktual: Lingkaran x² + y² = 25 juga memiliki nilai y negatif dari y = -5 sampai 0.'
        }
      ]
    }
  },
  {
    id: 'q2',
    conceptArea: 'DOMAIN_RANGE',
    title: 'Item 2: Penentuan Daerah Asal (Domain) dan Daerah Hasil (Range)',
    tier1: {
      prompt: 'Diberikan fungsi real f(x) = 4 / (x - 3). Manakah pernyataan berikut yang paling tepat mengenai Daerah Asal (Domain) dan Daerah Hasil (Range) dari f(x)?',
      mathExpression: 'f(x) = 4 / (x - 3)',
      graphType: 'rational',
      options: [
        {
          id: 'q2_opt_a',
          text: 'Domain = {x ∈ ℝ | x ≠ 3} dan Range = {y ∈ ℝ | y ≠ 0}',
          isCorrect: true,
          explanation: 'Tepat! Pembagi tidak boleh bernilai nol sehingga x ≠ 3, dan pecahan dengan pembilang konstan 4 tidak akan pernah bernilai nol sehingga y ≠ 0.'
        },
        {
          id: 'q2_opt_b',
          text: 'Domain = {x ∈ ℝ | x ≠ 0} dan Range = {y ∈ ℝ | y ≠ 3}',
          isCorrect: false,
          misconceptionCode: 'MC_DOMAIN_RANGE_INVERSION',
          explanation: 'Miskonsepsi: Tertukarnya variabel masukan (Domain pada sumbu-x) dengan variabel keluaran (Range pada sumbu-y).'
        },
        {
          id: 'q2_opt_c',
          text: 'Domain adalah seluruh bilangan real ℝ tanpa pembatasan apa pun',
          isCorrect: false,
          misconceptionCode: 'MC_DOMAIN_RESTRICTION_OMISSION',
          explanation: 'Miskonsepsi: Mengabaikan syarat nilai tak terdefinisi saat penyebut bernilai nol (x = 3).'
        },
        {
          id: 'q2_opt_d',
          text: 'Domain = {x ∈ ℝ | x ≥ 3} dan Range = {y ∈ ℝ | y ≥ 0}',
          isCorrect: false,
          misconceptionCode: 'MC_DOMAIN_RESTRICTION_OMISSION',
          explanation: 'Miskonsepsi: Menerapkan aturan bilangan non-negatif dari fungsi akar pada fungsi pecahan rasional.'
        }
      ]
    },
    tier3: {
      prompt: 'Pilihlah satu alasan matematis yang paling mendasari pilihan jawaban Anda di atas:',
      reasons: [
        {
          id: 'q2_rsn_a',
          text: 'Nilai masukan x = 3 membuat penyebut bernilai nol sehingga pembagian tidak terdefinisi pada bilangan real, dan nilai 4/(x - 3) tidak pernah bernilai nol untuk nilai x berapapun.',
          isCorrect: true,
          explanation: 'Alasan sahih: Domain adalah himpunan seluruh masukan absis x yang menghasilkan nilai ordinat y terdefinisi.'
        },
        {
          id: 'q2_rsn_b',
          text: 'Domain selalu ditentukan oleh nilai konstanta di ruas kanan (yaitu angka 3) sebagai batas nilai y pada sumbu vertikal.',
          isCorrect: false,
          misconceptionCode: 'MC_DOMAIN_RANGE_INVERSION',
          explanation: 'Miskonsepsi penafsiran representasi grafik: Menyamakan domain sebagai batas ketinggian visual pada sumbu vertikal.'
        },
        {
          id: 'q2_rsn_c',
          text: 'Semua fungsi matematika selalu menerima semua nilai x apa pun tanpa syarat kecuali dinyatakan eksplisit oleh soal.',
          isCorrect: false,
          misconceptionCode: 'MC_DOMAIN_RESTRICTION_OMISSION',
          explanation: 'Miskonsepsi: Mengira bahwa domain alami dari ekspresi aljabar selalu mencakup seluruh ℝ.'
        },
        {
          id: 'q2_rsn_d',
          text: 'Nilai Range diperoleh dengan mencari pembuat nol dari pembilang 4.',
          isCorrect: false,
          explanation: 'Kekeliruan aljabar: Pembilang 4 adalah konstanta tetap bukan nol.'
        }
      ]
    }
  },
  {
    id: 'q3',
    conceptArea: 'TRANSFORMASI_PARAMETER',
    title: 'Item 3: Perubahan Parameter & Arah Pergeseran Translasi Grafik',
    tier1: {
      prompt: 'Diberikan fungsi kuadrat dasar g(x) = x². Jika fungsi tersebut diubah menjadi f(x) = (x - 3)² + 2, bagaimana perubahan posisi grafik f(x) terhadap grafik g(x)?',
      mathExpression: 'f(x) = (x - 3)² + 2',
      graphType: 'quadratic',
      options: [
        {
          id: 'q3_opt_a',
          text: 'Grafik bergeser 3 satuan ke KANAN dan 2 satuan ke ATAS',
          isCorrect: true,
          explanation: 'Tepat! Bentuk puncak f(x) = a(x - h)² + k memiliki titik puncak di (h, k) = (3, 2), sehingga bergeser ke kanan 3 satuan dan ke atas 2 satuan.'
        },
        {
          id: 'q3_opt_b',
          text: 'Grafik bergeser 3 satuan ke KIRI dan 2 satuan ke ATAS',
          isCorrect: false,
          misconceptionCode: 'MC_HORIZONTAL_SHIFT_INVERSION',
          explanation: 'Miskonsepsi umum: Mengasosiasikan tanda negatif (-3) di dalam kurung dengan pergeseran ke arah sumbu-x negatif (kiri).'
        },
        {
          id: 'q3_opt_c',
          text: 'Grafik bergeser 3 satuan ke KIRI dan 2 satuan ke BAWAH',
          isCorrect: false,
          misconceptionCode: 'MC_HORIZONTAL_SHIFT_INVERSION',
          explanation: 'Miskonsepsi: Membalik arah pergeseran translasi baik horizontal maupun vertikal.'
        },
        {
          id: 'q3_opt_d',
          text: 'Bentuk kurva menjadi lebih sempit tetapi puncaknya tetap berada di titik (0, 0)',
          isCorrect: false,
          explanation: 'Miskonsepsi: Mencampuradukkan translasi koordinat dengan peregangan / kompresi kurva.'
        }
      ]
    },
    tier3: {
      prompt: 'Pilihlah satu alasan matematis yang paling mendasari pilihan jawaban Anda di atas:',
      reasons: [
        {
          id: 'q3_rsn_a',
          text: 'Titik puncak tercapai ketika ekspresi di dalam kurung bernilai nol, yaitu saat x - 3 = 0 atau x = +3, sehingga nilai x harus bertambah 3 untuk menghasilkan output kuadrat yang sama, ditambah 2 ke arah vertikal.',
          isCorrect: true,
          explanation: 'Alasan sahih: Pergeseran horizontal f(x - h) melawan tanda karena x harus bernilai +h agar input ke fungsi kuadrat bernilai nol.'
        },
        {
          id: 'q3_rsn_b',
          text: 'Karena terdapat tanda minus (-3), maka secara otomatis posisi kurva bergerak ke arah sumbu negatif (arah kiri).',
          isCorrect: false,
          misconceptionCode: 'MC_HORIZONTAL_SHIFT_INVERSION',
          explanation: 'Miskonsepsi intuisi langsung: Menyamakan tanda aljabar minus di dalam argumen fungsi dengan arah translasi sumbu koordinat.'
        },
        {
          id: 'q3_rsn_c',
          text: 'Konstanta di dalam kurung selalu mengatur pergeseran vertikal pada sumbu-y.',
          isCorrect: false,
          misconceptionCode: 'MC_DOMAIN_RANGE_INVERSION',
          explanation: 'Miskonsepsi: Tertukarnya peran parameter di dalam argumen f(x-h) dengan parameter di luar f(x)+k.'
        },
        {
          id: 'q3_rsn_d',
          text: 'Perubahan parameter tidak pernah mengubah posisi koordinat puncak grafik parabola.',
          isCorrect: false,
          explanation: 'Kekeliruan pemahaman: Parameter (h, k) secara langsung memetakan translasi puncak parabola.'
        }
      ]
    }
  },
  {
    id: 'q4',
    conceptArea: 'NOTASI_INTERPRETASI',
    title: 'Item 4: Penafsiran Notasi Fungsi f(x) dan Evaluasi Argumen f(a)',
    tier1: {
      prompt: 'Jika f(x) = 2x + 1, apakah arti dari penulisan notasi f(4) dan berapakah nilainya?',
      mathExpression: 'f(x) = 2x + 1  ⇒  f(4) = ?',
      graphType: 'linear',
      options: [
        {
          id: 'q4_opt_a',
          text: 'f(4) adalah nilai fungsi ketika masukan x = 4, yaitu 2(4) + 1 = 9',
          isCorrect: true,
          explanation: 'Tepat! Notasi f(4) melambangkan pemetaan fungsi f dengan argumen masukan 4 menghasilkan keluaran 9.'
        },
        {
          id: 'q4_opt_b',
          text: 'f(4) berarti variabel aljabar f dikalikan dengan angka 4, menghasilkan perkalian 4f',
          isCorrect: false,
          misconceptionCode: 'MC_NOTATION_MULTIPLICATION',
          explanation: 'Miskonsepsi notasi (Tall & Bakar): Mengira huruf f adalah variabel pengali aljabar seperti 2(4) = 8 alih-alih nama fungsi pemeta.'
        },
        {
          id: 'q4_opt_c',
          text: 'f(4) adalah gradien atau kemiringan garis yang bernilai 4',
          isCorrect: false,
          explanation: 'Miskonsepsi: Menyamakan argumen masukan x dengan kemiringan garis (slope/gradien m = 2).'
        },
        {
          id: 'q4_opt_d',
          text: 'f(4) selalu menghasilkan nilai nol karena 4 adalah akar penyelesaian persamaan',
          isCorrect: false,
          explanation: 'Miskonsepsi: Mengacaukan evaluasi fungsi f(a) dengan pencarian akar f(x) = 0.'
        }
      ]
    },
    tier3: {
      prompt: 'Pilihlah satu alasan matematis yang paling mendasari pilihan jawaban Anda di atas:',
      reasons: [
        {
          id: 'q4_rsn_a',
          text: 'Notasi f(x) menunjukkan suatu aturan mesin pemetaan di mana angka di dalam kurung disubstitusikan ke setiap variabel x pada formula untuk menghasilkan koordinat titik (4, 9).',
          isCorrect: true,
          explanation: 'Alasan sahih: Kurung pada f(...) menunjukkan argumen masukan fungsi, bukan operasi perkalian numerik f × x.'
        },
        {
          id: 'q4_rsn_b',
          text: 'Dalam aljabar matematika, tanda kurung yang berdampingan dengan huruf selalu menandakan operasi perkalian distributif seperti f(x) = f × x.',
          isCorrect: false,
          misconceptionCode: 'MC_NOTATION_MULTIPLICATION',
          explanation: 'Miskonsepsi generalisasi aljabar berlebih: Memperluas aturan kurung perkalian variabel tanpa mengenali konteks lambang fungsi.'
        },
        {
          id: 'q4_rsn_c',
          text: 'Huruf f selalu bernilai konstan 1 sehingga f(4) = 1 × 4 = 4.',
          isCorrect: false,
          misconceptionCode: 'MC_NOTATION_MULTIPLICATION',
          explanation: 'Miskonsepsi: Menganggap lambang fungsi f sebagai variabel yang bernilai 1.'
        },
        {
          id: 'q4_rsn_d',
          text: 'Nilai dari f(4) hanya bisa ditentukan jika kita sudah mengetahui nilai grafik y pada saat x = 0.',
          isCorrect: false,
          explanation: 'Kekeliruan konseptual: Formula analitis f(x) sudah cukup lengkap untuk mengevaluasi f(a).'
        }
      ]
    }
  },
  {
    id: 'q5',
    conceptArea: 'TURUNAN_FUNGSI',
    title: 'Item 5: Makna Geometris Turunan f\'(a) & Garis Singgung Kurva',
    tier1: {
      prompt: 'Diberikan fungsi kuadrat f(x) = x² - 4x + 3. Berapakah nilai turunan f\'(1) dan apakah arti geometris nilai tersebut pada grafik fungsi?',
      mathExpression: 'f(x) = x² - 4x + 3  ⇒  f\'(1) = ?',
      graphType: 'quadratic',
      options: [
        {
          id: 'q5_opt_a',
          text: 'f\'(1) = -2, yang merupakan gradien (kemiringan) garis singgung kurva di titik (1, 0)',
          isCorrect: true,
          explanation: 'Tepat! Rumus turunan f\'(x) = 2x - 4. Pada x = 1, nilai f\'(1) = 2(1) - 4 = -2, yang menyatakan kemiringan sesaat garis singgung di titik (1, f(1)) = (1, 0).'
        },
        {
          id: 'q5_opt_b',
          text: 'f\'(1) = 0, karena nilai fungsi di titik tersebut adalah f(1) = 1² - 4(1) + 3 = 0',
          isCorrect: false,
          misconceptionCode: 'MC_DERIVATIVE_TANGENT_CONFUSION',
          explanation: 'Miskonsepsi klasik kalkulus: Menyamakan nilai turunan f\'(a) dengan nilai ketinggian posisi fungsi f(a).'
        },
        {
          id: 'q5_opt_c',
          text: 'f\'(1) = -2, yang berarti grafik fungsi memotong sumbu-y di koordinat (0, -2)',
          isCorrect: false,
          misconceptionCode: 'MC_DERIVATIVE_SIGN_VALUE_CONFUSION',
          explanation: 'Miskonsepsi: Mengacaukan kemiringan (gradien) garis singgung dengan titik potong sumbu koordinat.'
        },
        {
          id: 'q5_opt_d',
          text: 'f\'(1) tidak dapat dihitung karena pada titik x = 1 kurva memotong sumbu-x',
          isCorrect: false,
          explanation: 'Kekeliruan konsep: Titik potong sumbu-x (akar fungsi) tetap memiliki garis singgung dan turunan yang terdefinisi dengan sempurna.'
        }
      ]
    },
    tier3: {
      prompt: 'Pilihlah satu alasan matematis yang paling mendasari pilihan jawaban Anda di atas:',
      reasons: [
        {
          id: 'q5_rsn_a',
          text: 'Secara geometris, turunan pertama f\'(a) didefinisikan sebagai limit gradien garis sekan saat interval h mendekati nol, menghasilkan kemiringan tepat satu garis singgung pada kurva di titik (a, f(a)).',
          isCorrect: true,
          explanation: 'Alasan sahih: f\'(a) = lim[h→0] (f(a+h) - f(a))/h adalah laju perubahan sesaat / gradien garis singgung.'
        },
        {
          id: 'q5_rsn_b',
          text: 'Nilai turunan fungsi di titik x = a selalu bernilai sama dengan substitusi langsung nilai fungsi f(a).',
          isCorrect: false,
          misconceptionCode: 'MC_DERIVATIVE_TANGENT_CONFUSION',
          explanation: 'Miskonsepsi: Menyamakan operator turunan d/dx dengan evaluasi fungsi langsung f(a).'
        },
        {
          id: 'q5_rsn_c',
          text: 'Garis singgung kurva didefinisikan sebagai garis lurus yang hanya boleh menyentuh grafik di tepat satu titik di seluruh bidang Cartesius dan tidak boleh memotong kurva di bagian lain.',
          isCorrect: false,
          misconceptionCode: 'MC_DERIVATIVE_TANGENT_CONFUSION',
          explanation: 'Miskonsepsi prototipe lingkaran Euclid: Pada kurva umum kalkulus (misal kubik), garis singgung di satu titik lokal bisa saja memotong kurva di titik lain.'
        },
        {
          id: 'q5_rsn_d',
          text: 'Turunan pertama hanya berfungsi untuk mencari nilai titik puncak maksimum atau minimum kurva, bukan untuk titik lain.',
          isCorrect: false,
          explanation: 'Miskonsepsi pembatasan konsep: Turunan terdefinisi di setiap titik kurva yang terdiferensialkan, bukan hanya saat f\'(x) = 0.'
        }
      ]
    }
  },
  {
    id: 'q6',
    conceptArea: 'TURUNAN_FUNGSI',
    title: 'Item 6: Keterdiferensialan vs Kontinuitas & Titik Sudut/Tajam',
    tier1: {
      prompt: 'Perhatikan fungsi nilai mutlak f(x) = |x|. Grafik fungsi ini kontinu (tersambung tanpa terputus) di seluruh himpunan bilangan real ℝ. Apakah fungsi f(x) = |x| memiliki turunan di titik x = 0?',
      mathExpression: 'f(x) = |x|  pada  x = 0',
      graphType: 'absolute',
      options: [
        {
          id: 'q6_opt_a',
          text: 'Tidak memiliki turunan di x = 0 (tidak terturunkan / non-differentiable)',
          isCorrect: true,
          explanation: 'Tepat! Grafik f(x) = |x| memiliki titik tajam (corner point) di (0,0). Turunan dari kiri bernilai -1 sedangkan turunan dari kanan bernilai +1, sehingga limit turunan di x = 0 tidak ada.'
        },
        {
          id: 'q6_opt_b',
          text: 'Memiliki turunan f\'(0) = 0 karena fungsi tersebut kontinu dan mencapai nilai terendah di (0,0)',
          isCorrect: false,
          misconceptionCode: 'MC_CONTINUITY_IMPLIES_DIFF',
          explanation: 'Miskonsepsi fundamental kalkulus: Menganggap bahwa jika suatu fungsi kontinu, maka fungsi tersebut pasti otomatis memiliki turunan di titik tersebut.'
        },
        {
          id: 'q6_opt_c',
          text: 'Memiliki dua nilai turunan sekaligus di x = 0, yaitu f\'(0) = 1 dan f\'(0) = -1',
          isCorrect: false,
          misconceptionCode: 'MC_CONTINUITY_IMPLIES_DIFF',
          explanation: 'Miskonsepsi: Nilai turunan di suatu titik harus tunggal. Jika limit kiri dan kanan berbeda, maka turunan dikatakan tidak ada.'
        },
        {
          id: 'q6_opt_d',
          text: 'Memiliki turunan hanya jika fungsi didekati dari arah sumbu-x positif',
          isCorrect: false,
          explanation: 'Miskonsepsi: Syarat keterdiferensialan di titik x=0 mewajibkan kedua arah kiri dan kanan menghasilkan nilai yang sama.'
        }
      ]
    },
    tier3: {
      prompt: 'Pilihlah satu alasan matematis yang paling mendasari pilihan jawaban Anda di atas:',
      reasons: [
        {
          id: 'q6_rsn_a',
          text: 'Limit turunan sepihak dari kiri bernilai -1 sedangkan limit turunan sepihak dari kanan bernilai +1. Karena turunan kiri ≠ turunan kanan, maka limit turunan tidak ada dan kurva memiliki sudut tajam.',
          isCorrect: true,
          explanation: 'Alasan sahih: Syarat keterdiferensialan adalah kesamaan turunan sepihak f\'_-(a) = f\'_+(a).'
        },
        {
          id: 'q6_rsn_b',
          text: 'Setiap grafik fungsi yang dapat digambar tanpa mengangkat pensil (kontinu) dijamin pasti dapat diturunkan di seluruh titik domainnya.',
          isCorrect: false,
          misconceptionCode: 'MC_CONTINUITY_IMPLIES_DIFF',
          explanation: 'Miskonsepsi: Kontinuitas adalah syarat perlu tetapi bukan syarat cukup bagi keterdiferensialan (Continuity does NOT imply differentiability).'
        },
        {
          id: 'q6_rsn_c',
          text: 'Sebuah fungsi dapat memiliki lebih dari satu garis singgung dengan kemiringan berbeda di titik sudut yang sama.',
          isCorrect: false,
          misconceptionCode: 'MC_CONTINUITY_IMPLIES_DIFF',
          explanation: 'Miskonsepsi: Garis singgung kurva harus tunggal; di titik tajam tidak ada garis singgung tunggal yang terdefinisi.'
        },
        {
          id: 'q6_rsn_d',
          text: 'Nilai turunan di titik minimum kurva selalu bernilai nol tanpa perlu memeriksa limit kiri dan kanan.',
          isCorrect: false,
          explanation: 'Miskonsepsi Teorema Fermat: Teorema bahwa f\'(c) = 0 di titik ekstrim hanya berlaku jika f terdiferensialkan di c.'
        }
      ]
    }
  }
];
