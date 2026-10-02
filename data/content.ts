export const profile = {
  name: 'Moch Toriq Hisam',
  short: 'Toriq',
  email: 'thoriqhisam@gmail.com',
  phone: '0857-3644-9464',
  phoneHref: 'tel:+6285736449464',
  github: 'https://github.com/toikkkk',
  githubHandle: 'toikkkk',
  linkedin: 'https://www.linkedin.com/in/toriq-hisam',
  linkedinHandle: 'toriq-hisam',
  // Fill in the full profile URL (https://instagram.com/...) to show the Instagram button in the header.
  instagram: '',
  city: 'Banyuwangi',
  location: 'Banyuwangi, East Java, Indonesia',
  cv: '/CV_Moch_Toriq_Hisam.pdf',
};

// "About me" block on Home. NLP is deliberately left out of Focus until a project that Toik led is listed
// in `projects` and on the CV. Status still needs the internship start date and location (see CLAUDE.md).
export const about = {
  eyebrow: 'About me',
  headingLead: 'Student who ships ',
  headingMark: 'models that run.',
  summary: 'I build data and ML projects end to end: preprocessing, modeling, an API, a dashboard, and a Dockerized pipeline.',
  facts: [
    { label: 'Studying', value: 'D4 Applied Data Science, PENS Surabaya' },
    { label: 'Focus', value: 'Machine learning, full-stack, data pipelines' },
    { label: 'Location', value: profile.location },
    { label: 'Status', value: 'Looking for an internship' },
  ],
  moreLabel: 'More about me',
  viewCvLabel: 'View CV',
  downloadCvLabel: 'Download CV',
  hintLabel: 'Drag the card',
  githubLabel: 'GitHub profile',
  linkedinLabel: 'LinkedIn profile',
};

// Text printed on the lanyard card (front and back) and on its static fallback.
export const card = {
  kicker: 'PORTFOLIO / 2026',
  strap: 'TORIQ HISAM',
  nameLines: ['Moch Toriq', 'Hisam'],
  role: 'Applied Data Science',
  skills: 'ML  ·  Full-stack  ·  Data pipelines',
  school: 'PENS SURABAYA',
  program: 'D4 SAINS DATA TERAPAN',
  backTitle: ['Open to', 'internship.'],
  backText: ['Data, machine learning', 'and software roles.'],
  linkedinLine: 'linkedin.com/in/toriq-hisam',
  githubLine: 'github.com/toikkkk',
};

export const cvPage = {
  eyebrow: 'Curriculum vitae',
  title: 'My ',
  titleMark: 'CV.',
  lead: 'Read it here, or save a copy.',
  downloadLabel: 'Download CV',
  newTabLabel: 'Open in new tab',
  backLabel: 'Back to home',
  loading: 'Loading CV...',
  fallback: 'The CV could not be loaded here.',
  frameTitle: 'Moch Toriq Hisam, curriculum vitae (PDF)',
};

export const rotatingWords = ['machine learning systems', 'NLP pipelines', 'full-stack products', 'data pipelines'];

export const capabilities = [
  { tag: 'ML + NLP', title: 'Models with reasons', text: 'Indonesian-language text models tuned with Optuna, tracked in MLflow, explained with SHAP.' },
  { tag: 'Vision', title: 'Search by image', text: 'Fine-tuned ConvNeXt, exported to ONNX and served with pgvector similarity search.' },
  { tag: 'Full-stack', title: 'Interface to database', text: 'FastAPI and Next.js apps with role-based access, deployed with Docker.' },
  { tag: 'Data eng.', title: 'Pipelines that load', text: 'Hadoop, Hive, PySpark, Airflow and Pentaho ETL into star schemas.' },
];

export type Project = {
  slug: string;
  year: string;
  kind: string;
  title: string;
  subtitle: string;
  tags: string[];
  summary: string;
  flow: string[];
  highlights: string[];
  metrics?: { label: string; value: string }[];
  note?: string;
  stack: string[];
  links: { label: string; href: string }[];
  /** Only the name is known; the slide shows a notice instead of details. */
  pending?: boolean;
  /** Screenshot of the project's UI. Filled in automatically from public/projects/<slug>.(png|jpg|webp). */
  preview?: string;
};

