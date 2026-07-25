# UrbanTree Web Platform

**Bio-Mechanical Air Purification by SunEx Technologies**

The UrbanTree platform is a production-grade IoT and web ecosystem designed to manage, monitor, and present the capabilities of the UrbanTree air purification hardware. Built with a focus on high performance, tight security, and real-time data ingestion, this platform bridges the gap between hardware telemetry and user-facing dashboards.

---

##  Project Structure

This repository follows a strict separation of concerns, divided into two major components:

### `/Frontend`
A highly optimized, static frontend utilizing **GSAP**, **Tailwind CSS**, and **Vanilla ES6 modules**.
- **Performance First:** All animations utilize decoupled `IntersectionObserver` loops to prevent Main Thread blocking.
- **Build System:** Bundled via Vite for lightning-fast HMR and optimized static asset delivery.
- **Responsive Design:** Complex scroll-snapping and dynamic SVG pathing seamlessly adapt across desktop and mobile viewports.

### `/Backend`
A robust Node.js API built with **Express**, **TypeScript**, **Prisma**, and **WebSockets**.
- **IoT Telemetry:** Ingests live data from remote purifiers via WebSockets (AQI, PM2.5, PM10, CO2, Filter Status).
- **Database:** PostgreSQL managed via Prisma ORM for type-safe queries.
- **Caching & Limiting:** Redis-backed rate limiters ensure API stability under high load.

---

##  Security & Rate Limiting

As an industry-standard platform, security is baked into every layer of the network request lifecycle:

1. **Strict Content Security Policy (CSP):** 
   Configured via `helmet`, the backend enforces strict CSP headers, preventing XSS and unauthorized data exfiltration. Only `self` origins are permitted for scripts and styles.
2. **Global & Route-Specific Rate Limiting (Redis):**
   - **Global Limit:** 100 requests per 15 minutes per IP to prevent basic DDoS and enumeration attacks.
   - **Auth Endpoints:** Stricter limits (5 requests per 15 minutes) applied specifically to `/login` and `/reset-password` to prevent brute-force attacks.
3. **Payload Sanitization & Size Limits:**
   - JSON payloads are capped at `100kb` via `express.json({ limit: '100kb' })`.
   - Prevent Large Payload / Buffer Exhaustion attacks.
4. **Timing-Safe Authentication:**
   IoT API keys and sensitive tokens are compared using `crypto.timingSafeEqual` to prevent timing-based side-channel attacks.
5. **WebSocket Authentication:**
   Connections require authorized handshake tokens to prevent live device data leakage to unauthorized clients.

---

##  Documentation

For a complete overview of the system design, data flow, and database models, refer to the documentation files included in the root directory:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture, data flow, and backend design patterns.
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Entity Relationship Diagrams and Prisma schema tables.

---

##  Setup & Execution

### 1. Prerequisites
- **Node.js:** v20.0.0 or higher
- **PostgreSQL:** Running instance
- **Redis:** Running instance (for rate limiting)

### 2. Backend Setup
Navigate to the backend folder, install dependencies, and run migrations:

```bash
cd Backend
npm install

# Setup environment variables
cp .env.example .env

# Run Prisma migrations
npm run db:migrate

# Start the development server
npm run dev
```
*The API will be available at `http://localhost:5000` and Swagger docs at `http://localhost:5000/api-docs`.*

### 3. Frontend Setup
Navigate to the frontend folder and start the Vite dev server:

```bash
cd Frontend
npm install
npm run dev
```
*The website will be served at `http://localhost:5173`.*
