# SmileAtEase

SmileAtEase helps nervous dental patients feel more prepared before a dental visit. People complete a structured intake and receive a non-diagnostic visit preparation plan plus a printable comfort card.

This repository currently includes the local scaffold, frontend landing and intake flow, result rendering, guide and policy pages, backend validation and safety checks, persistence, rule-based plan generation, and optional AI plan generation behind a feature flag.

## Local Setup

1. Copy the example environment file if you want local overrides:

   ```bash
   cp .env.example .env
   ```

2. Start the full local stack:

   ```bash
   docker compose up --build
   ```

3. Open the frontend:

   ```txt
   http://localhost:3000
   ```

4. Check the backend health route:

   ```txt
   http://localhost:8000/api/health
   ```

   Expected response:

   ```json
   { "status": "ok" }
   ```

## Development Commands

Frontend:

```bash
cd apps/web
npm install
npm run smoke
npm run type-check
npm run build
```

Backend:

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
.venv/bin/python -m pytest
.venv/bin/alembic upgrade head
```

Use plain `pytest` only after the virtual environment is activated.

## Environment

All required variables are documented in `.env.example`. Do not commit real API keys or secrets.

Frontend production:

- `NEXT_PUBLIC_API_BASE_URL` should point to the deployed backend base URL, for example `https://your-api.example.com`.
- Local development falls back to `http://localhost:8000` when the variable is not set.

Backend production:

- `DATABASE_URL`
- `BACKEND_CORS_ORIGINS`
- `PLAN_RETENTION_DAYS`
- `AI_PLAN_MODE`
- `AI_PROVIDER`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `AI_REQUEST_TIMEOUT_SECONDS`
- `ENVIRONMENT`

Set `BACKEND_CORS_ORIGINS` to the deployed frontend origin, for example `https://your-app.vercel.app`. Do not use wildcard CORS origins in production.

## Backend API Notes

- `POST /api/assessments` validates and saves intake data only.
- `POST /api/plans/generate` validates intake, saves an assessment, and creates a preparation plan.
- Plan generation defaults to `AI_PLAN_MODE=rule_based`.
- Optional AI generation can be enabled with `AI_PLAN_MODE=ai` and `OPENAI_API_KEY`.
- AI output is validated against the plan schema and safety rules. Unsafe, incomplete, malformed, or failed AI output falls back to rule-based generation.
- Crisis and urgent cases never call AI; they always use deterministic safety responses.
- Saved assessments and plans expire according to `PLAN_RETENTION_DAYS`.

## Deployment

Frontend on Vercel:

1. Set the project root or build command for `apps/web`.
2. Add `NEXT_PUBLIC_API_BASE_URL` with the deployed backend URL.
3. Build with `npm run build`.

Backend on Render, Railway, or Fly.io:

1. Deploy `apps/api`.
2. Install dependencies with `pip install -e ".[dev]"` or the platform equivalent.
3. Run the app with Uvicorn, for example:

   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

4. Configure the backend environment variables listed above.
5. Run migrations after provisioning the database:

   ```bash
   alembic upgrade head
   ```

Database options:

- Neon Postgres
- Supabase Postgres
- Railway Postgres
- Render Postgres

Health checks:

- `/api/health` returns a simple service status.
- `/api/readiness` checks whether the backend can query the database.

## Verification

Frontend:

```bash
cd apps/web
npm run smoke
npm run build
npm run type-check
```

Backend:

```bash
cd apps/api
.venv/bin/python -m pytest
.venv/bin/alembic upgrade head --sql
```

## Runbooks

- `DEPLOYMENT_CHECKLIST.md` covers hosted frontend, backend, database, CORS, smoke testing, rollback, and AI mode notes.
- `DEMO.md` covers a local demo walkthrough.
- `docs/sample-intakes.md` includes sample payloads for normal, boundary, urgent, crisis, high concern, cost, and embarrassment/judgment scenarios.

## Current Scope

Current implemented scope includes:

- Monorepo scaffold
- Docker Compose local environment
- Frontend landing page, intake flow, result page, guides, privacy, terms, and about pages
- FastAPI health endpoint at `/api/health`
- Backend assessment endpoint at `/api/assessments`
- Backend plan endpoint at `/api/plans/generate`
- Backend intake validation, sanitizer, and safety checks
- Rule-based plan generation by default
- Optional AI plan generation behind `AI_PLAN_MODE=ai`
- Assessment and plan persistence tables and migrations
- PostgreSQL local service

Auth, analytics, PDF export, email sharing, and account features are not implemented.
