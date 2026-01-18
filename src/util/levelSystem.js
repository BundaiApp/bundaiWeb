// Level System for 2000 Kanji + Associated Words
export const LEVEL_SYSTEM_CONFIG = {
    totalLevels: 50,
    unlockThreshold: 0.5, // 50% mastery required to unlock next level
    maxReviewsBeforeUnlock: 3 // Maximum reviews needed per item
};

const ensureArray = (value) => {
    if (Array.isArray(value)) {
        return value.filter(Boolean).map(String);
    }
    if (value === null || value === undefined) {
        return [];
    }
    return [String(value)].filter(Boolean);
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

export const getLevelContent = (level, jlptDataMap) => {
    const config = KANJI_PER_LEVEL[level];

    if (!config) {
        throw new Error(`Level ${level} not found`);
    }

    try {
        const jlptData = jlptDataMap[config.jlptLevel];

        if (!jlptData || jlptData.length === 0) {
            throw new Error(`No kanji data found for JLPT level ${config.jlptLevel}`);
        }

        const kanjiForLevel = jlptData.slice(config.startIndex, config.startIndex + config.kanjiCount);

        const levelData = {
            kanji: [],
            words: []
        };

        const kanjiCharacters = new Set();
        kanjiForLevel.forEach(kanjiItem => {
            if (kanjiItem && kanjiItem.kanjiName) {
                kanjiCharacters.add(kanjiItem.kanjiName);
            }
        });

        const knownKanji = getAllKnownKanji(level, jlptDataMap);

        kanjiForLevel.forEach(kanjiItem => {
            if (kanjiItem && kanjiItem.kanjiName) {
                levelData.kanji.push({
                    kanji: kanjiItem.kanjiName,
                    kanjiName: kanjiItem.kanjiName,
                    reading: kanjiItem.kun?.[0] || kanjiItem.on?.[0] || '',
                    meaning: kanjiItem.meanings?.[0] || '',
                    meanings: ensureArray(kanjiItem.meanings),
                    quizAnswers: ensureArray(kanjiItem.quizAnswers),
                    on: ensureArray(kanjiItem.on),
                    kun: ensureArray(kanjiItem.kun),
                    usedIn: kanjiItem.usedIn || [],
                    similars: kanjiItem.similars || [],
                    jlptLevel: kanjiItem.jlpt,
                    jlpt: kanjiItem.jlpt,
                    grade: kanjiItem.grade,
                    strokes: kanjiItem.strokes,
                    frequency: kanjiItem.freq,
                    freq: kanjiItem.freq
                });
            }
        });

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

        const targetWordCount = config.targetWordCount || 50;

        const uniqueWords = Array.from(
            new Map(allCandidateWords.map(word => [word.kanji, word])).values()
        );

        const selectedWords = uniqueWords
            .filter(word => !kanjiCharacters.has(word.kanji))
            .sort((a, b) => a.frequency - b.frequency)
            .slice(0, targetWordCount * 3)
            .filter(word => isWordAppropriateForLevel(word, level, knownKanji))
            .slice(0, targetWordCount);

        selectedWords.forEach(wordItem => {
            levelData.words.push({
                word: wordItem.kanji,
                reading: wordItem.reading || wordItem.hiragana || '',
                meaning: wordItem.meaning || '',
                meanings: ensureArray(wordItem.meanings || wordItem.meaning),
                quizAnswers: ensureArray(wordItem.quizAnswers)
            });
        });

        return levelData;
    } catch (error) {
        console.error(`Error getting level ${level} content:`, error);
        throw new Error(`Failed to load level ${level} content`);
    }
};

const getAllKnownKanji = (currentLevel, jlptDataMap) => {
    const knownKanji = new Set();

    for (let lvl = 1; lvl <= currentLevel; lvl++) {
        const config = KANJI_PER_LEVEL[lvl];
        if (config) {
            try {
                const jlptData = jlptDataMap[config.jlptLevel];

                if (jlptData && jlptData.length > 0) {
                    const kanjiForLevel = jlptData.slice(config.startIndex, config.startIndex + config.kanjiCount);
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

const isWordAppropriateForLevel = (word, currentLevel, knownKanji) => {
    const wordText = word.kanji;

    if (!wordText) return false;

    const wordLength = wordText.length;

    if (currentLevel <= 5 && wordLength > 2) return false;
    if (currentLevel <= 10 && wordLength > 3) return false;

    for (const char of wordText) {
        if (char.match(/[\u3040-\u309F\u30A0-\u30FF\u3000-\u303F\uFF00-\uFFEF]/)) {
            continue;
        }

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
