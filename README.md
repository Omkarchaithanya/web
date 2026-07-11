# UrbanTree Web Platform

**Bio-Mechanical Air Purification by SunEx Technologies**

The UrbanTree platform is a production-grade IoT and web ecosystem designed to manage, monitor, and present the capabilities of the UrbanTree air purification hardware.

## Project Structure

This repository is split into two major components:
- `/Frontend`: A highly optimized, static frontend utilizing GSAP, Tailwind CSS, and vanilla ES6 modules.
- `/Backend`: A robust Node.js API built with Express, TypeScript, Prisma, and WebSockets for IoT data ingestion.

## Documentation
For a complete overview of the system design, data flow, and security implementations, please refer to the architecture documentation.
- [Architecture Document](.gemini/antigravity-ide/brain/a0c60cc6-be31-42c1-849b-dfdc79e020b9/architecture.md) *(Local path relative to IDE workspace)*

## Setup & Execution

### 1. Frontend
The frontend consists of statically served HTML/CSS/JS files.
```bash
cd Frontend
npx serve -p 3000
```
Then navigate to `http://localhost:3000`.

### 2. Backend
The backend requires Node.js (v20+) and a running instance of PostgreSQL and Redis.
```bash
cd Backend
npm install
npm run dev
```

## Security & Performance Standards
- **CSP (Content Security Policy):** All HTML files are injected with strict CSP tags.
- **Render Blocking:** All non-critical JS is loaded with `defer`.
- **GSAP Optimizations:** Animations utilize decoupled IntersectionObservers to preserve CPU loops.
- **Backend Headers:** The Express API enforces Helmet (HSTS, NoSniff) and strict CORS.
