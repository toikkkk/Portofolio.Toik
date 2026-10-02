// skills-content.ts
// Isi halaman Skills (layout ala indeks kapabilitas), diambil dari dependency repo publik github.com/toikkkk.
// Diverifikasi dari requirements.txt / package.json / pubspec.yaml / composer.json / Dockerfile tiap repo.
//
// proof:
//   'repo'   = terbukti di repo publik (dependency/file ada). Aman diklaim.
//   'course' = dari kuliah/praktikum/CV, TIDAK ditemukan di repo publik. Boleh dipakai, tapi label sebagai
//              "coursework" atau tautkan repo/laporan bila ada. Jangan dipamerkan sebagai pengalaman produksi.
//   'work'   = pengalaman kerja/freelance (mis. video editing), bukti berupa portofolio karya, bukan repo.
//
// icon = slug simple-icons / react-icons (huruf kecil). Jika tidak ada ikonnya, tampilkan monogram.

export type Proof = 'repo' | 'course' | 'work';

export type Tool = {
  name: string;
  icon?: string;
  proof: Proof;
  repos?: string[]; // id dari REPOS di bawah
};

export type Capability = {
  id: string;
  title: string;
  blurb: string;
  tools: Tool[];
};

export type Repo = {
  id: string;
  name: string; // nama repo di GitHub
  title: string; // judul tampilan
  url: string;
  summary: string;
  stack: string[];
};

const GH = 'https://github.com/toikkkk/';

export const REPOS: Record<string, Repo> = {
  galeria: {
    id: 'galeria', name: 'Galeria', title: 'GALERIA', url: GH + 'Galeria',
    summary: 'Marketplace seni dengan verifikasi keaslian berbasis AI dan pencarian visual.',
    stack: ['FastAPI', 'PostgreSQL', 'pgvector', 'ONNX Runtime', 'PyTorch', 'OpenCV', 'ImageHash', 'Flutter'],
  },
  sipeduli: {
    id: 'sipeduli', name: 'crime_reporting', title: 'SIPEDULI', url: GH + 'crime_reporting',
    summary: 'Portal pelaporan kejahatan dengan skor risiko otomatis berbasis ML.',
    stack: ['FastAPI', 'SQLAlchemy', 'Alembic', 'Supabase', 'scikit-learn', 'SHAP', 'MLflow', 'NLTK', 'Sastrawi', 'Next.js', 'Leaflet', 'Docker Compose'],
  },
  apbd: {
    id: 'apbd', name: 'Rekomendasi-Alokasi-Anggaran-Jawa-Timur', title: 'Rekomendasi Alokasi Anggaran Jawa Timur', url: GH + 'Rekomendasi-Alokasi-Anggaran-Jawa-Timur',
    summary: 'Sistem pendukung keputusan alokasi anggaran daerah (API + dashboard).',
    stack: ['FastAPI', 'scikit-learn', 'pandas', 'joblib', 'React', 'Vite', 'Tailwind CSS', 'Recharts', 'Railway'],
  },
  sentiment: {
    id: 'sentiment', name: 'Sentiment_Banking', title: 'Sentiment Banking', url: GH + 'Sentiment_Banking',
    summary: 'Analisis sentimen ulasan nasabah perbankan dengan NLP dan dashboard.',
    stack: ['PyTorch', 'Transformers', 'datasets', 'scikit-learn', 'Streamlit', 'Plotly'],
  },
  edupass: {
    id: 'edupass', name: 'edupass', title: 'EduPass', url: GH + 'edupass',
    summary: 'Prediksi peluang kelulusan SNBP dengan ML, backend Django, frontend Next.js.',
    stack: ['Django REST', 'PostgreSQL', 'scikit-learn', 'Next.js', 'Tailwind CSS', 'Radix UI', 'Recharts', 'Framer Motion'],
  },
  interview: {
    id: 'interview', name: 'AI-Interview-Simulation', title: 'AI Interview Simulation', url: GH + 'AI-Interview-Simulation',
    summary: 'Simulasi wawancara kerja berbasis AI dengan pembuatan pertanyaan dan analisis jawaban.',
    stack: ['Flask', 'spaCy', 'scikit-learn', 'OpenAI API', 'React', 'Vite', 'Chart.js'],
  },
  chatbot: {
    id: 'chatbot', name: 'chatbot-buket', title: 'Chatbot Buket', url: GH + 'chatbot-buket',
    summary: 'Chatbot toko buket bunga memakai LLM via Groq.',
    stack: ['Python', 'Groq API', 'Streamlit'],
  },
  gestur: {
    id: 'gestur', name: 'gestur-music', title: 'Gestur Music', url: GH + 'gestur-music',
    summary: 'Musik interaktif yang dikendalikan gestur tangan lewat kamera.',
    stack: ['MediaPipe Tasks Vision', 'JavaScript', 'Vite', 'Vercel'],
  },
  listrik: {
    id: 'listrik', name: 'Hitung-Listriku-apps', title: 'Hitung Listriku', url: GH + 'Hitung-Listriku-apps',
    summary: 'Aplikasi mobile estimasi tagihan listrik bulanan; backend FastAPI.',
    stack: ['Flutter', 'Dart', 'FastAPI', 'go_router'],
  },
  mobil: {
    id: 'mobil', name: 'prediksi-harga-mobil', title: 'Prediksi Harga Mobil Bekas', url: GH + 'prediksi-harga-mobil',
    summary: 'Model regresi harga mobil bekas yang dibungkus aplikasi Flask dan Docker.',
    stack: ['Flask', 'scikit-learn', 'pandas', 'matplotlib', 'Docker', 'Docker Compose'],
  },
  laravel: {
    id: 'laravel', name: 'punya-taya', title: 'Punya Taya', url: GH + 'punya-taya',
    summary: 'Aplikasi web Laravel (PHP/Blade).',
    stack: ['Laravel', 'PHP', 'Blade', 'Vite'],
  },
  seporsi: {
    id: 'seporsi', name: 'Catalog-Seporsi', title: 'Katalog Seporsi', url: GH + 'Catalog-Seporsi',
    summary: 'Situs katalog UMKM (pekerjaan freelance).',
    stack: ['HTML', 'CSS', 'JavaScript'],
  },
  sunrise: {
    id: 'sunrise', name: 'sunrise-travels', title: 'Sunrise Tour & Travels', url: GH + 'sunrise-travels',
    summary: 'Situs agen perjalanan dengan formulir yang tersambung Google Apps Script (freelance).',
    stack: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'Google Apps Script'],
  },
};

