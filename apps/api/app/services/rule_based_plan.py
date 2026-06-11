from __future__ import annotations

from app.schemas.assessment import (
  CommunicationPreference,
  CommunicationStyle,
  CopingPreference,
  IncludeBadExperienceNote,
  IntakeSchema,
  WorryKey,
)
from app.schemas.plan import ComfortCardSchema, PlanSchema
from app.schemas.plan import SafetyStatus as PlanSafetyStatus
from app.services.safety import (
  SafetyResult,
  SafetyStatus,
  build_boundary_message,
  build_crisis_response,
  build_urgent_response,
)

WORRY_LABELS = {
  WorryKey.PAIN: "Pain",
  WorryKey.NEEDLES: "Needles",
  WorryKey.DRILL_SOUNDS: "Drill sounds",
  WorryKey.EMBARRASSMENT: "Embarrassment",
  WorryKey.JUDGMENT: "Feeling judged",
  WorryKey.NOT_KNOWING: "Not knowing what will happen",
  WorryKey.COST: "Cost",
  WorryKey.GAGGING: "Gagging",
  WorryKey.LOSS_OF_CONTROL: "Loss of control",
  WorryKey.BAD_PAST_EXPERIENCE: "A bad past experience",
  WorryKey.SENSORY: "Sensory discomfort",
  WorryKey.MOUTH_OPEN: "Keeping your mouth open",
  WorryKey.BAD_NEWS: "Hearing unexpected news",
  WorryKey.COMMUNICATION: "Communication",
  WorryKey.OTHER: "Other concern",
}

GENERIC_PAUSE_SIGNAL_TEXT = (
  "I would like to agree on a clear pause signal before the visit begins."
)

COMMUNICATION_STYLE_TEXT = {
  CommunicationStyle.CALM_DIRECT: "Calm, direct communication helps me.",
  CommunicationStyle.VERY_DETAILED: (
    "Detailed explanations help me feel prepared."
  ),
  CommunicationStyle.SIMPLE_BRIEF: (
    "Simple, brief explanations help me follow along."
  ),
  CommunicationStyle.ASK_BEFORE_DETAILS: (
    "Please ask before giving extra details."
  ),
}

COMMUNICATION_HELP = {
  CommunicationPreference.EXPLAIN_EACH_STEP: (
    "Please explain each step before starting."
  ),
  CommunicationPreference.ASK_BEFORE_STARTING: (
    "Please ask before starting each part of the visit."
  ),
  CommunicationPreference.CHECK_IN_DURING_VISIT: (
    "Please check in during the visit."
  ),
  CommunicationPreference.HAND_SIGNAL: (
    "Please watch for the pause signal we agreed on."
  ),
  CommunicationPreference.SHORT_BREAKS: (
    "Short breaks help me reset."
  ),
  CommunicationPreference.KNOW_SOUNDS_SENSATIONS: (
    "Knowing what sounds or sensations to expect helps me feel prepared."
  ),
  CommunicationPreference.COST_BEFORE_TREATMENT: (
    "Please explain costs before doing anything additional."
  ),
  CommunicationPreference.SUPPORT_PERSON: (
    "A support person may help if the office allows it."
  ),
  CommunicationPreference.FEWER_DETAILS: (
    "Fewer details are easier for me unless I ask for more."
  ),
  CommunicationPreference.DETAILED_EXPLANATIONS: (
    "Detailed explanations help me feel more prepared."
  ),
}

COPING_HELP = {
  CopingPreference.HEADPHONES: "Use headphones if the office allows.",
  CopingPreference.COUNTING: "Try quiet counting during waiting moments.",
  CopingPreference.STRESS_OBJECT: (
    "Hold a small comfort item if the office allows."
  ),
  CopingPreference.BREAKS: "Ask for short breaks when you need them.",
  CopingPreference.SUPPORT_PERSON: (
    "Bring a support person if the office allows."
  ),
  CopingPreference.CLOSE_EYES: "Close your eyes if that feels easier.",
}


def generate_rule_based_plan(
  intake: IntakeSchema,
  safety_result: SafetyResult,
) -> PlanSchema:
  if safety_result.safety_status == SafetyStatus.CRISIS:
    return _safety_only_plan(
      safety_status=PlanSafetyStatus.CRISIS,
      title="Immediate support may be needed",
      important_reminder="This website cannot provide crisis support.",
      blocked_or_redirect_message=build_crisis_response(),
    )

  if safety_result.safety_status == SafetyStatus.URGENT_DENTAL_OR_MEDICAL:
    return _safety_only_plan(
      safety_status=PlanSafetyStatus.URGENT_DENTAL_OR_MEDICAL,
      title="This may need urgent care",
      important_reminder="This website cannot evaluate urgent symptoms.",
      blocked_or_redirect_message=build_urgent_response(),
    )

  return _standard_plan(intake, safety_result)


