// Persistent user state (read progress, favorites, review queue) in localStorage.

const KEY = 'interview-prep-state-v1'

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function getState() {
  const s = load()
  return {
    read: s.read || [],
    favs: s.favs || [],
    review: s.review || [],
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
