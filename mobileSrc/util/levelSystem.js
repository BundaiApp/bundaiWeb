// Level System for 2000 Kanji + Associated Words
import { provideData } from './jlptArray';

export const LEVEL_SYSTEM_CONFIG = {
    totalLevels: 50,
    unlockThreshold: 0.7, // 70% accuracy required to unlock next level
    maxReviewsBeforeUnlock: 3 // Maximum reviews needed per item
};

// Calculate kanji distribution across levels with gradual difficulty progression
const KANJI_PER_LEVEL = {
    // N5: ~80 kanji across levels 1-4 (20 kanji per level for easier start)
    1: { jlptLevel: 5, startIndex: 0, kanjiCount: 20, targetWordCount: 30 },
    2: { jlptLevel: 5, startIndex: 20, kanjiCount: 20, targetWordCount: 30 },
    3: { jlptLevel: 5, startIndex: 40, kanjiCount: 20, targetWordCount: 30 },
    4: { jlptLevel: 5, startIndex: 60, kanjiCount: 20, targetWordCount: 30 },

    // N4: ~166 kanji across levels 5-10 (25-28 kanji per level)
    5: { jlptLevel: 4, startIndex: 0, kanjiCount: 25, targetWordCount: 40 },
    6: { jlptLevel: 4, startIndex: 25, kanjiCount: 25, targetWordCount: 40 },
    7: { jlptLevel: 4, startIndex: 50, kanjiCount: 25, targetWordCount: 40 },
    8: { jlptLevel: 4, startIndex: 75, kanjiCount: 25, targetWordCount: 40 },
    9: { jlptLevel: 4, startIndex: 100, kanjiCount: 28, targetWordCount: 40 },
    10: { jlptLevel: 4, startIndex: 128, kanjiCount: 28, targetWordCount: 40 },

    // N3: ~367 kanji across levels 11-20 (35-40 kanji per level)
    11: { jlptLevel: 3, startIndex: 0, kanjiCount: 35, targetWordCount: 45 },
    12: { jlptLevel: 3, startIndex: 35, kanjiCount: 35, targetWordCount: 45 },
    13: { jlptLevel: 3, startIndex: 70, kanjiCount: 35, targetWordCount: 45 },
    14: { jlptLevel: 3, startIndex: 105, kanjiCount: 35, targetWordCount: 45 },
    15: { jlptLevel: 3, startIndex: 140, kanjiCount: 40, targetWordCount: 50 },
    16: { jlptLevel: 3, startIndex: 180, kanjiCount: 40, targetWordCount: 50 },
    17: { jlptLevel: 3, startIndex: 220, kanjiCount: 40, targetWordCount: 50 },
    18: { jlptLevel: 3, startIndex: 260, kanjiCount: 40, targetWordCount: 50 },
    19: { jlptLevel: 3, startIndex: 300, kanjiCount: 35, targetWordCount: 45 },
    20: { jlptLevel: 3, startIndex: 335, kanjiCount: 32, targetWordCount: 45 },

    // N2: ~367 kanji across levels 21-30 (35-40 kanji per level)
    21: { jlptLevel: 2, startIndex: 0, kanjiCount: 35, targetWordCount: 50 },
    22: { jlptLevel: 2, startIndex: 35, kanjiCount: 35, targetWordCount: 50 },
    23: { jlptLevel: 2, startIndex: 70, kanjiCount: 35, targetWordCount: 50 },
    24: { jlptLevel: 2, startIndex: 105, kanjiCount: 35, targetWordCount: 50 },
    25: { jlptLevel: 2, startIndex: 140, kanjiCount: 40, targetWordCount: 55 },
    26: { jlptLevel: 2, startIndex: 180, kanjiCount: 40, targetWordCount: 55 },
    27: { jlptLevel: 2, startIndex: 220, kanjiCount: 40, targetWordCount: 55 },
    28: { jlptLevel: 2, startIndex: 260, kanjiCount: 40, targetWordCount: 55 },
    29: { jlptLevel: 2, startIndex: 300, kanjiCount: 35, targetWordCount: 50 },
    30: { jlptLevel: 2, startIndex: 335, kanjiCount: 32, targetWordCount: 50 },

    // N1: ~1020 kanji across levels 31-50 (45-55 kanji per level)
    31: { jlptLevel: 1, startIndex: 0, kanjiCount: 45, targetWordCount: 60 },
    32: { jlptLevel: 1, startIndex: 45, kanjiCount: 45, targetWordCount: 60 },
    33: { jlptLevel: 1, startIndex: 90, kanjiCount: 45, targetWordCount: 60 },
    34: { jlptLevel: 1, startIndex: 135, kanjiCount: 45, targetWordCount: 60 },
    35: { jlptLevel: 1, startIndex: 180, kanjiCount: 50, targetWordCount: 65 },
    36: { jlptLevel: 1, startIndex: 230, kanjiCount: 50, targetWordCount: 65 },
    37: { jlptLevel: 1, startIndex: 280, kanjiCount: 50, targetWordCount: 65 },
    38: { jlptLevel: 1, startIndex: 330, kanjiCount: 50, targetWordCount: 65 },
    39: { jlptLevel: 1, startIndex: 380, kanjiCount: 50, targetWordCount: 65 },
    40: { jlptLevel: 1, startIndex: 430, kanjiCount: 50, targetWordCount: 65 },
    41: { jlptLevel: 1, startIndex: 480, kanjiCount: 55, targetWordCount: 70 },
    42: { jlptLevel: 1, startIndex: 535, kanjiCount: 55, targetWordCount: 70 },
    43: { jlptLevel: 1, startIndex: 590, kanjiCount: 55, targetWordCount: 70 },
    44: { jlptLevel: 1, startIndex: 645, kanjiCount: 55, targetWordCount: 70 },
    45: { jlptLevel: 1, startIndex: 700, kanjiCount: 55, targetWordCount: 70 },
    46: { jlptLevel: 1, startIndex: 755, kanjiCount: 55, targetWordCount: 70 },
    47: { jlptLevel: 1, startIndex: 810, kanjiCount: 55, targetWordCount: 70 },
    48: { jlptLevel: 1, startIndex: 865, kanjiCount: 55, targetWordCount: 70 },
    49: { jlptLevel: 1, startIndex: 920, kanjiCount: 50, targetWordCount: 65 },
    50: { jlptLevel: 1, startIndex: 970, kanjiCount: 50, targetWordCount: 65 },
};