export const capabilities: Capability[] = [
  {
    id: 'ml',
    title: 'Machine Learning & Modeling',
    blurb: 'Regresi, klasifikasi, dan penjelasan model, dilacak dari notebook sampai model tersimpan.',
    tools: [
      { name: 'Python', icon: 'python', proof: 'repo', repos: ['sipeduli', 'galeria', 'apbd', 'sentiment', 'mobil'] },
      { name: 'scikit-learn', icon: 'scikitlearn', proof: 'repo', repos: ['sipeduli', 'apbd', 'edupass', 'mobil'] },
      { name: 'pandas', icon: 'pandas', proof: 'repo', repos: ['apbd', 'mobil', 'sentiment'] },
      { name: 'NumPy', icon: 'numpy', proof: 'repo', repos: ['apbd', 'galeria', 'mobil'] },
      { name: 'PyTorch', icon: 'pytorch', proof: 'repo', repos: ['sentiment', 'galeria'] },
      { name: 'SHAP', proof: 'repo', repos: ['sipeduli'] },
      { name: 'MLflow', icon: 'mlflow', proof: 'repo', repos: ['sipeduli'] },
      { name: 'joblib', proof: 'repo', repos: ['sipeduli', 'apbd', 'edupass'] },
      { name: 'ONNX Runtime', icon: 'onnx', proof: 'repo', repos: ['galeria'] },
      { name: 'Matplotlib', icon: 'matplotlib', proof: 'repo', repos: ['mobil', 'sentiment'] },
      { name: 'TensorFlow', icon: 'tensorflow', proof: 'course' },
      { name: 'Optuna', proof: 'course' },
    ],
  },
  {
    id: 'nlp',
    title: 'NLP & Text Analytics',
    blurb: 'Analisis sentimen, pemrosesan teks Bahasa Indonesia, dan aplikasi berbasis LLM.',
    tools: [
      { name: 'Hugging Face Transformers', icon: 'huggingface', proof: 'repo', repos: ['sentiment'] },
      { name: 'PyTorch', icon: 'pytorch', proof: 'repo', repos: ['sentiment'] },
      { name: 'NLTK', proof: 'repo', repos: ['sipeduli'] },
      { name: 'Sastrawi', proof: 'repo', repos: ['sipeduli'] },
      { name: 'spaCy', icon: 'spacy', proof: 'repo', repos: ['interview'] },
      { name: 'TF-IDF', proof: 'repo', repos: ['sipeduli'] },
      { name: 'WordCloud', proof: 'repo', repos: ['interview'] },
      { name: 'Groq API', proof: 'repo', repos: ['chatbot'] },
      { name: 'OpenAI API', icon: 'openai', proof: 'repo', repos: ['interview'] },
    ],
  },
  {
    id: 'vision',
    title: 'Computer Vision & Similarity Search',
    blurb: 'Verifikasi keaslian gambar, pencarian visual berbasis vektor, dan kontrol lewat gestur.',
    tools: [
      { name: 'OpenCV', icon: 'opencv', proof: 'repo', repos: ['galeria'] },
      { name: 'ImageHash', proof: 'repo', repos: ['galeria'] },
      { name: 'Pillow', proof: 'repo', repos: ['galeria', 'sipeduli'] },
      { name: 'torchvision', icon: 'pytorch', proof: 'repo', repos: ['galeria'] },
      { name: 'Albumentations', proof: 'repo', repos: ['galeria'] },
      { name: 'ONNX Runtime', icon: 'onnx', proof: 'repo', repos: ['galeria'] },
      { name: 'pgvector', icon: 'postgresql', proof: 'repo', repos: ['galeria'] },
      { name: 'MediaPipe', icon: 'mediapipe', proof: 'repo', repos: ['gestur'] },
    ],
  },
  {
    id: 'backend',
    title: 'Backend, API & Database',
    blurb: 'REST API untuk model dan aplikasi, dengan migrasi skema dan autentikasi.',
    tools: [
      { name: 'FastAPI', icon: 'fastapi', proof: 'repo', repos: ['sipeduli', 'galeria', 'apbd', 'listrik'] },
      { name: 'Flask', icon: 'flask', proof: 'repo', repos: ['mobil', 'interview'] },
      { name: 'Django REST', icon: 'django', proof: 'repo', repos: ['edupass'] },
      { name: 'Laravel', icon: 'laravel', proof: 'repo', repos: ['laravel'] },
      { name: 'PostgreSQL', icon: 'postgresql', proof: 'repo', repos: ['sipeduli', 'galeria', 'edupass'] },
      { name: 'SQLAlchemy', icon: 'sqlalchemy', proof: 'repo', repos: ['sipeduli', 'galeria'] },
      { name: 'Alembic', proof: 'repo', repos: ['sipeduli', 'galeria'] },
      { name: 'Supabase', icon: 'supabase', proof: 'repo', repos: ['sipeduli'] },
      { name: 'Pydantic', icon: 'pydantic', proof: 'repo', repos: ['sipeduli', 'galeria', 'listrik'] },
      { name: 'JWT Auth', proof: 'repo', repos: ['sipeduli'] },
      { name: 'MySQL', icon: 'mysql', proof: 'course' },
    ],
  },
  {
    id: 'data',
    title: 'Data Engineering & MLOps',
    blurb: 'Pipeline data, kontainer, dan deploy. Bagian big data berasal dari praktikum kampus.',
    tools: [
      { name: 'Docker', icon: 'docker', proof: 'repo', repos: ['sipeduli', 'mobil'] },
      { name: 'Docker Compose', icon: 'docker', proof: 'repo', repos: ['sipeduli', 'mobil'] },
      { name: 'MLflow', icon: 'mlflow', proof: 'repo', repos: ['sipeduli'] },
      { name: 'Git & GitHub', icon: 'git', proof: 'repo' },
      { name: 'Railway', icon: 'railway', proof: 'repo', repos: ['apbd'] },
      { name: 'Vercel', icon: 'vercel', proof: 'repo', repos: ['gestur', 'edupass'] },
      { name: 'Hadoop', icon: 'apachehadoop', proof: 'course' },
      { name: 'Hive', icon: 'apachehive', proof: 'course' },
      { name: 'Spark', icon: 'apachespark', proof: 'course' },
      { name: 'Airflow', icon: 'apacheairflow', proof: 'course' },
      { name: 'Pentaho', proof: 'course' },
    ],
  },
  {
    id: 'web',
    title: 'Web & Mobile Apps',
    blurb: 'Antarmuka untuk hasil model: dashboard, peta, aplikasi web, dan aplikasi mobile.',
    tools: [
      { name: 'Next.js', icon: 'nextdotjs', proof: 'repo', repos: ['sipeduli', 'edupass'] },
      { name: 'React', icon: 'react', proof: 'repo', repos: ['apbd', 'edupass', 'interview'] },
      { name: 'Vite', icon: 'vite', proof: 'repo', repos: ['apbd', 'gestur', 'interview'] },
      { name: 'TypeScript', icon: 'typescript', proof: 'repo', repos: ['sipeduli', 'edupass'] },
      { name: 'Tailwind CSS', icon: 'tailwindcss', proof: 'repo', repos: ['sipeduli', 'apbd', 'edupass', 'sunrise'] },
      { name: 'Recharts', proof: 'repo', repos: ['apbd', 'edupass'] },
      { name: 'Chart.js', icon: 'chartdotjs', proof: 'repo', repos: ['interview'] },
      { name: 'Leaflet', icon: 'leaflet', proof: 'repo', repos: ['sipeduli'] },
      { name: 'Radix UI', icon: 'radixui', proof: 'repo', repos: ['edupass'] },
      { name: 'Framer Motion', icon: 'framer', proof: 'repo', repos: ['edupass'] },
      { name: 'Streamlit', icon: 'streamlit', proof: 'repo', repos: ['sentiment', 'chatbot'] },
      { name: 'Flutter', icon: 'flutter', proof: 'repo', repos: ['listrik', 'galeria'] },
      { name: 'Figma', icon: 'figma', proof: 'course' },
    ],
  },
  {
    id: 'media',
    title: 'Video & Motion',
    blurb: 'Penyuntingan video dan motion graphics untuk konten dan materi presentasi.',
    tools: [
      { name: 'Adobe Premiere Pro', icon: 'adobepremierepro', proof: 'work' },
      { name: 'Adobe After Effects', icon: 'adobeaftereffects', proof: 'work' },
    ],
  },
];

