import type { ExplorerItem } from "./explorerSchema";

export const explorerImage = {
  src: "/images/explorer/dental-tool-tray.png",
  alt: "A clean dental instrument tray with common tools arranged neatly, including a mouth mirror, suction tool, air and water tool, polishing tool, cotton, gloves, mask, and cup.",
};

export const explorerItems: ExplorerItem[] = [
  {
    id: "mouth-mirror",
    name: "Mouth mirror",
    shortLabel: "Mirror",
    category: "tool",
    x: 13,
    y: 54,
    title: "Mouth mirror",
    quickSummary:
      "A small mirror that helps the dental team see different areas of your mouth.",
    whatItDoes:
      "The mouth mirror helps the dentist or hygienist see teeth and gums from angles that are hard to view directly.",
    whatYouMayNotice:
      "It may feel cool or unfamiliar when it touches the inside of your cheek or near your teeth.",
    whyItHelps:
      "It helps the dental team look carefully without needing to guess or move your mouth as much.",
    howToFeelMorePrepared: [
      "Ask to see the mirror before it is used.",
      "Ask the dental team to explain when they are switching tools.",
      "Use your comfort card if you want slower explanations.",
    ],
    questionToAsk: "Can you show me what this tool is before you use it?",
    gentleReminder: "The dental team can explain what they are looking at.",
  },
  {
    id: "explorer-probe",
    name: "Explorer or probe",
    shortLabel: "Probe",
    category: "tool",
    x: 26,
    y: 53,
    title: "Explorer or probe",
    quickSummary:
      "A slender tool that may be used to gently check surfaces or areas.",
    whatItDoes:
      "The explorer or probe can help the dental team check specific spots and understand what they are seeing.",
    whatYouMayNotice:
      "It can look pointed. You may notice light contact or a small tapping sound when it touches another tool.",
    whyItHelps:
      "It gives the dental team a more careful way to check areas instead of relying only on sight.",
    howToFeelMorePrepared: [
      "Ask the dental team to explain what they are checking before they use it.",
      "Agree on a simple pause signal before the visit begins.",
      "Ask for a brief warning before a new tool is used.",
    ],
    questionToAsk: "Can you tell me what this tool is checking before you use it?",
  },
  {
    id: "suction-tool",
    name: "Suction tool",
    shortLabel: "Suction",
    category: "tool",
    x: 38,
    y: 56,
    title: "Suction tool",
    quickSummary:
      "A small suction tool that helps remove extra water or saliva.",
    whatItDoes:
      "The suction tool helps keep the area clear so the dental team can see and work more easily.",
    whatYouMayNotice:
      "It may make a slurping or whooshing sound and may feel like a small vacuum near your cheek or tongue.",
    whyItHelps:
      "It can make the visit feel more organized by clearing extra moisture instead of letting it collect.",
    howToFeelMorePrepared: [
      "Ask for a heads-up before suction is used.",
      "Ask where the suction tip will rest.",
      "Use your agreed pause signal if you need a short break.",
    ],
    questionToAsk: "Can you tell me before using suction and pause if I raise my hand?",
  },
  {
    id: "air-water-tool",
    name: "Air and water tool",
    shortLabel: "Air/water",
    category: "tool",
    x: 53,
    y: 55,
    title: "Air and water tool",
    quickSummary:
      "A tool that can send a quick puff of air or a small stream of water.",
    whatItDoes:
      "The air and water tool may be used to rinse an area, clear small debris, or dry a spot so the dental team can see better.",
    whatYouMayNotice:
      "It may feel cool, splashy, or breezy for a moment and can make a short puff or spray sound.",
    whyItHelps:
      "It helps the dental team keep the area easier to see and explain what they are doing.",
    howToFeelMorePrepared: [
      "Ask for a warning before air or water is used.",
      "Ask whether it will be air, water, or both.",
      "Ask for short pauses if repeated sprays feel surprising.",
    ],
    questionToAsk: "Can you let me know before using air or water?",
  },
  {
    id: "polishing-tool",
    name: "Polishing tool",
    shortLabel: "Polisher",
    category: "tool",
    x: 67,
    y: 54,
    title: "Polishing tool",
    quickSummary:
      "A tool that may be used during cleaning or polishing parts of the visit.",
    whatItDoes:
      "The polishing tool may help clean or smooth tooth surfaces when the dental team includes polishing in the visit.",
    whatYouMayNotice:
      "It may hum or vibrate lightly, and you may notice pressure or a spinning feeling for short moments.",
    whyItHelps:
      "It gives the dental team a controlled way to polish small areas while they guide the tool.",
    howToFeelMorePrepared: [
      "Ask what the polisher may feel like before it starts.",
      "Ask the dental team to tell you when the sound is about to begin.",
      "Ask for breaks if you prefer shorter stretches.",
    ],
    questionToAsk: "Can you explain what the polisher may sound or feel like first?",
  },
  {
    id: "cotton-gauze",
    name: "Cotton or gauze",
    shortLabel: "Gauze",
    category: "comfort",
    x: 79,
    y: 62,
    title: "Cotton or gauze",
    quickSummary:
      "Soft material that may help absorb moisture or keep an area easier to see.",
    whatItDoes:
      "Cotton or gauze may be placed briefly to help manage moisture or keep part of the mouth more open for the dental team.",
    whatYouMayNotice:
      "It may feel soft, dry, or slightly bulky while it rests in place.",
    whyItHelps:
      "It can help the dental team keep the visit organized without needing to ask you to move as much.",
    howToFeelMorePrepared: [
      "Ask why the gauze is being used.",
      "Ask how long it may stay in place.",
      "Tell the dental team if you want them to explain before placing it.",
    ],
    questionToAsk: "Can you tell me what the gauze is for and when it comes out?",
  },
  {
    id: "gloves-mask",
    name: "Gloves and mask",
    shortLabel: "Gloves",
    category: "protective",
    x: 90,
    y: 29,
    title: "Gloves and mask",
    quickSummary:
      "Protective items the dental team may use during a visit.",
    whatItDoes:
      "Gloves and masks help the dental team follow office safety routines while they work near your mouth.",
    whatYouMayNotice:
      "Gloves may make a soft stretch sound. A mask may make speech sound slightly quieter.",
    whyItHelps:
      "They are part of the normal setup for many dental visits and help keep the room routine consistent.",
    howToFeelMorePrepared: [
      "Ask the team to speak clearly if the mask makes words harder to hear.",
      "Ask them to repeat instructions when needed.",
      "Ask who will be in the room before the visit begins.",
    ],
    questionToAsk: "Can you speak slowly or repeat instructions if I miss something?",
  },
  {
    id: "cup",
    name: "Cup",
    shortLabel: "Cup",
    category: "comfort",
    x: 8,
    y: 26,
    title: "Cup",
    quickSummary:
      "A small cup that may be used for rinsing or water, depending on the office setup.",
    whatItDoes:
      "The cup may be available if the dental team asks you to rinse or if water is part of the room setup.",
    whatYouMayNotice:
      "You may hear water poured or see the cup moved on the tray.",
    whyItHelps:
      "It gives the dental team a simple way to guide rinsing or water use when that is part of the visit flow.",
    howToFeelMorePrepared: [
      "Ask when you should use the cup.",
      "Ask whether you should wait for instructions before rinsing.",
      "Ask for a short pause if you need a moment before continuing.",
    ],
    questionToAsk: "Can you tell me when you want me to use the cup?",
  },
];

export function getExplorerItemById(itemId: string | null) {
  return explorerItems.find((item) => item.id === itemId) ?? null;
}