export const getLevelContent = (level) => {
    const config = KANJI_PER_LEVEL[level];

    if (!config) {
        throw new Error(`Level ${level} not found`);
    }

    try {
        // Get JLPT data for the specific level
        const jlptData = provideData('jlpt', config.jlptLevel, true);
        const levelKanji = jlptData[config.jlptLevel];

        if (!levelKanji || levelKanji.length === 0) {
            throw new Error(`No kanji data found for JLPT level ${config.jlptLevel}`);
        }

        // Get the kanji for this specific level
        const kanjiForLevel = levelKanji.slice(config.startIndex, config.startIndex + config.kanjiCount);

        const levelData = {
            kanji: [],
            words: []
        };

        // Collect all kanji characters first to avoid duplicates in words
        const kanjiCharacters = new Set();
        kanjiForLevel.forEach(kanjiItem => {
            if (kanjiItem && kanjiItem.kanjiName) {
                kanjiCharacters.add(kanjiItem.kanjiName);
            }
        });

        // Get all known kanji for easiness factor (from current and previous levels)
        const knownKanji = getAllKnownKanji(level);

        // Process each kanji to add to kanji section
        kanjiForLevel.forEach(kanjiItem => {
            if (kanjiItem && kanjiItem.kanjiName) {
                // Add the kanji itself
                levelData.kanji.push({
                    kanji: kanjiItem.kanjiName,
                    reading: kanjiItem.kun?.[0] || kanjiItem.on?.[0] || '',
                    meaning: kanjiItem.meanings?.[0] || ''
                });
            }
        });

        // Collect all possible words from all kanji for target-based selection
        const allCandidateWords = [];
        kanjiForLevel.forEach(kanjiItem => {
            if (kanjiItem && kanjiItem.kanjiName && kanjiItem.usedIn && Array.isArray(kanjiItem.usedIn)) {
                kanjiItem.usedIn.forEach(wordItem => {
                    if (wordItem && wordItem.kanji && wordItem.frequency) {
                        allCandidateWords.push(wordItem);
                    }
                });
            }
        });

        // Process and select words based on target count
        const targetWordCount = config.targetWordCount || 50;
        const selectedWords = allCandidateWords
            .filter(word => !kanjiCharacters.has(word.kanji)) // Exclude standalone kanji
            .sort((a, b) => a.frequency - b.frequency) // Sort by frequency ascending (lower = more common)
            .slice(0, targetWordCount * 3) // Take top candidates for filtering (3x target for better selection)
            .filter(word => isWordAppropriateForLevel(word, level, knownKanji)) // Apply easiness factor
            .slice(0, targetWordCount); // Take final target amount

        // Add selected words to levelData
        selectedWords.forEach(wordItem => {
            levelData.words.push({
                word: wordItem.kanji,
                reading: wordItem.reading || wordItem.hiragana || '',
                meaning: wordItem.meaning || ''
            });
        });

        return levelData;
    } catch (error) {
        console.error(`Error getting level ${level} content:`, error);
        throw new Error(`Failed to load level ${level} content`);
    }
};

