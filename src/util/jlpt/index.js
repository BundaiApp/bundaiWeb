// Async loader for per-level JLPT kanji data
// Each level has three variants loaded on demand:
//   'light' — just kanjiName + jlpt (for grids/lists, ~2-37KB)
//   'quiz'  — everything except usedIn/similars (for quiz/SRS, ~15-234KB)
//   'full'  — everything (for detail pages, ~500KB-1MB)

const cache = {}

function getImportPath(level, variant) {
  if (variant === 'light') return () => import(`./n${level}-light.json`)
  if (variant === 'quiz') return () => import(`./n${level}-quiz.json`)
  return () => import(`./n${level}.json`)
}

export async function loadLevel(level, variant = 'quiz') {
  const key = `${level}-${variant}`
  if (cache[key]) return cache[key]

  const loader = getImportPath(level, variant)
  const data = (await loader()).default

  cache[key] = data
  return data
}

export async function loadLevelsUpTo(maxLevel, variant = 'quiz') {
  const map = {}
  for (let lvl = 1; lvl <= 5; lvl++) {
    if (lvl <= maxLevel) {
      map[lvl] = await loadLevel(lvl, variant)
    }
  }
  return map
}

export async function loadAllLevels(variant = 'quiz') {
  return loadLevelsUpTo(5, variant)
}
