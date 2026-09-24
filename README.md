# CityPulse: The Live Civic Health Dashboard
> **Track B: Industry / Open Innovation** | Production-Ready Baseline & Architecture

CityPulse is an enterprise-grade, real-time civic health monitoring and predictive intervention platform designed for modern smart municipalities and their citizens. It bridges the gap between high-frequency municipal IoT telemetry and public transparency by providing a dual-surface experience: an **Executive Operations Room** for city decision-makers and an accessible **Citizen Pulse Portal** for the public.

---

## 🌟 Key Highlights & Hackathon Innovation

- **Four-Vector Civic Telemetry Engine**: Continuous multi-modal ingestion covering **Mobility & Traffic**, **Environment & Air Quality**, **Public Infrastructure & Safety**, and **Civic Sentiment (NLP 311 Ingestion)**.
- **Predictive AI Anomaly Detection**: Statistical Z-Score ($Z > 2.0\sigma$) anomaly detector with automated root-cause hypothesis generation and actionable municipal intervention playbooks.
- **Dual-Surface Architecture**:
  - **Executive Operations Room**: Dark-mode, high-density tactical HUD with composite Civic Health Index (0-100), active incident queue, ward health ranking, and crisis injection simulator.
  - **Citizen Pulse Portal**: Clean, accessible citizen view featuring local environmental advisories ("Can I jog outside?"), active road/transit detour alerts, and an interactive **311 Report an Issue modal** with live map pinning.
- **Interactive Geospatial Visualizations**: Leaflet-powered GIS engine with dynamic dark-matter tiles, custom SVG pulsing incident beacons, sector health coverage buffers, and vector layer filters.
- **Chaos Injection & Live Simulation**: Built-in simulator with mean-reverting stochastic fluctuation and one-click demo crisis triggers (Water Main Burst, Smog Inversion, Substation Blackout, Arterial Gridlock) for live judge demonstrations.

---

## 🏗️ Architecture & Folder Structure

```
Ce/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── anomalies/route.ts       # Predictive AI anomaly feed & recommendations
│   │   │   ├── civic/route.ts           # Real-time multi-vector telemetry & index
│   │   │   └── incidents/route.ts       # Municipal incidents & citizen reports
│   │   ├── globals.css                  # Custom styling, dark mode, Leaflet HUD
│   │   ├── layout.tsx                   # App Root Layout with CityPulseProvider
│   │   └── page.tsx                     # Main view switcher (Executive vs Citizen)
│   ├── components/
│   │   ├── citizen/
│   │   │   ├── CitizenPortal.tsx        # Public transparency dashboard & feed
│   │   │   └── ReportIssueModal.tsx     # 311 issue submission & GPS location picker
│   │   ├── executive/
│   │   │   ├── AnomalyAlertBanner.tsx   # Predictive AI hazard flag & protocol dispatch
│   │   │   ├── DistrictTable.tsx        # Multi-ward health ranking & sorting
│   │   │   ├── ExecutiveRoom.tsx        # Operations room tactical HUD
│   │   │   ├── IncidentFeed.tsx         # Live incident stream & unit dispatch
│   │   │   ├── MetricGauge.tsx          # Composite City Health dial & vector bars
│   │   │   └── VectorMetricsGrid.tsx    # 4 vector telemetry cards with sparklines
│   │   ├── layout/
│   │   │   └── Header.tsx               # Sticky nav, view mode toggle, crisis simulator
│   │   └── map/
│   │       ├── CivicMap.tsx             # Geospatial wrapper with vector layer filters
│   │       └── LeafletMapInner.tsx      # Dynamic Leaflet engine with SVG divIcons
│   └── lib/
│       ├── context/
│       │   └── CityPulseContext.tsx     # Global reactive state & simulation ticking
│       ├── data/
│       │   └── metro-seeds.ts           # Realistic metro dataset (districts, sensors)
│       ├── engine/
│       │   ├── anomaly-engine.ts        # Z-score statistical engine & AI rationale
│       │   └── data-engine.ts           # Health index math & crisis scenarios
│       └── types/
│           └── civic.ts                 # Strict TypeScript schemas
├── public/                              # Static public assets
├── tailwind.config.ts                   # Custom civic tech color palette
├── tsconfig.json                        # Strict TypeScript compiler config
└── package.json                         # Dependencies & build scripts
```

