export type ProcedureGuide = {
  slug: string;
  title: string;
  summary: string;
  whatToExpect: string[];
  commonWorries: string[];
  questionsToAsk: string[];
  comfortTips: string[];
  reminder: string;
};

export const guides = [
  {
    slug: "cleaning",
    title: "Cleaning and Checkup",
    summary:
      "A simple overview of a routine visit, with questions and comfort preferences you can bring with you.",
    whatToExpect: [
      "The dental team may review your visit goals and ask whether anything has changed since your last appointment.",
      "A cleaning visit usually includes time in the chair, work around the teeth and gums, and a check-in with the dental team.",
      "The team may use different tools, water, suction, lights, and mirrors during the visit.",
      "You can ask what will happen first and how long each part may take.",
    ],
    commonWorries: [
      "Feeling embarrassed about how long it has been.",
      "Not knowing what sounds or sensations to expect.",
      "Wanting a way to pause if something feels overwhelming.",
      "Concern about being judged or rushed.",
    ],
    questionsToAsk: [
      "Can you explain each step before you begin?",
      "Can we agree on a pause signal before we start?",
      "Can you check in with me during the visit?",
      "Can you explain costs before doing anything additional?",
    ],
    comfortTips: [
      "Bring your comfort card and share the parts that matter most.",
      "Ask whether headphones or a small comfort item are allowed.",
      "Choose a pause signal before the visit begins.",
      "If fewer details help, say that clearly before the chair is adjusted.",
    ],
    reminder:
      "This guide is for preparation and communication only. Ask a qualified dental professional about your own care.",
  },
  {
    slug: "x-rays",
    title: "Dental X-Rays",
    summary:
      "A preparation guide for conversations about dental images, positioning, and what to ask before they begin.",
    whatToExpect: [
      "The dental team may explain which images are part of the visit and what they are used to understand.",
      "You may be asked to sit or stand in a certain position while the team lines up the image.",
      "Some images may involve holding a small piece in your mouth for a short time.",
      "You can ask for a brief explanation before each image is taken.",
    ],
    commonWorries: [
      "Gagging or discomfort from holding something in the mouth.",
      "Not knowing how long the image will take.",
      "Feeling awkward about positioning.",
      "Wanting reassurance that you can pause if needed.",
    ],
    questionsToAsk: [
      "What images are planned for today's visit?",
      "Can you tell me how long each image usually takes?",
      "Can I raise my hand if I need to pause?",
      "Can you explain what you are asking me to do before I move?",
    ],
    comfortTips: [
      "Ask for simple, step-by-step instructions.",
      "Use your pause signal if positioning feels difficult.",
      "Tell the team if gagging is a concern before they begin.",
      "Ask whether a short break is possible between images.",
    ],
    reminder:
      "This guide does not decide whether images are appropriate for you. Ask the dental team about your visit and options.",
  },
  {
    slug: "filling",
    title: "Filling Visit",
    summary:
      "A non-clinical preparation guide for a possible filling visit, focused on communication and comfort preferences.",
    whatToExpect: [
      "The dental team may explain the plan for the visit and what part will happen first.",
      "A filling visit can involve several steps, different sounds, water, suction, and time with the mouth open.",
      "The team may pause between parts of the visit to check in or adjust what they are doing.",
      "You can ask for clear previews of sounds and sensations before each step.",
    ],
    commonWorries: [
      "Sounds from dental tools.",
      "Keeping the mouth open for a while.",
      "Feeling unsure about what step is happening.",
      "Wanting to know how to ask for a break.",
    ],
    questionsToAsk: [
      "Can you walk me through the visit before we begin?",
      "Can you tell me before a new sound or sensation starts?",
      "Can we use a hand signal for pauses?",
      "Can you check in with me between steps?",
    ],
    comfortTips: [
      "Agree on a pause signal before the visit begins.",
      "Ask for step-by-step explanations if that helps you feel prepared.",
      "Use headphones if the office allows and you want fewer sounds.",
      "Tell the team if holding your mouth open is a concern.",
    ],
    reminder:
      "This guide does not recommend or choose dental treatment. Use it to prepare questions for a qualified dental professional.",
  },
  {
    slug: "local-anesthesia",
    title: "Local Anesthesia Conversation",
    summary:
      "A guide for preparing communication preferences when a dental team discusses local anesthesia as part of a visit.",
    whatToExpect: [
      "The dental team may explain whether local anesthesia is part of the planned visit and what communication will happen first.",
      "They may describe what you may notice before, during, or after that part of the visit.",
      "You can ask for clear timing, check-ins, and a pause signal before anything begins.",
      "You can ask the team to use the amount of detail that helps you prepare.",
    ],
    commonWorries: [
      "Needles or anticipation.",
      "Not knowing what sensations to expect.",
      "Wanting the team to ask before starting.",
      "Feeling uncertain about how to request a pause.",
    ],
    questionsToAsk: [
      "Can you explain what will happen before it starts?",
      "Can you tell me what sensations I may notice?",
      "Can we agree on a pause signal first?",
      "Can you check in with me before moving to the next step?",
    ],
    comfortTips: [
      "Ask for calm, direct language if that is your preference.",
      "Look away or close your eyes if that helps and the office says it is okay.",
      "Use your pause signal if you need a moment.",
      "Ask for fewer details or more details depending on what helps you prepare.",
    ],
    reminder:
      "This guide does not recommend medication, dosage, anesthesia choices, or sedation. Ask a qualified professional what is appropriate for you.",
  },
  {
    slug: "extraction-consult",
    title: "Extraction Consult",
    summary:
      "A preparation guide for a consultation conversation, focused on questions, preferences, and clear explanations.",
    whatToExpect: [
      "A consult is usually a conversation and evaluation about what the dental team sees and what they may discuss with you.",
      "The team may review images, symptoms you report, costs, timing, and possible next steps.",
      "You can ask for explanations in plain language and take notes.",
      "You can ask what decisions need to be made today and what can be considered later.",
    ],
    commonWorries: [
      "Hearing unexpected news.",
      "Feeling rushed into a decision.",
      "Cost or scheduling concerns.",
      "Not knowing which questions are okay to ask.",
    ],
    questionsToAsk: [
      "What are you seeing, in plain language?",
      "What choices are being discussed today?",
      "What questions should I ask before deciding anything?",
      "Can you explain costs and timing before any next step is scheduled?",
    ],
    comfortTips: [
      "Bring written questions so you do not have to remember them in the moment.",
      "Ask for a pause before decisions are discussed if you need time to think.",
      "Bring a support person if the office allows.",
      "Ask the team to repeat or write down key points.",
    ],
    reminder:
      "This guide does not recommend extraction or any treatment. Use it to prepare for a conversation with a qualified dental professional.",
  },
  {
    slug: "emergency-visit",
    title: "Emergency or Urgent Visit",
    summary:
      "A preparation guide for urgent dental conversations, with reminders to contact qualified help for urgent symptoms.",
    whatToExpect: [
      "The dental or medical team may ask what changed, when it started, and what feels most concerning.",
      "They may focus first on understanding urgent symptoms and what help is needed now.",
      "The visit may feel less predictable than a scheduled appointment.",
      "You can still ask for clear explanations and a pause when it is safe to pause.",
    ],
    commonWorries: [
      "Feeling overwhelmed by urgency.",
      "Not knowing who to contact.",
      "Being unsure how to explain what is happening.",
      "Wanting clear next steps without feeling rushed.",
    ],
    questionsToAsk: [
      "Who should I contact right now for this symptom?",
      "What information do you need from me first?",
      "Can you explain what will happen next?",
      "Can you tell me when I should seek emergency service?",
    ],
    comfortTips: [
      "Write down the main symptom, when it started, and what has changed.",
      "Have your comfort card ready if communication feels difficult.",
      "Ask for short, clear explanations when possible.",
      "If breathing, swallowing, severe injury, uncontrolled bleeding, or rapid swelling is involved, contact a qualified professional or emergency service now.",
    ],
    reminder:
      "This guide cannot evaluate urgent symptoms. Contact a dentist, medical professional, or emergency service for urgent concerns.",
  },
] as const satisfies readonly ProcedureGuide[];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
