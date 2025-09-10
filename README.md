# VitanTask Frontend

## Requirements
- Node 18+
- npm 9+

## Environment
Create `.env` with:
```
VITE_API_BASE_URL=https://vitan-task-backend-production.up.railway.app
VITE_NO_AUTH=true    # optional: enables dev quick login buttons
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id   # required for real OAuth
VITE_DEV_PROXY_TARGET=https://vitan-task-backend-production.up.railway.app  # optional: dev proxy override
```

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – production build to `dist`
- `npm run start` – serve `dist` (Railway)

## Login
- Normal: Google OAuth on `/login` (admins only).
- Dev quick login (if VITE_NO_AUTH=true): use buttons for Super Admin, Admin, Moderator, User.

### Dev Quick Login Details
When `VITE_NO_AUTH=true`, the login page renders quick‑login buttons that call the app’s `useAuth()` hook with a dummy token and selected role (`super_admin`, `admin`, `moderator`, `user`). This is for development only and skips Google OAuth.

For real admin login, set `VITE_GOOGLE_CLIENT_ID` and disable `VITE_NO_AUTH`.

## Dashboard Stats Source
- Primary: `GET /api/modules/dashboard/quick-stats` (no admin JWT required).
- Fallback: derive counts from `GET /api/modules/tasks` when quick‑stats fails.
- Frontend helper: `src/services/dashboardApi.js` handles the above and shows toasts for success/error.

## Dev Proxy
`vite.config.ts` proxies `/api` in dev to:
`process.env.VITE_DEV_PROXY_TARGET || process.env.VITE_API_BASE_URL || https://vitan-task-backend-production.up.railway.app`
so local dev can follow your chosen backend without editing code.

## Seeding / First Admin
Create or invite first admin user via backend admin tools.

# WhatsTask Development Environment

A clean, organized development environment for the WhatsTask platform with separated frontend and backend repositories.

## Submodule & Deployment Note
This folder is a Git submodule linked to its own GitHub repo. To deploy via Railway, commit and push changes from within `frontend/` to the frontend’s remote. Pushing only the meta‑repo will not trigger a deploy.

## Source of Truth
Use `frontend/src/**` for app code. Ignore any root‑level legacy duplicates outside this folder in the meta‑repo.
