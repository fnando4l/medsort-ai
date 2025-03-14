# MedSort AI

**Classify incoming medical documents in seconds — not hours.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-blue?style=for-the-badge)](https://medsort-ai-app.netlify.app)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Recharts](https://img.shields.io/badge/Recharts-3-22C55E?style=flat-square)](https://recharts.org)

---

## Live Demo

**[https://medsort-ai-app.netlify.app](https://medsort-ai-app.netlify.app)**

Upload a medical document and watch it get classified, routed to the correct department, and scored for confidence — all within a few seconds.

---

## Features

- **Document Upload** — Drag-and-drop or click-to-upload interface for medical documents
- **Intelligent Classification** — Serverless NLP engine classifies documents into 10 medical categories:
  - Lab Results, Radiology Reports, Discharge Summaries, Referral Letters
  - Prescription Orders, Pathology Reports, Operative Notes, Progress Notes
  - Consent Forms, Insurance / Billing Documents
- **Department Routing** — Each classified document is automatically assigned to the appropriate clinical department
- **Confidence Scoring** — Per-document confidence percentage surfaced alongside each classification result
- **Results Dashboard** — Filterable table of all processed documents with status indicators
- **Analytics Charts** — Recharts-powered breakdown of document volume by category and department
- **Processing History** — Full log of previously classified documents with re-review capability

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Charts | Recharts 3 |
| Classification Engine | Netlify Serverless Functions |
| Deployment | Netlify |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Netlify CLI (for local serverless function development)

### Installation

```bash
git clone https://github.com/yourusername/medsort-ai.git
cd medsort-ai
npm install
```

### Run Locally

```bash
# Development server (frontend only)
npm run dev

# Full stack with serverless functions
npx netlify dev
```

Open [http://localhost:5173](http://localhost:5173) (Vite) or [http://localhost:8888](http://localhost:8888) (Netlify dev) in your browser.

### Build for Production

```bash
npm run build
```

---

## Project Structure

```
medsort-ai/
├── netlify/
│   └── functions/
│       └── classify.js     # Serverless classification endpoint
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/             # Images and static files
│   ├── App.jsx             # Main app — upload, results, dashboard
│   ├── App.css             # Component styles
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles / Tailwind base
├── index.html
├── netlify.toml            # Netlify build and function config
├── vite.config.js
└── package.json
```

The classification request flows from the frontend to `netlify/functions/classify.js`, which processes the document and returns a structured JSON response containing the document type, department assignment, confidence score, and key extracted metadata.

---

## Document Categories

| Category | Routed To |
|---|---|
| Lab Results | Laboratory / Pathology |
| Radiology Reports | Radiology |
| Discharge Summaries | Admissions / Case Management |
| Referral Letters | Scheduling / Specialist Dept. |
| Prescription Orders | Pharmacy |
| Pathology Reports | Pathology |
| Operative Notes | Surgical Services |
| Progress Notes | Primary Care / Attending |
| Consent Forms | Medical Records / Legal |
| Insurance / Billing | Billing & Revenue Cycle |

---

## License

MIT © 2025
