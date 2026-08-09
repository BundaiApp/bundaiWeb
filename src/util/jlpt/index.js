// Async loader for per-level JLPT kanji data
// Each level is a separate JSON file (~200KB-1MB) loaded on demand

const cache = {}

export async function loadLevel(level) {
  if (cache[level]) return cache[level]

  let data
  switch (level) {
    case 1: data = (await import('./n1.json')).default; break
    case 2: data = (await import('./n2.json')).default; break
    case 3: data = (await import('./n3.json')).default; break
    case 4: data = (await import('./n4.json')).default; break
    case 5: data = (await import('./n5.json')).default; break
    default: throw new Error(`Invalid JLPT level: ${level}`)
  }

  cache[level] = data
  return data
}

export async function loadLevelsUpTo(maxLevel) {
  const map = {}
  for (let lvl = 1; lvl <= 5; lvl++) {
    if (lvl <= maxLevel) {
      map[lvl] = await loadLevel(lvl)
    }
  }
  return map
}

export async function loadAllLevels() {
  return loadLevelsUpTo(5)
}
