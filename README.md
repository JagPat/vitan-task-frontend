# VitanTask Frontend

## Requirements
- Node 18+
- npm 9+

## Environment
Create `.env` with:
```
VITE_API_BASE_URL=https://vitan-task-backend-production.up.railway.app
VITE_NO_AUTH=true    # optional: enables dev quick login buttons
```

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – production build to `dist`
- `npm run start` – serve `dist` (Railway)

## Login
- Normal: Google OAuth on `/login` (admins only).
- Dev quick login (if VITE_NO_AUTH=true): use buttons for Super Admin, Admin, Moderator, User.

## Seeding / First Admin
Create or invite first admin user via backend admin tools.

# WhatsTask Development Environment

A clean, organized development environment for the WhatsTask platform with separated frontend and backend repositories.