def _safety_only_plan(
  *,
  safety_status: PlanSafetyStatus,
  title: str,
  important_reminder: str,
  blocked_or_redirect_message: str,
) -> PlanSchema:
  return PlanSchema(
    safety_status=safety_status,
    title=title,
    gentle_summary="",
    main_concerns=[],
    before_visit=[],
    when_you_arrive=[],
    during_visit=[],
    if_overwhelmed=[],
    questions_to_ask=[],
    comfort_card=ComfortCardSchema(
      intro="",
      my_concerns=[],
      what_helps_me=[],
      pause_signal="",
      communication_preference="",
    ),
    important_reminder=important_reminder,
    blocked_or_redirect_message=blocked_or_redirect_message,
  )


def _standard_plan(
  intake: IntakeSchema,
  safety_result: SafetyResult,
) -> PlanSchema:
  worries = set(intake.worries)
  main_concerns = [
    _worry_label(worry, intake.include_bad_experience_note)
    for worry in intake.worries
  ]
  biggest_worry = _worry_label(
    intake.biggest_worry,
    intake.include_bad_experience_note,
  )
  communication_style = COMMUNICATION_STYLE_TEXT[intake.communication_style]

  before_visit = [
    "Write down your top questions and bring them with you.",
    "Tell the office that dental visits can make you nervous and that clear communication helps.",
    "Plan to agree on a clear pause signal before the visit.",
  ]
  when_you_arrive = [
    "Let the front desk or dental team know you have a short comfort card.",
    "Confirm a clear pause signal before the visit begins.",
    "Ask what will happen first.",
  ]
  during_visit = [
    "Use the agreed pause signal if you need a break.",
    "Tell the dental team if something hurts or feels overwhelming.",
    "Ask for the next step to be explained in the amount of detail you prefer.",
  ]
  if_overwhelmed = [
    "Pause and take a few slow breaths.",
    "Ask for a short break.",
    "Use the pause signal you agreed on.",
  ]
  questions_to_ask = [
    "What will happen during this visit?",
    "Can we agree on a pause signal before we begin?",
    "What should I do if I need a short break?",
  ]
  what_helps_me = [
    communication_style,
    "Please pause if I use the signal we agreed on.",
  ]

  if intake.concern_score >= 8:
    _append_unique(
      before_visit,
      "Plan one simple comfort strategy before you leave for the appointment.",
    )
    _append_unique(
      during_visit,
      "Ask for clear check-ins and short pauses so the visit feels more predictable.",
    )
    _append_unique(
      what_helps_me,
      "Clear check-ins and short pauses help me feel more in control.",
    )

  if WorryKey.COST in worries:
    _append_unique(
      questions_to_ask,
      "Can you explain costs before doing anything additional?",
    )

  if worries.intersection({WorryKey.EMBARRASSMENT, WorryKey.JUDGMENT}):
    _append_unique(
      during_visit,
      "Ask the team to use respectful, nonjudgmental language.",
    )
    _append_unique(
      what_helps_me,
      "Respectful, nonjudgmental language helps me stay engaged.",
    )

  if WorryKey.NOT_KNOWING in worries:
    _append_unique(
      before_visit,
      "Write down that step-by-step explanations help you prepare.",
    )
    _append_unique(
      during_visit,
      "Ask for step-by-step explanations before each part begins.",
    )
    _append_unique(
      questions_to_ask,
      "Can you explain each step before starting?",
    )

  if worries.intersection({WorryKey.PAIN, WorryKey.NEEDLES}):
    _append_unique(
      before_visit,
      "Write down that you want to know what sensations to expect.",
    )
    _append_unique(
      during_visit,
      "Ask what to expect before each step and speak up if something hurts.",
    )
    _append_unique(
      questions_to_ask,
      "What sensations should I expect during today's visit?",
    )

  if WorryKey.GAGGING in worries:
    _append_unique(
      before_visit,
      "Write down that gagging is a concern so you can mention it clearly.",
    )
    _append_unique(
      during_visit,
      "Tell the dental team gagging is a concern and ask for breaks when needed.",
    )

  if WorryKey.LOSS_OF_CONTROL in worries:
    _append_unique(
      during_visit,
      "Use the agreed pause signal early if you need a moment.",
    )
    _append_unique(
      what_helps_me,
      "Knowing I can pause helps me feel more in control.",
    )

  if WorryKey.BAD_PAST_EXPERIENCE in worries:
    if (
      intake.include_bad_experience_note
      == IncludeBadExperienceNote.YES_GENTLE_NOTE
    ):
      _append_unique(
        before_visit,
        "If you want, share a gentle note that a past visit was upsetting and clear communication helps.",
      )
      _append_unique(
        what_helps_me,
        "A gentle acknowledgement of a difficult past visit helps me communicate.",
      )
    elif (
      intake.include_bad_experience_note
      == IncludeBadExperienceNote.ONLY_EXTRA_COMMUNICATION
    ):
      _append_unique(
        before_visit,
        "Ask for extra communication without sharing private details.",
      )

  for preference in intake.communication_preferences:
    _append_unique(what_helps_me, COMMUNICATION_HELP[preference])
    if preference in {
      CommunicationPreference.EXPLAIN_EACH_STEP,
      CommunicationPreference.ASK_BEFORE_STARTING,
      CommunicationPreference.CHECK_IN_DURING_VISIT,
      CommunicationPreference.HAND_SIGNAL,
      CommunicationPreference.SHORT_BREAKS,
      CommunicationPreference.KNOW_SOUNDS_SENSATIONS,
      CommunicationPreference.FEWER_DETAILS,
      CommunicationPreference.DETAILED_EXPLANATIONS,
    }:
      _append_unique(during_visit, COMMUNICATION_HELP[preference])
    if preference == CommunicationPreference.COST_BEFORE_TREATMENT:
      _append_unique(
        questions_to_ask,
        "Can you explain costs before doing anything additional?",
      )
    if preference == CommunicationPreference.SUPPORT_PERSON:
      _append_unique(
        before_visit,
        "Ask whether a support person can come with you.",
      )

  for preference in intake.coping_preferences:
    coping_text = COPING_HELP[preference]
    _append_unique(if_overwhelmed, coping_text)
    if preference in {
      CopingPreference.HEADPHONES,
      CopingPreference.SUPPORT_PERSON,
      CopingPreference.CLOSE_EYES,
      CopingPreference.BREAKS,
    }:
      _append_unique(during_visit, coping_text)
    _append_unique(what_helps_me, coping_text)

  safety_status = PlanSafetyStatus(safety_result.safety_status.value)
  important_reminder = (
    "This plan is for preparation and communication only. It does not diagnose "
    "or replace professional care. For urgent symptoms, contact a dental, "
    "medical, or emergency professional."
  )

  if safety_status == PlanSafetyStatus.BOUNDARY:
    important_reminder = f"{important_reminder} {build_boundary_message()}"

  return PlanSchema(
    safety_status=safety_status,
    title="Your Dental Visit Preparation Plan",
    gentle_summary=(
      f"Your biggest concern is {biggest_worry.lower()}. This plan focuses on "
      "clear communication, predictable steps, and agreed pauses so you can "
      "feel prepared for the visit."
    ),
    main_concerns=main_concerns,
    before_visit=before_visit,
    when_you_arrive=when_you_arrive,
    during_visit=during_visit,
    if_overwhelmed=if_overwhelmed,
    questions_to_ask=questions_to_ask,
    comfort_card=ComfortCardSchema(
      intro="I feel nervous during dental visits, and this card helps me communicate clearly.",
      my_concerns=main_concerns[:5],
      what_helps_me=what_helps_me[:8],
      pause_signal=GENERIC_PAUSE_SIGNAL_TEXT,
      communication_preference=communication_style,
    ),
    important_reminder=important_reminder,
    blocked_or_redirect_message=None,
  )


def _append_unique(items: list[str], value: str) -> None:
  if value not in items:
    items.append(value)


def _worry_label(
  worry: WorryKey,
  include_bad_experience_note: IncludeBadExperienceNote | None,
) -> str:
  if worry != WorryKey.BAD_PAST_EXPERIENCE:
    return WORRY_LABELS[worry]

  if include_bad_experience_note == IncludeBadExperienceNote.YES_GENTLE_NOTE:
    return WORRY_LABELS[worry]

  if (
    include_bad_experience_note
    == IncludeBadExperienceNote.ONLY_EXTRA_COMMUNICATION
  ):
    return "Wanting extra communication"

  return "Private concern"
