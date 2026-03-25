# 🚀 ProposifyAI

> AI-powered RFP (Request For Proposal) management system designed to automate the entire lifecycle — from creation to evaluation.

🔗 **Live App**: https://www.proposifyai.online

---

## 📌 Overview

ProposifyAI is a backend-first, AI-integrated platform that automates:

- RFP creation from natural language
- Vendor management and communication
- Email-based workflows (outbound + inbound)
- Proposal evaluation using AI-driven scoring

The system is designed with **deterministic pipelines**, **strict type safety**, and **fault-tolerant workflows** to ensure reliability in real-world scenarios.

---

## 🧱 Architecture

### Frontend
- React + TypeScript
- Redux Toolkit
- Tailwind CSS

### Backend
- Node.js + Express (TypeScript)
- Event-driven service pipelines

### Database
- PostgreSQL (relational, normalized, indexed)

### External Services
- Resend (Outbound Emailing)
- Mailgun (Inbound Emailing)
- LLM APIs (AI processing)

---

## ⚙️ Core Features

- 🔐 OAuth 2.0 authentication with JWT-based authorization
- 📩 Stateful email workflows (outbound, inbound, webhook-driven)
- 🔁 Idempotent processing for emails and webhooks
- 🧠 AI-powered transformation of natural language into structured RFP data
- 📊 Automated proposal evaluation using scoring criteria
- 📦 Fully normalized and queryable data pipelines
- 🧾 Observability through request lifecycle tracking

---

## 🔄 System Pipelines

The backend is structured into independently scalable pipelines:

- **Request Pipeline**  
  Processes natural language → extracts → validates → normalizes → stores RFP data

- **Outbound Pipeline**  
  Handles email dispatch to vendors

- **Webhook Pipeline**  
  Processes delivery and event updates (idempotent)

- **Inbound Pipeline**  
  Handles vendor responses via email

- **AI Pipeline**  
  Evaluates proposals using structured scoring criteria

---

## 🧠 AI Pipeline Design

- Recursive processing:
  - Validation → Coercion → Normalization
- Schema-driven outputs for deterministic behavior
- Confidence scoring for each LLM response
- Controlled prompt engineering with versioned contracts

---

## 📩 Email Workflow

- Normalized email event tracking
- Terminal vs non-terminal state handling
- Stable identifiers tied to request lifecycle
- Signature verification (timestamp-tolerant)
- Idempotent handling for retries and duplicates
- Concurrent processing using `Promise.all`

---

## 🗄️ Database Design

- Fully normalized relational schema
- Strong constraints and relationships
- Indexed based on query patterns
- Enum-based state enforcement for deterministic UI and pipelines
- Single Source of Truth across all pipelines

---

## 🔐 Authentication & Authorization

- OAuth 2.0 (Google Sign-In)
- JWT signature verification against client ID
- Stateless short-lived access tokens
- Stateful HTTP-only cookie-based refresh tokens

---

## 🧰 Tech Stack

- [![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
- [![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)
- [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
- [![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](#)
- [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](#)
- [![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-764ABC?logo=redux&logoColor=white)](#)
- [![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
- [![Express.js](https://img.shields.io/badge/Express.js-404D59?logo=express&logoColor=white)](#)
- [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](#)
- [![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](#)
- [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](#)
- [![Meta Llama](https://img.shields.io/badge/MetaLlama-0467DF?logo=meta&logoColor=white)](#)
- [![Resend](https://img.shields.io/badge/Resend-000000?logo=resend&logoColor=white)](#)
- [![Mailgun](https://img.shields.io/badge/Mailgun-C02428?logo=mailgun&logoColor=white)](#)
- [![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)
- [![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)](#)
- [![Render](https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=white)](#)

---

## 🚧 Current Status

- Core backend pipelines implemented
- AI evaluation system functional
- Email workflows integrated
- Frontend dashboard (in progress)

---

## 🔮 Future Improvements

- Complete dashboard UI
- Add caching layer (Redis)
- Improve AI confidence calibration
- Rate limiting and abuse protection

---

## ⚡ Getting Started (Local Setup)

```bash
# Clone the repo
git clone https://github.com/Priyanshu1-62/ProposifyAI

# Install dependencies
npm install

# Setup environment variables
# (Create .env file)

# Run backend
npm run dev

# Run frontend
npm run dev