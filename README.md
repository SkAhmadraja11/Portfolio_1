# Portfolio (Astro frontend + Express backend)

This repository contains a modern Astro frontend and a separate Express backend for handling contact submissions.

## Project Structure
- `/` - Root: Astro Frontend
- `/backend` - Express Backend & MongoDB Logic

## Getting Started

### Frontend (Astro)
Install and run in the project root:
```powershell
npm install
npx astro dev
```

### Backend (Express + MongoDB)
```powershell
cd backend
npm install
cp .env.example .env
# edit .env and fill MONGO_URI, EMAIL_* values
npm run dev
```

## Deployment
- **Frontend**: Automatically deployed to GitHub Pages via `.github/workflows/pages.yml`.
- **Backend**: Should be deployed separately (e.g., Render, Railway, or Vercel). Update the backend URL in the frontend settings as needed.

## Notes
- The frontend contact client will POST to `window.__BACKEND_URL + '/api/contact'` (set in `src/layouts/BaseLayout.astro`). By default it points to `http://localhost:5000`.

