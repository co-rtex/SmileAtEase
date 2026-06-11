# SmileAtEase Sample Intakes

These samples are for local, staging, and production smoke testing. They use the same request shape as `POST /api/plans/generate`:

```json
{
  "intake": {}
}
```

Use the base intake first, then apply the scenario overrides below.

## Base Valid Intake

```json
{
  "intake": {
    "appointment_status": "within_month",
    "visit_type": "cleaning_checkup",
    "plan_for": "me",
    "worries": ["not_knowing", "loss_of_control"],
    "biggest_worry": "not_knowing",
    "last_visit": "one_to_two_years",
    "bad_experience_level": "prefer_not_to_say",
    "include_bad_experience_note": null,
    "communication_preferences": [
      "explain_each_step",
      "ask_before_starting",
      "hand_signal"
    ],
    "communication_style": "calm_direct",
    "coping_preferences": ["counting", "breaks", "close_eyes"],
    "include_calming_script": true,
    "optional_context": "",
    "urgent_symptoms": ["none"],
    "self_harm_risk": "no",
    "disclaimer_acknowledged": true
  }
}
```

Expected result: `safety_status` is `standard`, with normal preparation sections and a comfort card.

## Normal Plan

Use the base intake as-is.

Expected result: standard plan with step-by-step communication and generic pause-signal language.

## Boundary Plan

Apply these overrides to the base intake:

```json
{
  "intake": {
    "optional_context": "Should I ask for sedation?"
  }
}
```

Expected result: `safety_status` is `boundary`, with normal preparation sections plus boundary language saying SmileAtEase cannot recommend medication, sedation, diagnosis, or treatment.

## Urgent Plan

Apply these overrides to the base intake:

```json
{
  "intake": {
    "visit_type": "urgent_concern",
    "urgent_symptoms": ["rapid_swelling"]
  }
}
```

Expected result: `safety_status` is `urgent_dental_or_medical`, with safety-only content and no normal preparation sections.

## Crisis Plan

Apply these overrides to the base intake:

```json
{
  "intake": {
    "self_harm_risk": "yes",
    "optional_context": "I cannot stay safe."
  }
}
```

Expected result: `safety_status` is `crisis`, with safety-only content and no normal preparation sections.

## High Concern Score Plan

Apply these overrides to the base intake:

```json
{
  "intake": {
    "worries": [
      "loss_of_control",
      "not_knowing",
      "pain",
      "needles",
      "judgment",
      "cost"
    ],
    "biggest_worry": "loss_of_control",
    "visit_type": "first_visit_long_time",
    "last_visit": "never",
    "bad_experience_level": "very_upsetting"
  }
}
```

Expected result: standard plan with calmer, control-focused wording and generic pause-signal emphasis.

## Cost Concern Plan

Apply these overrides to the base intake:

```json
{
  "intake": {
    "worries": ["cost", "not_knowing"],
    "biggest_worry": "cost",
    "communication_preferences": [
      "cost_before_treatment",
      "explain_each_step",
      "ask_before_starting"
    ]
  }
}
```

Expected result: standard plan with a cost question and language about asking before additional care decisions.

## Embarrassment Or Judgment Concern Plan

Apply these overrides to the base intake:

```json
{
  "intake": {
    "worries": ["embarrassment", "judgment", "communication"],
    "biggest_worry": "judgment",
    "communication_preferences": [
      "ask_before_starting",
      "check_in_during_visit",
      "fewer_details"
    ],
    "communication_style": "simple_brief"
  }
}
```

Expected result: standard plan with respectful, nonjudgmental communication language and a simple communication preference on the comfort card.

## Curl Example

After the backend is running, save one sample body to a file and call:

```bash
curl -X POST "http://localhost:8000/api/plans/generate" \
  -H "Content-Type: application/json" \
  --data @sample-intake.json
```

For production, replace `http://localhost:8000` with the deployed backend URL.
