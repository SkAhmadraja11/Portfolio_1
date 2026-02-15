# Portfolio (Astro frontend + Express backend)

This repository contains a modern Astro frontend and a separate Express backend for handling contact submissions.

Frontend (Astro):
- Run in project root

Install and run:
```powershell
npm install
npx astro dev
```

Backend (Express + MongoDB):
```powershell
cd server
npm install
cp .env.example .env
# edit .env and fill MONGO_URI, EMAIL_* values
npm run dev
```

Notes:
- The frontend contact client will POST to `window.__BACKEND_URL + '/api/contact'` (set in `src/layouts/BaseLayout.astro`). By default it points to `http://localhost:5000`.
- You can run the Express server separately to persist contacts to MongoDB and send email notifications.