export const projects: Project[] = [
  {
    slug: 'sipeduli',
    year: '2026',
    kind: 'Web + ML',
    title: 'SIPEDULI',
    subtitle: 'Crime reporting portal with AI risk scoring',
    tags: ['Team project', 'Deployed'],
    summary:
      'Citizens submit reports; an Indonesian-language NLP model scores how urgent each one is, and administrators triage from a dashboard with a map and a per-report explanation.',
    flow: ['2,413 news articles', 'K-Means risk labels', 'TF-IDF + 7 signals', 'Tree-ensemble regressor', 'SHAP explanation', 'FastAPI + Next.js admin'],
    highlights: [
      'Built the labels without manual annotation: K-Means clustering over 2,413 news articles produced a risk score for each.',
      'Features are a 3,000-term TF-IDF vector plus 7 hand-built text signals; hyperparameters tuned with Optuna (30 trials) and runs tracked in MLflow.',
      'Every prediction ships with a SHAP explanation so an administrator can see why a report ranked high.',
      'FastAPI REST API, Next.js admin dashboard with an incident map, and a four-service Docker Compose setup.',
    ],
    metrics: [
      { label: 'R² (held-out)', value: '0.958' },
      { label: 'RMSE', value: '4.21' },
    ],
    note: 'Scored against the K-Means-derived risk score, which is a proxy label and not human-annotated.',
    stack: ['Python', 'scikit-learn', 'Optuna', 'MLflow', 'SHAP', 'FastAPI', 'Next.js', 'Docker'],
    links: [
      { label: 'Open site', href: 'https://crime-reporting-sandy.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/toikkkk/crime_reporting' },
    ],
  },
  {
    slug: 'galeria',
    year: '2026',
    kind: 'Mobile + AI',
    title: 'GALERIA',
    subtitle: 'Art marketplace and auction with visual search',
    tags: ['Team of 4', 'ML engineer'],
    summary:
      'A marketplace for paintings where buyers can photograph an artwork and find similar ones. I built the Visual Search feature end to end, from model training to the camera screen in the app.',
    flow: ['Painting dataset', 'ConvNeXt fine-tuning', 'ONNX export', 'FastAPI + pgvector', 'Flutter camera search'],
    highlights: [
      'Fine-tuned ConvNeXt in PyTorch and tuned it with Optuna.',
      'Exported to ONNX and checked that outputs match the PyTorch model to within 1e-4.',
      'Similarity search over embeddings in PostgreSQL with pgvector, behind a FastAPI service.',
      'Integrated the camera flow into the Flutter app.',
    ],
    metrics: [
      { label: 'Macro-F1', value: '0.78' },
      { label: 'Accuracy', value: '0.80' },
      { label: 'Recall@1 (style)', value: '0.81' },
    ],
    stack: ['PyTorch', 'ConvNeXt', 'Optuna', 'ONNX', 'FastAPI', 'pgvector', 'Flutter'],
    links: [{ label: 'GitHub', href: 'https://github.com/toikkkk/Galeria' }],
  },
  {
    slug: 'apbd-jatim',
    year: '2026',
    kind: 'Recommender',
    title: 'APBD Jawa Timur',
    subtitle: 'Budget allocation recommendation system',
    tags: ['Coursework'],
    summary:
      'A decision-support dashboard that groups East Java regencies by spending profile and predicts the Human Development Index (IPM) so planners can test allocation changes.',
    flow: ['38 regencies and cities', 'K-Means clusters', 'Random Forest per cluster', 'IPM prediction', 'React what-if dashboard'],
    highlights: [
      'Clustered all 38 regencies and cities with K-Means.',
      'Trained one Random Forest per cluster to predict IPM.',
      'React dashboard with a what-if simulation: change an allocation and see the predicted effect.',
    ],
    stack: ['Python', 'scikit-learn', 'K-Means', 'Random Forest', 'React'],
    links: [
      { label: 'Open demo', href: 'https://rekomendasi-alokasi-anggaran-jawa-t.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/toikkkk/Rekomendasi-Alokasi-Anggaran-Jawa-Timur' },
    ],
  },
  {
    slug: 'psi-moc-portal',
    year: '2026',
    kind: 'Freelance',
    title: 'PSI & MOC Portal',
    subtitle: 'Process safety documents and change approvals',
    tags: ['Freelance', 'Private'],
    summary:
      'A document portal and Management of Change approval workflow for a regional terminal network, built for Pertamina Patra Niaga Regional Jatimbalinus.',
    flow: ['Excel SOP + risk formula', 'App workflow (8 stages)', 'Role-based access', 'Word / PDF export', 'Archive migration'],
    highlights: [
      'Covers 38+ terminals, with about 19 API routes and role-based access.',
      'Translated the client’s 8-stage MOC procedure and its Excel risk formula into an application workflow with Word and PDF export.',
      'Migrated about 2,980 archive files (9.2 GB) to cloud storage.',
      'Fixed N+1 queries: in a local stress test with 120 users, failed requests dropped from 98.3% to 0%.',
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Cloudflare R2'],
    links: [],
  },
  {
    slug: 'bigdata-dw',
    year: '',
    kind: 'Data engineering',
    title: 'Big Data & Data Warehouse',
    subtitle: 'Hadoop pipeline and Pentaho star schema',
    tags: ['Coursework'],
    summary:
      'Two practicums: a Dockerized big data pipeline from a relational database to analytics, and an ETL that loads a retail star schema.',
    flow: ['MySQL', 'Sqoop', 'HDFS', 'Hive', 'PySpark', 'Airflow schedule'],
    highlights: [
      'Dockerized Hadoop stack with Sqoop ingestion, Hive tables, PySpark jobs and Airflow orchestration.',
      'Pentaho ETL into a star schema with a fact table of 437,724 rows.',
    ],
    stack: ['Docker', 'Hadoop', 'Hive', 'PySpark', 'Airflow', 'Pentaho', 'MySQL'],
    links: [],
  },
  {
    slug: 'sampahku',
    year: '2025',
    kind: 'Mobile',
    title: 'SampahKU+',
    subtitle: 'Subscription waste pickup app prototype',
    tags: ['Team of 5', 'P2MW 2025'],
    summary:
      'A prototype for a subscription-based household waste pickup service, submitted to the Program Pembinaan Mahasiswa Wirausaha (P2MW). It passed campus-level selection.',
    flow: ['Customer subscribes', 'Driver is assigned', 'Pickup is confirmed', 'Admin monitors'],
    highlights: [
      'Three roles in one app: customer, driver and admin.',
      'Passed the campus selection stage; the funding stage was not secured.',
    ],
    stack: ['Figma', 'Mobile prototype'],
    links: [{ label: 'Open prototype', href: 'https://ruling-crimson-gbhvogtwdb.edgeone.app/prototype.html' }],
  },
  {
    slug: 'sunrise-travels',
    year: '2026',
    kind: 'Freelance',
    title: 'Sunrise Tour & Travel',
    subtitle: 'Booking website for an inter-city shuttle service',
    tags: ['Freelance', 'Live'],
    summary:
      'A booking site for an inter-city shuttle service in East Java. Passengers pick a route, date and seat count, and the business gets an automatic revenue recap.',
    flow: ['Route search', 'Booking form', 'Order to the operator', 'Revenue recap in Google Sheets'],
    highlights: [
      'Booking form with route, date and passenger count.',
      'Automatic revenue recap in Google Sheets.',
    ],
    stack: ['JavaScript', 'HTML', 'Tailwind CSS', 'Google Apps Script', 'Google Sheets', 'Vercel'],
    links: [
      { label: 'Open site', href: 'https://sunrise-travels-six.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/toikkkk/sunrise-travels' },
    ],
  },
  {
    slug: 'seporsi-catalog',
    year: '2026',
    kind: 'Freelance',
    title: 'Seporsi Catalog',
    subtitle: 'Catalog and ordering site for a frozen meal brand',
    tags: ['Freelance', 'Live'],
    summary:
      'A catalog and ordering site for a frozen home-cooked meal brand: customers browse the menu, fill the cart and send the order over WhatsApp.',
    flow: ['Catalog', 'Cart', 'Checkout form', 'WhatsApp order'],
    highlights: [
      'Product catalog and a preparation guide for each item.',
      'Shopping cart and a checkout form that sends the order to WhatsApp.',
    ],
    stack: ['JavaScript', 'HTML', 'CSS', 'Vercel'],
    links: [
      { label: 'Open site', href: 'https://catalog-seporsi.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/toikkkk/Catalog-Seporsi' },
    ],
  },
  // The entries below are still thin: only a repo link (and, for EduPass, a summary taken from its landing page)
  // is known. Fill in year, role, flow, highlights and stack; delete pending once a summary is written. Drop a screenshot at public/projects/<slug>.png
  // and it shows up in the preview frame automatically.
  {
    slug: 'sentiment-banking',
    year: '',
    kind: 'Sentiment analysis',
    title: 'Sentiment Banking',
    subtitle: 'Sentiment analysis of banking customer reviews',
    tags: [],
    summary:
      'Classifies banking customer reviews as positive, negative or neutral using NLP and machine learning, with a dashboard to explore the results.',
    flow: [],
    highlights: [],
    stack: ['Python'],
    links: [{ label: 'GitHub', href: 'https://github.com/toikkkk/Sentiment_Banking' }],
    pending: true,
  },
  {
    slug: 'edupass',
    year: '',
    kind: 'Web + ML',
    title: 'EduPass',
    subtitle: 'SNBP admission-chance predictor',
    tags: ['Live'],
    summary:
      'A web system that estimates the chance of a student passing the SNBP selection for Indonesian state universities, using machine learning on school, university and passing-grade data.',
    flow: [],
    highlights: [
      'Django backend on PostgreSQL, moved over from MongoDB through the Django ORM.',
      'Data management for schools, universities, passing grades and capacity, loaded from CSV files with an import script.',
      'Frontend deployed on Vercel.',
    ],
    stack: ['Python', 'Django', 'PostgreSQL', 'TypeScript', 'Vercel'],
    links: [
      { label: 'Open site', href: 'https://edupass-sigma.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/toikkkk/edupass' },
    ],
  },
  {
    slug: 'ai-interview-simulation',
    year: '',
    kind: 'AI',
    title: 'AI Interview Simulation',
    subtitle: 'Job interview practice with automatic feedback',
    tags: [],
    summary:
      'A job interview simulator: it generates interview questions automatically and gives feedback, to prepare for real interviews.',
    flow: [],
    highlights: [],
    stack: ['Python'],
    links: [{ label: 'GitHub', href: 'https://github.com/toikkkk/AI-Interview-Simulation' }],
    pending: true,
  },
  {
    slug: 'car-price-prediction',
    year: '',
    kind: 'ML',
    title: 'Used Car Price Prediction',
    subtitle: 'Price prediction for used cars',
    tags: [],
    summary:
      'A machine learning model that predicts used-car prices from features such as brand, year and mileage, with a small web app packaged in Docker.',
    flow: [],
    highlights: [],
    stack: ['Python', 'scikit-learn', 'Docker'],
    links: [{ label: 'GitHub', href: 'https://github.com/toikkkk/Prediksi-harga-mobil-bekas' }],
    pending: true,
  },
];

export const experience = [
  {
    when: 'Aug – Oct 2026',
    role: 'Full-Stack Developer',
    org: 'Pertamina Patra Niaga, Regional Jatimbalinus',
    kind: 'Freelance, remote',
    text: 'Built the PSI document portal and MOC approval workflow for 38+ terminals and migrated about 2,980 archive files (9.2 GB).',
  },
  {
    when: 'Mar – Sep 2026',
    role: 'Member, Public Relations Division',
    org: 'Himpunan Mahasiswa Teknik Informatika PENS',
    kind: 'Representative Body (BPA)',
    text: 'Public relations for the student association.',
  },
  {
    when: 'May – Jun 2026',
    role: 'Web Developer',
    org: 'Seporsi, Sunrise Tour & Travels',
    kind: 'Freelance, remote',
    text: 'Catalog, ordering and booking websites with WhatsApp checkout and an automatic revenue recap.',
  },
];

export const education = [
  {
    when: '2024 – 2028 (expected)',
    school: 'Politeknik Elektronika Negeri Surabaya (PENS)',
    degree: 'Diploma 4, Applied Data Science',
    text: 'GPA 3.6 / 4.00. Machine Learning, Big Data, MLOps, Data Warehouse, Web Services, Recommender Systems.',
  },
  {
    when: 'SMAN 1 Giri',
    school: 'High school, Natural Sciences (IPA)',
    degree: '',
    text: 'Dewan Ambalan Pramuka, public relations.',
  },
];

export const honors = [
  { title: 'Top 20 of 260 participants', org: 'Data Science ARA 7.0 (Kaggle)' },
  { title: 'Top 35 of 225 participants', org: 'Big Data Challenge, Satria Data, Kemdiktisaintek' },
];



