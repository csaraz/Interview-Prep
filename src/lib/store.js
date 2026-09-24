// Persistent user state (read progress, favorites, review queue, visit tracking).
// Everything lives in localStorage — no backend, works offline and in the mobile app.

const KEY = 'interview-prep-state-v1'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* private mode / quota — tracking is best-effort */
  }
}

export function getState() {
  const s = load()
  return {
    read: s.read || [],
    favs: s.favs || [],
    review: s.review || [],
    visits: s.visits || {}, // { slug: { count, last, firstSeen } }
  }
}

export function toggleIn(listName, slug) {
  const state = getState()
  const set = new Set(state[listName])
  if (set.has(slug)) set.delete(slug)
  else set.add(slug)
  state[listName] = [...set]
  save(state)
  return state
}

export function setReview(slug, needsReview) {
  const state = getState()
  const set = new Set(state.review)
  if (needsReview) set.add(slug)
  else set.delete(slug)
  state.review = [...set]
  save(state)
  return state
}

export function markRead(slug) {
  const state = getState()
  const set = new Set(state.read)
  set.add(slug)
  state.read = [...set]
  save(state)
  return state
}

// Re-opens closer together than this are treated as the same visit.
// Guards against React StrictMode double-invoking effects and accidental re-renders.
const VISIT_DEBOUNCE_MS = 2000

/** Called every time an article page is opened. */
export function recordVisit(slug) {
  const state = getState()
  const now = Date.now()
  const prev = state.visits[slug]
  const isSameVisit = prev && now - prev.last < VISIT_DEBOUNCE_MS
  state.visits[slug] = {
    count: (prev?.count || 0) + (isSameVisit ? 0 : 1),
    last: now,
    firstSeen: prev?.firstSeen || now,
  }
  save(state)
  return state
}

/** Most recently opened articles, newest first. */
export function getRecentlyViewed(limit = 5) {
  const { visits } = getState()
  return Object.entries(visits)
    .sort((a, b) => b[1].last - a[1].last)
    .slice(0, limit)
    .map(([slug, v]) => ({ slug, ...v }))
}

export function getVisitStats() {
  const { visits } = getState()
  const entries = Object.values(visits)
  return {
    opened: entries.length,
    totalViews: entries.reduce((sum, v) => sum + v.count, 0),
  }
}

export function clearTracking() {
  const state = getState()
  state.visits = {}
  save(state)
  return state
}
