export type ExplorerCategory = "tool" | "protective" | "equipment" | "comfort";

export type ExplorerItem = {
  id: string;
  name: string;
  shortLabel: string;
  category: ExplorerCategory;
  x: number;
  y: number;
  title: string;
  quickSummary: string;
  whatItDoes: string;
  whatYouMayNotice: string;
  whyItHelps: string;
  howToFeelMorePrepared: string[];
  questionToAsk: string;
  gentleReminder?: string;
};