// Helper function to get all kanji from previous levels (including current level)
const getAllKnownKanji = (currentLevel) => {
    const knownKanji = new Set();

    for (let lvl = 1; lvl <= currentLevel; lvl++) {
        const config = KANJI_PER_LEVEL[lvl];
        if (config) {
            try {
                const jlptData = provideData('jlpt', config.jlptLevel, true);
                const levelKanji = jlptData[config.jlptLevel];

                if (levelKanji && levelKanji.length > 0) {
                    const kanjiForLevel = levelKanji.slice(config.startIndex, config.startIndex + config.kanjiCount);
                    kanjiForLevel.forEach(kanjiItem => {
                        if (kanjiItem && kanjiItem.kanjiName) {
                            knownKanji.add(kanjiItem.kanjiName);
                        }
                    });
                }
            } catch (error) {
                console.warn(`Could not load kanji for level ${lvl}`);
            }
        }
    }

    return knownKanji;
};

// Helper function to check if a word is appropriate for the current level
const isWordAppropriateForLevel = (word, currentLevel, knownKanji) => {
    const wordText = word.kanji;

    // Skip if word is empty or null
    if (!wordText) return false;

    // Get word length (number of kanji characters)
    const wordLength = wordText.length;

    // Level-based word length restrictions
    if (currentLevel <= 5 && wordLength > 2) return false;  // Levels 1-5: max 2 kanji
    if (currentLevel <= 10 && wordLength > 3) return false; // Levels 6-10: max 3 kanji

    // Check if all kanji in the word are known (from current or previous levels)
    for (const char of wordText) {
        // Skip non-kanji characters (hiragana, katakana, punctuation)
        if (char.match(/[\u3040-\u309F\u30A0-\u30FF\u3000-\u303F\uFF00-\uFFEF]/)) {
            continue;
        }

        // If it's a kanji character and not known, reject the word
        if (!knownKanji.has(char)) {
            return false;
        }
    }

    return true;
};

const getDifficultyLabel = (jlptLevel) => {
    const labels = {
        5: 'Beginner',
        4: 'Elementary',
        3: 'Intermediate',
        2: 'Upper Intermediate',
        1: 'Advanced'
    };
    return labels[jlptLevel] || 'Unknown';
};

export const getLevelInfo = (level) => {
    const config = KANJI_PER_LEVEL[level];

    if (!config) {
        return null;
    }

    return {
        level: level,
        jlptLevel: `N${config.jlptLevel}`,
        kanjiCount: config.kanjiCount,
        targetWordCount: config.targetWordCount,
        difficulty: getDifficultyLabel(config.jlptLevel)
    };
};