---

## 📊 Core Data Engine & Mathematical Formulation

### 1. Composite City Civic Health Index ($H_{city}$)
The composite health index is calculated dynamically from four weighted vector scores ($0 \le H_{city} \le 100$):

$$H_{city} = 0.25 \cdot S_{mob} + 0.25 \cdot S_{env} + 0.30 \cdot S_{inf} + 0.20 \cdot S_{sen}$$

- **Mobility Score ($S_{mob}$)**:
  $$S_{mob} = \max\left(0, \min\left(100, 100 - 0.5 \cdot \text{Congestion} - 2.0 \cdot \min(\text{TransitDelay}, 20)\right)\right)$$
- **Environment Score ($S_{env}$)**:
  $$S_{env} = \max\left(0, \min\left(100, 100 - 0.5 \cdot \text{AQI}\right)\right)$$
- **Infrastructure Score ($S_{inf}$)**:
  $$S_{inf} = \max\left(0, \min\left(100, 0.7 \cdot \text{GridStability} + \max(0, 30 - 5 \cdot (\text{WaterOutages} + \text{PowerOutages}))\right)\right)$$
- **Sentiment Score ($S_{sen}$)**:
  $$S_{sen} = \text{OverallSentimentScore}_{NLP}$$

---

### 2. Predictive Anomaly & Z-Score Detection
The anomaly detection layer evaluates rolling metrics against their moving historical baseline $\mu$ and standard deviation $\sigma$:

$$Z = \frac{X_t - \mu}{\sigma}$$

When $Z > 2.0\sigma$ or predefined civic safety thresholds are breached:
1. The engine triggers an `AnomalyAlert`.
2. Synthesizes a contextual **AI Rationale** explaining cross-vector correlation (e.g. atmospheric inversion coupled with traffic volume).
3. Generates **Actionable Intervention Protocols** (e.g. AST traffic signal timing shifts, municipal water valve isolation, public health push notifications).
4. City officials can review and execute the protocol with a single click.

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v24)
- **Package Manager**: npm or yarn

### Installation & Launch
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Start production server
npm run start
```

Visit `http://localhost:3000` in your web browser.

---

## 🎮 Hackathon Judge Walkthrough Guide

1. **Executive Operations View**:
   - Observe the **Civic Health Index** gauge and real-time SVG sparklines across Mobility, Environment, Infrastructure, and Civic Sentiment.
   - Use the **Vector Filters** on the map HUD (`All`, `Mobility`, `Environment`, `Infrastructure`, `Sentiment`) to isolate specific data layers.
   - Click any sector in the **Sector Health Breakdown** table (e.g. *Downtown*, *SoMa*, *Bayview*) to smoothly fly the GIS camera to that neighborhood.
2. **Inject Crisis (Chaos Engineering)**:
   - Click the **"Simulate Crisis"** dropdown in the header.
   - Select **"Water Main Burst"** or **"Smog / Air Inversion"**.
   - Watch the live telemetry plunge in real-time, the map update with a critical pulsing beacon, and the **Predictive AI Anomaly Banner** illuminate with AI rationale and mitigation steps.
   - Click **"Authorize Protocol"** to dispatch the municipal intervention.
3. **Switch to Citizen Pulse Portal**:
   - Toggle to **"Citizen Pulse Portal"** in the top navigation bar.
   - Experience the public-facing view with plain-English air quality advice, transit delays, and potable water health notices.
   - Click **"Report an Issue"** to open the 311 submission modal. File a mock issue (e.g. *Pothole* on *Valencia St*).
   - Upon submission, observe the newly created report immediately pinned to the live map and added to the community upvote feed.
