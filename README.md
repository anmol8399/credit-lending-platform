# CredFlow — Intelligent Credit Lending Platform

> A production-grade, ML-ready credit lending platform for Indian SMEs. Built with React, designed for GST/CIBIL-native credit assessment with a RAG + NLP pipeline integration path.

![CredFlow Screenshot](https://via.placeholder.com/1200x600/0a0f1e/c9972b?text=CredFlow+Credit+Platform)

---

## 🚀 Features

### For Borrowers (Firms)
- **Self-Onboarding** — Multi-step registration with GSTIN, PAN, proprietor details
- **Document Vault** — Secure upload of GST returns, CIBIL, ITR, bank statements, incorporation docs
- **Dashboard** — Real-time view of credit applications, documents, and account status
- **Credit Application Form** — Structured credit demand form with purpose, tenure, facility type, and business narrative
- **Decision Engine** — ML scoring with Risk Grade (A+ to D), credit limit, and risk-adjusted interest rate

### For Credit Officers (Master)
- **Master Dashboard** — View all onboarded firms with filters and search
- **Customer Profiles** — Full onboarding details, documents, and application history (passwords never shown)
- **Applications Table** — All credit applications across firms with grades, rates, and amounts
- **Audit Trail** — Timestamped records of registrations and applications

---

## 🏗️ Architecture & ML Integration Path

```
credflow/
├── src/
│   ├── pages/
│   │   ├── LandingPage.jsx          # Marketing homepage
│   │   ├── OnboardingPage.jsx       # 5-step firm registration + doc upload
│   │   ├── LoginPage.jsx            # Customer login
│   │   ├── DashboardPage.jsx        # Customer portal (overview, docs, apps, profile)
│   │   ├── CreditApplicationPage.jsx # Credit demand form + ML decision
│   │   ├── MasterLogin.jsx          # Admin auth
│   │   └── MasterDashboard.jsx      # Admin: all firms + all applications
│   ├── components/
│   │   └── Navbar.jsx
│   ├── App.jsx                      # SPA router (state-based)
│   ├── index.css                    # Design system + tokens
│   └── main.jsx
```

### ML Decision Pipeline (current stub → production path)

```
CreditApplicationPage.jsx → computeCreditDecision()
         │
         ▼
[Current: Rule-based scoring from turnover + amount]
         │
         ▼
[Replace with: POST /api/ml/score-application]
         │
         ├── Input: application form data + customer profile
         ├── Input: parsed GST returns (GSTR-3B, GSTR-9) via NLP/RAG
         ├── Input: CIBIL score extracted from uploaded PDF (OCR + NLP)
         ├── Input: bank statement cash flow analysis
         └── Output: { riskGrade, creditLimit, interestRate, riskPremium, explanation }
```

---

## 🔌 Plugging in Your ML / RAG Pipeline

### Step 1 — Replace the scoring function

In `src/pages/CreditApplicationPage.jsx`, find `computeCreditDecision()` and replace with an API call:

```javascript
// Before (stub)
function computeCreditDecision(form, user) {
  // ... placeholder logic
}

// After (production)
async function computeCreditDecision(form, user) {
  const response = await fetch('/api/ml/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      application: form,
      customer: {
        gstin: user.gstin,
        turnoverRange: user.turnoverRange,
        industry: user.industry,
        firmType: user.firmType,
      },
      documentIds: Object.keys(user.documents || {}),
    }),
  })
  return response.json()
}
```

### Step 2 — Build the ML backend

Your `/api/ml/score` endpoint should:

```python
# FastAPI example
@app.post("/api/ml/score")
async def score_application(payload: ApplicationPayload):
    # 1. Retrieve documents from storage (S3 / GCS)
    docs = await fetch_documents(payload.customer.gstin)

    # 2. OCR + NLP parsing (Tesseract / AWS Textract / Google DocAI)
    gst_data = parse_gst_returns(docs['gstr3b'])
    cibil_score = extract_cibil_score(docs['cibil'])
    cashflows = analyze_bank_statement(docs['bankStatement'])

    # 3. RAG pipeline — embed docs, retrieve relevant financial signals
    rag_signals = rag_pipeline.query(
        f"What is the financial health and repayment capacity of {payload.customer.gstin}?",
        context_docs=[gst_data, cashflows]
    )

    # 4. Feature engineering + ML model
    features = engineer_features(gst_data, cibil_score, cashflows, payload.application)
    score = credit_model.predict(features)

    # 5. Return decision
    return {
        "riskGrade": score_to_grade(score),
        "approvedAmount": compute_limit(score, payload.application.requestedAmount),
        "interestRate": base_rate + risk_premium(score),
        "riskPremium": risk_premium(score),
        "status": "approved" if score > threshold else "rejected",
        "explanation": rag_signals.explanation,  # LLM-generated rationale
    }
```

### Step 3 — Document Storage

Replace the in-memory file metadata with actual cloud storage:

```javascript
// In OnboardingPage.jsx, replace localStorage document saving with:
const uploadDocument = async (file, docType, gstin) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('docType', docType)
  formData.append('gstin', gstin)
  
  const res = await fetch('/api/documents/upload', {
    method: 'POST',
    body: formData,
  })
  return res.json() // { documentId, storageUrl, checksum }
}
```

### Step 4 — Replace localStorage with a real database

| Entity | Recommended Storage |
|--------|-------------------|
| Customer profiles | PostgreSQL / MongoDB |
| Documents | AWS S3 / GCS with presigned URLs |
| Credit applications | PostgreSQL with audit log |
| ML scores & explanations | PostgreSQL + vector DB (pgvector / Pinecone) |
| Session / auth | Redis + JWT |

---

## 🧠 Recommended ML Stack

```
Documents (PDF/Image)
    │
    ▼
OCR Layer: AWS Textract / Google Document AI / Tesseract
    │
    ▼
NLP Parsing: spaCy / LangChain / LlamaIndex
    │
    ├── GST Return Parser → monthly turnover, tax liability, ITC
    ├── CIBIL Parser → credit score, DPD, outstanding loans
    ├── Bank Statement Parser → average balance, EMI outflows, cash flow
    └── Financial Statement Parser → EBITDA, debt ratios, NPA
    │
    ▼
RAG Pipeline (LangChain / LlamaIndex)
    ├── Embed docs → vector store (pgvector / Pinecone / Weaviate)
    ├── Retrieve relevant signals per application
    └── LLM rationale generation (GPT-4 / Claude / Llama-3)
    │
    ▼
ML Credit Model
    ├── Features: CIBIL, GST turnover trend, bank balance, leverage ratio, industry risk
    ├── Model: XGBoost / LightGBM / Logistic Regression ensemble
    ├── Output: probability of default → Risk Grade → Credit Limit → Rate
    └── Explainability: SHAP values → officer-readable rationale
```

---

## 📋 Document Categories Collected

| Document | Purpose in ML |
|----------|-------------|
| GST Certificate | Identity verification, GSTIN validation |
| GSTR-3B (12 months) | Monthly revenue trend, tax compliance |
| GSTR-9 (Annual) | Annual turnover validation |
| CIBIL Report | Credit score, existing obligations, DPD |
| Bank Statement (12M) | Cash flow, average balance, EMI burden |
| ITR (2 years) | Income verification, tax compliance |
| Audited Financials | Balance sheet ratios, debt levels |
| PAN Card | KYC |
| Certificate of Incorporation | Legal entity verification |
| Aadhaar | Proprietor KYC |

---

## 🔒 Security Considerations (Production Checklist)

- [ ] Replace `btoa()` password encoding with bcrypt + salt (server-side)
- [ ] Implement JWT-based session management
- [ ] Add HTTPS-only cookies for session tokens
- [ ] Implement rate limiting on login and application endpoints
- [ ] Mask Aadhaar numbers (show only last 4 digits) server-side
- [ ] Never return passwords in any API response (already done in dashboard)
- [ ] Encrypt documents at rest (S3 SSE / GCS CMEK)
- [ ] Add document access audit logging
- [ ] Implement role-based access control (RBAC) for credit officers
- [ ] Add OTP verification for mobile number during onboarding
- [ ] GSTN API integration for real-time GSTIN validation

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/your-org/credflow.git
cd credflow

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:5173`

### Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Master / Credit Officer | `credflow_master` | `Master@2025` |
| Customer | Register via onboarding | Your choice |

---

## 📁 Pages & Routes

| Page | Path / State | Description |
|------|-------------|-------------|
| Landing | `landing` | Marketing homepage |
| Onboarding | `onboarding` | 5-step registration + document upload |
| Login | `login` | Customer authentication |
| Dashboard | `dashboard` | Customer portal |
| Credit Application | `credit-application` | Credit demand form |
| Master Login | `master-login` | Admin authentication |
| Master Dashboard | `master-dashboard` | Admin view of all data |

---

## 🗺️ Roadmap

- [ ] **Backend API** — FastAPI / Node.js REST API
- [ ] **Database** — PostgreSQL with Prisma ORM
- [ ] **Document Storage** — AWS S3 with presigned URLs
- [ ] **OCR Pipeline** — AWS Textract integration
- [ ] **CIBIL Parser** — Automated credit score extraction
- [ ] **GST API** — Live GSTN validation
- [ ] **ML Model** — XGBoost credit scoring
- [ ] **RAG Pipeline** — LangChain + pgvector
- [ ] **Email/SMS** — Twilio + SendGrid for notifications
- [ ] **Mobile App** — React Native companion app
- [ ] **Credit Officer Actions** — Manual override, query escalation
- [ ] **Compliance Module** — RBI reporting, audit exports

---

## 🏦 Regulatory Notes

This platform is designed for use by RBI-registered NBFCs and digital lending entities. Before production deployment:
- Register as an NBFC with RBI or partner with one
- Comply with RBI Digital Lending Guidelines (2022)
- Implement KYC per RBI Master Direction on KYC
- Maintain Fair Practice Code for lenders

---

## 📄 License

MIT License. See `LICENSE` for details.

---

Built with ❤️ for India's credit infrastructure.