// Panel "How I deliver" (padanan "Project delivery") — 4 grup kecil
export const delivery = [
  { title: 'Build and ship', tools: ['Docker', 'Docker Compose', 'Vercel', 'Railway', 'Git & GitHub'] },
  { title: 'Data and dashboards', tools: ['Streamlit', 'Recharts', 'Plotly', 'Chart.js', 'Leaflet'] },
  { title: 'Docs and design', tools: ['README', 'DESIGN.md', 'Figma', 'Premiere Pro', 'After Effects'] },
  { title: 'AI-assisted workflow', tools: ['Claude Code', 'CLAUDE.md'] }, // CLAUDE.md ada di 4 repo: Galeria, crime_reporting, APBD, my-vercel-project
];

// Kartu "Core direction" + strip bukti 3 sel. Angka diambil dari audit repo; perbarui jika repo bertambah.
export const skillsCore = {
  badge: 'Focus',
  title: 'Data and ML first, with the app around it.',
  text: 'Most of my public repos start with a model or a dataset and end with something people can open: an API, a dashboard, or a mobile app.',
  evidence: [
    { label: 'Public repos', value: '13 projects' },
    { label: 'Main language', value: 'Python' },
    { label: 'Delivery', value: 'API, dashboard, Docker' },
  ],
};
