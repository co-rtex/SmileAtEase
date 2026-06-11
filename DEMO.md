# SmileAtEase Demo Checklist

Use this checklist to run a local demo of the MVP.

## Start The Local Stack

```bash
cp .env.example .env
docker compose up --build
```

Open:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8000/api/health`
- Backend readiness: `http://localhost:8000/api/readiness`

## Normal Plan

1. Go to `http://localhost:3000/start`.
2. Complete the shortened intake.
3. Submit the review screen.
4. Confirm you land on `/result/[planId]`.
5. Confirm the page shows normal preparation sections and a comfort card.

## Boundary Plan

1. Go to `/start`.
2. Complete the shortened intake.
3. In optional details, enter: `Should I ask for sedation?`
4. Submit the review screen.
5. Confirm the result shows a preparation plan with boundary language saying the tool cannot recommend medication, sedation, diagnosis, or treatment.

## Urgent Path

The visible frontend intake no longer asks urgent-symptom questions. Use a direct backend smoke payload from `docs/sample-intakes.md`.

1. Submit the urgent sample to `POST /api/plans/generate`.
2. Open the returned `/result/[planId]`.
3. Confirm the result does not show normal preparation sections.
4. Confirm the result tells the user to contact a dentist, medical professional, or emergency service.

## Crisis Path

The visible frontend intake no longer asks self-harm questions. Use a direct backend smoke payload from `docs/sample-intakes.md`.

1. Submit the crisis sample to `POST /api/plans/generate`.
2. Open the returned `/result/[planId]`.
3. Confirm the result does not show normal preparation sections.
4. Confirm the result includes the 988 crisis support message.

## Enable AI Mode

By default, plans are rule-based.

To enable optional AI generation:

```env
AI_PLAN_MODE=ai
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Restart the backend after changing environment variables.

## Prove Fallback Works

AI fallback is covered by mocked backend tests:

```bash
cd apps/api
.venv/bin/python -m pytest app/tests/test_plan_routes_ai_mode.py
```

The tests verify that invalid or unsafe AI output falls back to rule-based generation and creates a fallback audit event.

## Frontend Smoke Routes

Open these routes manually:

- `/`
- `/start`
- `/guides`
- `/privacy`
- `/terms`
- `/about`
- `/example`

You can also run the lightweight route check:

```bash
cd apps/web
npm run smoke
```

## Known Limitations

- No account system.
- No analytics.
- No email sharing.
- No PDF generation.
- No clinic or resource locator.
- Saved plans are temporary and expire according to `PLAN_RETENTION_DAYS`.
- SmileAtEase is an educational preparation tool. It does not diagnose, treat, or replace professional care.
