# GANS HR Weyak - Learning Needs Analysis (LNA) System

Enterprise Learning Needs Analysis (LNA) portal for GANS HR Weyak supporting Employee Self-Assessment, Manager Review & Endorsement, and Centralized HR Monitoring & Analytics.

---

## ⚡ Instant Standalone Preview (No Setup Required)

If you want to view or share the complete interactive prototype without installing Node.js or running servers:
1. Look in the root of this folder for **`GANS_LNA_Standalone_Prototype.html`**.
2. **Double-click** `GANS_LNA_Standalone_Prototype.html` to open it in any web browser (Chrome, Edge, Safari, Firefox).
3. The full application with all assessment steps, competency evaluations, manager reviews, and HR analytics runs immediately offline.

---

## 🚀 Running the Full Project Locally (Developers)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- `npm`

### Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

---

## 🛠️ Production Build

To build the standard production assets:
```bash
npm run build
```

This generates:
- `dist/index.html` + `dist/assets/` (standard multi-file distribution)
- `GANS_LNA_Standalone_Prototype.html` (single-file bundle for instant sharing)
