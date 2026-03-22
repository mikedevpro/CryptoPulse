### 🚀 CryptoPulse — Real-Time Crypto Market Dashboard

A production-style cryptocurrency dashboard that allows users to explore market data, track favorite coins, and interact with live financial data through a fast, responsive UI.

### 🎯 The Goal

Build a modern crypto dashboard that feels like a real product — not just a data viewer.

Key objectives:

- Deliver real-time market data
- Provide a clean, intuitive UX for exploring coins
- Handle API rate limits and failures gracefully
- Support user accounts with persistent favorites

### 🧱 Tech Stack

Frontend

- React (Vite)
- TypeScript
- Tailwind CSS

Backend / Data

- Supabase (Auth + Database)
- CoinGecko API (market data)

Architecture

- Custom hooks for data fetching (useCryptoMarkets)
- Client-side caching with TTL
- Rate-limit handling with cooldown timers
- API proxy layer via Vercel

### ⚙️ Key Features

#### 📊 Real-Time Market Dashboard

- Displays top cryptocurrencies with live pricing
- Sorting (market cap, price change, etc.)
- Search by name or symbol

#### ⭐ User Favorites (Persistent)

- Authenticated users can save favorite coins
- Favorites persist across sessions using Supabase
- Fallback logic ensures favorites still display even if not in current market page

#### 🔁 Smart Data Fetching

- Caching layer reduces unnecessary API calls
- Rate-limit protection with cooldown messaging
- Manual refresh with user feedback

#### 🚨 Resilient Error Handling

Graceful handling of:

- API failures
- rate limiting (429)
- network issues

Cached data remains visible even when refresh fails

#### 📈 Market Insights

- Top movers (gainers/losers)
- Market summary stats
- Clean data visualization patterns

### 🧠 Technical Highlights

#### 1. Intelligent Caching System

```ts
const canUseCache =
  !!cached && now - cached.fetchedAt < MARKETS_CACHE_TTL_MS;
```

- Prevents redundant API calls
- Improves perceived performance
- Keeps UI responsive even under API limits

#### 2. Rate-Limit Handling (Real-World Problem Solving)

```ts
if (apiError?.status === 429) {
  const retryDelayMs = (apiError.retryAfter ?? 30) * 1000;
  setNextAllowedRefreshAt(Date.now() + retryDelayMs);
}
```

- Detects API throttling
- Displays countdown to user
- Prevents spam requests

👉 This is production-level thinking most junior devs don’t show.

#### 3. Fault-Tolerant UI Rendering

Instead of hiding data on error:

```ts
const showMarketContent = coins.length > 0;
```

- Keeps stale data visible
- Shows error as a banner instead of breaking UI
- Mimics real-world dashboards (like trading apps)

#### 4. Favorites Fallback Strategy

```ts
marketById.get(id) || fallbackById.get(id)
```

- Ensures favorites always render
- Handles pagination gaps gracefully
- Shows deeper understanding of data consistency

#### 5. Full-Stack Integration (Supabase)

- User authentication
- Persistent user-specific data
- Real-world app behavior (not just local state)

### 🎨 UX Decisions

- Sticky search + sort controls
- Responsive layout (mobile → desktop)
- Clear loading / error / empty states
- Visual hierarchy for readability

### ⚔️ Challenges & Solutions

❌ Problem: API rate limiting (429 errors)

Solution:

- Built cooldown system with retry timer
- Cached previous results to avoid blank UI

❌ Problem: Favorites not in current dataset

Solution:

- Secondary fetch using coinIds
- Merge strategy for consistent rendering

❌ Problem: Production API failures (403)

Solution:

- Implemented API proxy strategy
- Improved error logging and handling

### 📈 What I’d Improve Next

- Add coin detail page with charts
- WebSocket or polling for real-time updates
- Notifications for major price movements
- Performance optimization (virtualized list)

### 💡 What This Project Demonstrates

- Real-world API integration
- Error handling under real constraints
- Full-stack thinking (frontend + backend + auth)
- Performance optimization
- UX-first development mindset

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
