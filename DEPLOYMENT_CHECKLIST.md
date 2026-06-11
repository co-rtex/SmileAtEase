# SmileAtEase Deployment Checklist

Use this checklist for a hosted SmileAtEase demo with Vercel for the frontend, a Render/Railway/Fly-style backend, and managed Postgres.

## Pre-Deploy Verification

Run the local checks before deploying:

```bash
cd apps/web
npm run smoke
npm run build
npm run type-check
```

```bash
cd apps/api
.venv/bin/python -m pytest
.venv/bin/alembic upgrade head --sql
```

Confirm no real secrets are committed and `.env.example` still contains placeholder values only.

## Frontend: Vercel

1. Create a Vercel project from this repository.
2. Set the frontend root to `apps/web`.
3. Use the build command:

   ```bash
   npm run build
   ```

4. Set the required environment variable:

   ```env
   NEXT_PUBLIC_API_BASE_URL=https://<backend-host>
   ```

5. Deploy and open the Vercel URL.
6. Confirm the browser can reach the backend through `NEXT_PUBLIC_API_BASE_URL`.

Do not rely on the local fallback URL in production. The fallback to `http://localhost:8000` exists for local development only.

## Backend: Render, Railway, Or Fly.io

1. Create a backend service from `apps/api`.
2. Use Python 3.11 or newer.
3. Install dependencies:

   ```bash
   pip install -e ".[dev]"
   ```

4. Start the API:

   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

5. Set the backend environment variables:

   ```env
   DATABASE_URL=postgresql+psycopg://<user>:<password>@<host>:<port>/<database>
   BACKEND_CORS_ORIGINS=https://<frontend-host>
   PLAN_RETENTION_DAYS=7
   AI_PLAN_MODE=rule_based
   AI_PROVIDER=openai
   OPENAI_API_KEY=
   OPENAI_MODEL=gpt-4.1-mini
   AI_REQUEST_TIMEOUT_SECONDS=20
   ENVIRONMENT=production
   ```

6. Keep `AI_PLAN_MODE=rule_based` for the safest first demo. To enable AI later, set `AI_PLAN_MODE=ai` and add `OPENAI_API_KEY`.

## Database Setup

1. Provision Postgres with Neon, Supabase, Railway, Render, or another managed Postgres provider.
2. Copy the managed connection string into `DATABASE_URL`.
3. Run migrations from `apps/api` after the database is available:

   ```bash
   alembic upgrade head
   ```

4. Check readiness after deploy:

   ```txt
   https://<backend-host>/api/readiness
   ```

Expected ready response:

```json
{ "status": "ready", "database": "ok" }
```

## CORS Setup

Set `BACKEND_CORS_ORIGINS` to the deployed frontend origin, for example:

```env
BACKEND_CORS_ORIGINS=https://smileatease-demo.vercel.app
```

For multiple allowed origins, use a comma-separated list:

```env
BACKEND_CORS_ORIGINS=https://smileatease-demo.vercel.app,https://preview.example.com
```

Do not use wildcard CORS origins outside development. The backend rejects wildcard CORS when `ENVIRONMENT` is not `development`.

## Smoke Test URLs

Frontend:

- `https://<frontend-host>/`
- `https://<frontend-host>/start`
- `https://<frontend-host>/guides`
- `https://<frontend-host>/privacy`
- `https://<frontend-host>/terms`
- `https://<frontend-host>/about`
- `https://<frontend-host>/example`

Backend:

- `https://<backend-host>/api/health`
- `https://<backend-host>/api/readiness`

Expected health response:

```json
{ "status": "ok" }
```

## Production Smoke Checklist

Complete these checks after deployment:

- Open each frontend smoke route listed above.
- Submit a normal intake and confirm `/result/[planId]` renders normal plan sections and a comfort card.
- Submit a boundary intake with optional text such as `Should I ask for sedation?` and confirm boundary language appears.
- Submit urgent and crisis samples directly to the backend using `docs/sample-intakes.md`, then open the returned result links and confirm no normal preparation sections appear.
- On a normal result page, test copy full plan.
- On a normal result page, test copy comfort card.
- On a normal result page, test the print button opens the browser print dialog.
- Use the start-over link and confirm it returns to `/start`.
- If practical, delete a saved plan through the API and confirm the result page shows the missing/deleted plan message.
- If practical, temporarily lower retention in a non-production test environment and confirm expired plans are not returned.

Sample intake payloads and scenario notes are in `docs/sample-intakes.md`.

## AI Mode Notes

Default:

```env
AI_PLAN_MODE=rule_based
```

Optional AI mode:

```env
AI_PLAN_MODE=ai
OPENAI_API_KEY=<real-key>
```

AI output is validated before use. Invalid, unsafe, malformed, timed-out, or failed AI output falls back to rule-based generation. Crisis and urgent cases never call AI.

To disable AI quickly during a demo or incident, set:

```env
AI_PLAN_MODE=rule_based
```

Then redeploy or restart the backend service.

## Rollback Notes

- Frontend rollback: use the previous Vercel deployment.
- Backend rollback: redeploy the previous backend release or image.
- AI rollback: set `AI_PLAN_MODE=rule_based`.
- Database rollback: migrations should be treated as forward-only unless a specific rollback has been written and tested.
- If readiness fails after deploy, verify `DATABASE_URL`, network access to Postgres, and that `alembic upgrade head` has run.
