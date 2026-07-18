import { useMemo, useState } from 'react'
import { articles, allTags, allCategories, LEVELS } from '../lib/content.js'
import { getState, toggleIn } from '../lib/store.js'

const PAGE_SIZE = 12

const STATUS_FILTERS = [
  { id: 'fav', label: '★ Favorites' },
  { id: 'read', label: '✓ Read' },
  { id: 'unread', label: 'Unread' },
  { id: 'review', label: '🔁 Needs review' },
]

export default function ArticleList() {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState(null)
  const [category, setCategory] = useState(null)
  const [tag, setTag] = useState(null)
  const [status, setStatus] = useState(null)
  const [page, setPage] = useState(1)
  const [state, setState] = useState(getState())
  const [filtersOpen, setFiltersOpen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth > 700
  )

  const readSet = useMemo(() => new Set(state.read), [state])
  const favSet = useMemo(() => new Set(state.favs), [state])
  const reviewSet = useMemo(() => new Set(state.review), [state])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return articles.filter((a) => {
      if (level && a.level !== level) return false
      if (category && a.category !== category) return false
      if (tag && !a.tags.includes(tag)) return false
      if (status === 'fav' && !favSet.has(a.slug)) return false
      if (status === 'read' && !readSet.has(a.slug)) return false
      if (status === 'unread' && readSet.has(a.slug)) return false
      if (status === 'review' && !reviewSet.has(a.slug)) return false
      if (q && !a.searchText.includes(q)) return false
      return true
    })
  }, [query, level, category, tag, status, readSet, favSet, reviewSet])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const readCount = articles.filter((a) => readSet.has(a.slug)).length
  const progressPct = Math.round((readCount / articles.length) * 100)
  const activeFilterCount = [level, category, tag, status].filter(Boolean).length

  const resetPage = (fn) => (v) => {
    fn(v)
    setPage(1)
  }

  const toggleFav = (e, slug) => {
    e.preventDefault()
    e.stopPropagation()
    setState({ ...toggleIn('favs', slug) })
  }

  return (
    <div className="container">
      <header className="header">
        <div className="header-top">
          <h1>Interview Prep</h1>
          <a className="quiz-btn" href="#/quiz">🎴 Flashcards</a>
        </div>
        <p className="subtitle">C# · .NET · SQL · Architecture — junior to lead, in order.</p>
      </header>

      <div className="progress-wrap" title={`${readCount} of ${articles.length} read`}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="progress-label">
          {readCount}/{articles.length} read · {progressPct}%
        </span>
      </div>

      <input
        className="search"
        type="search"
        placeholder="Search articles… (title, tags, content)"
        value={query}
        onChange={(e) => resetPage(setQuery)(e.target.value)}
      />

      <button className="filters-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
        <span className={`arrow ${filtersOpen ? 'open' : ''}`}>▸</span>
        Filters
        {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
      </button>

      {filtersOpen && (
        <div className="filters-body">
          <div className="filter-row">
            {LEVELS.map((l) => (
              <button
                key={l}
                className={`chip level-${l.toLowerCase()} ${level === l ? 'active' : ''}`}
                onClick={() => resetPage(setLevel)(level === l ? null : l)}
              >
                {l}
              </button>
            ))}
            <span className="chip-divider" />
            {STATUS_FILTERS.map((s) => (
              <button
                key={s.id}
                className={`chip ${status === s.id ? 'active' : ''}`}
                onClick={() => resetPage(setStatus)(status === s.id ? null : s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="filter-row">
            {allCategories.map((c) => (
              <button
                key={c}
                className={`chip ${category === c ? 'active' : ''}`}
                onClick={() => resetPage(setCategory)(category === c ? null : c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="filter-row tags-row">
            {allTags.map((t) => (
              <button
                key={t}
                className={`chip small ${tag === t ? 'active' : ''}`}
                onClick={() => resetPage(setTag)(tag === t ? null : t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="count">{filtered.length} article{filtered.length === 1 ? '' : 's'}</p>

      <div className="card-grid">
        {pageItems.map((a) => (
          <a key={a.slug} className={`card ${readSet.has(a.slug) ? 'is-read' : ''}`} href={`#/article/${a.slug}`}>
            <div className="card-top">
              <span className={`badge level-${a.level.toLowerCase()}`}>{a.level}</span>
              <span className="category">{a.category}</span>
              <span className="card-icons">
                {readSet.has(a.slug) && <span className="read-mark" title="Read">✓</span>}
                <button
                  className={`fav-btn ${favSet.has(a.slug) ? 'is-fav' : ''}`}
                  title={favSet.has(a.slug) ? 'Remove from favorites' : 'Add to favorites'}
                  onClick={(e) => toggleFav(e, a.slug)}
                >
                  {favSet.has(a.slug) ? '★' : '☆'}
                </button>
              </span>
            </div>
            <h3>{a.title}</h3>
            <div className="card-tags">
              {a.tags.slice(0, 4).map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </a>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="pager">
          <button disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>‹ Prev</button>
          <span>{safePage} / {pageCount}</span>
          <button disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)}>Next ›</button>
        </div>
      )}
    </div>
  )
}
