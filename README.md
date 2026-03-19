# 🚀 CryptoPulse

CryptoPulse is a modern, responsive crypto market dashboard built with React and TypeScript. It provides real-time cryptocurrency data, interactive charts, and a personalized watchlist experience.

---

## 🌐 Live Demo
👉 crypto-pulse-ashy.vercel.app

---

## 📸 Screenshots

Coming soon!
![Dashboard](./screenshots/dashboard.png)
![Coin Details](./screenshots/details.png)
![Watchlist](./screenshots/watchlist.png)
-->

---

## ✨ Features

- 📊 Live cryptocurrency market data (CoinGecko API)
- 🔍 Search and filter coins by name or symbol
- ↕️ Sort by market cap and volume
- ⭐ Favorite coins with persistent watchlist (localStorage)
- 📈 7-day price charts for each coin
- 📉 Sparkline mini charts in dashboard table
- 📄 Dedicated coin detail pages
- 📱 Fully responsive design

---

## 🧠 What This Project Demonstrates

- API integration and async data handling
- Component-based architecture in React
- State management with hooks
- Dynamic routing with React Router
- Data visualization using Recharts
- Persistent state using localStorage
- Clean, scalable frontend structure

---

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS

**Data & Visualization**
- CoinGecko API
- Recharts

**Routing & State**
- React Router
- Custom hooks

---

## 📂 Project Structure
src/
components/
pages/
hooks/
services/
utils/
types/

---

## ⚡ Getting Started

```bash
git clone https://github.com/mikedevpro/crypto-pulse.git
cd crypto-pulse
npm install
npm run dev
```

---

## 🚢 Deploying to Vercel

Use these steps when publishing:

1. Push your code to your connected branch.
2. In Vercel, set project root to `cypto-pulse` for framework detection (or keep auto-detect if this file structure is already recognized).
3. Confirm build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - If root deploy config is used, run:
     - `cd cypto-pulse`
     - `npm run build`
4. Make sure a `vercel.json` exists at repo root with the SPA rewrite for client-side routing:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
5. Verify after deploy:
   - Home route loads successfully.
   - Deep routes like `/coin/<id>` work after refresh.
   - API proxy path (if still relying on `/api/coingecko`) returns data.

## 🎯 Future Improvements

- Pagination / infinite scroll
- Advanced filtering (gainers, losers, favorites)
- Dark/light mode toggle
- User authentication (save watchlist to backend)
- Performance optimizations

## 👨‍💻 Author

Michael Nobles
Full-Stack Web Developer

GitHub: https://github.com/mikedevpro

## 💡 Inspiration

- Built to demonstrate real-world frontend architecture, data handling, and UI/UX design for modern web applications.
