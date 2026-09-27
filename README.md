# IEEE Aarambh 2026 🚀

Official portal for **Aarambh 2026** — the annual freshers orientation and onboarding experience organized by **IEEE SPIT**.

## ✨ Features

- **Retro CRT Experience**: Interactive 3D television display with channel switching, static tuning animations, and CRT sound effects.
- **Channel 01 — Main Broadcast**: Event walkthrough and teaser.
- **Channel 02 — Student Registration**:
  - Live registration portal integrated with **MongoDB Atlas** (`Aarambh Registrations` collection).
  - Division selection (`Div A` to `Div H`).
  - Branch selection (Computer Engineering, Computer Science, EXTC).
  - Formatted Pass ID generation (`CE-[UID]`, `CS-[UID]`, `EE-[UID]`).
  - Multi-layer duplicate registration prevention (checks by UID and Email).
  - Instant digital pass issuance.
  - Official WhatsApp community invite.
- **Channel 03 — Info Portal**: Event schedule, venues, and orientation details.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Frontend**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [GSAP](https://greensock.com/gsap/) & [Lucide Icons](https://lucide.dev/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with [Mongoose](https://mongoosejs.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📦 Build & Deploy

To create an optimized production build:
```bash
npm run build
npm run start
```
