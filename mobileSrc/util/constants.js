import COLORS from "../theme/colors";

export const whichColor = {
  Stroke: COLORS.interactiveSurface,
  Verbs: COLORS.interactiveSurface,
  JLPT: COLORS.interactiveSurface,
  Nouns: COLORS.interactiveSurface,
  Grade: COLORS.interactiveSurface,
  Adj: COLORS.interactiveSurface,
  Adverbs: COLORS.interactiveSurface,
  Hiragana: COLORS.interactiveSurface,
  Katakana: COLORS.interactiveSurface,
  All: COLORS.interactiveSurface,
  LevelAll: COLORS.interactiveSurface,
};

export const whichTextColor = {
  Stroke: COLORS.interactiveTextInactive,
  Verbs: COLORS.interactiveTextInactive,
  JLPT: COLORS.interactiveTextInactive,
  Nouns: COLORS.interactiveTextInactive,
  Grade: COLORS.interactiveTextInactive,
  Adj: COLORS.interactiveTextInactive,
  Adverbs: COLORS.interactiveTextInactive,
  Hiragana: COLORS.interactiveTextInactive,
  Katakana: COLORS.interactiveTextInactive,
  All: COLORS.interactiveTextInactive,
  LevelAll: COLORS.interactiveTextInactive,
};

export const topics = [
  {
    topicName: "jlpt",
    header: "JLPT",
    subtitle: "N1-N5",
  },
  {
    topicName: "strokes",
    header: "Stroke",
    subtitle: "1-24",
  },
  {
    topicName: "grades",
    header: "Grade",
    subtitle: "1-9",
  },
];

export const words = [
  {
    topicName: "verbs",
    header: "Verbs",
    subtitle: "300 verbs",
  },
  {
    topicName: "nouns",
    header: "Nouns",
    subtitle: "350 nouns",
  },
  {
    topicName: "adjectives",
    header: "Adj",
    subtitle: "adjectives",
  },
  {
    topicName: "adverbs",
    header: "Adverbs",
    subtitle: "100 Adverbs",
  },
];

export const kana = [
  {
    topicName: "katakana",
    header: "Katakana",
  },
  {
    topicName: "hiragana",
    header: "Hiragana",
  },
];
