import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { articles, allCategories, LEVELS } from '../lib/content.js'
import { getState, setReview, markRead } from '../lib/store.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Flashcards() {
  const [level, setLevel] = useState(null)
  const [category, setCategory] = useState(null)
  const [onlyReview, setOnlyReview] = useState(false)
  const [deck, setDeck] = useState(null) // null = setup screen
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [knewCount, setKnewCount] = useState(0)
  const [repeatSlugs, setRepeatSlugs] = useState([])

  const reviewSet = useMemo(() => new Set(getState().review), [])

  const pool = useMemo(() => {
    return articles.filter((a) => {
      if (level && a.level !== level) return false
      if (category && a.category !== category) return false
      if (onlyReview && !reviewSet.has(a.slug)) return false
      return true
    })
  }, [level, category, onlyReview, reviewSet])

  const start = () => {
    setDeck(shuffle(pool))
    setPos(0)
    setFlipped(false)
    setKnewCount(0)
    setRepeatSlugs([])
  }

  const answer = (knew) => {
    const card = deck[pos]
    setReview(card.slug, !knew)
    if (knew) {
      markRead(card.slug)
      setKnewCount((c) => c + 1)
    } else {
      setRepeatSlugs((r) => [...r, card.slug])
    }
    setFlipped(false)
    setPos((p) => p + 1)
  }

  // ---------- setup screen ----------
  if (!deck) {
    return (
      <div className="container quiz-page">
        <a className="back" href="#/">← Back to list</a>
        <h1>🎴 Flashcards</h1>
        <p className="subtitle">
          Front: the topic. Think of your answer out loud, flip, compare with the key points.
        </p>

        <h3 className="quiz-label">Level</h3>
        <div className="filter-row">
          {LEVELS.map((l) => (
            <button
              key={l}
              className={`chip level-${l.toLowerCase()} ${level === l ? 'active' : ''}`}
              onClick={() => setLevel(level === l ? null : l)}
            >
              {l}
            </button>
          ))}
        </div>

        <h3 className="quiz-label">Category</h3>
        <div className="filter-row">
          {allCategories.map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(category === c ? null : c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="filter-row">
          <button
            className={`chip ${onlyReview ? 'active' : ''}`}
            onClick={() => setOnlyReview(!onlyReview)}
          >
            🔁 Only "needs review" ({reviewSet.size})
          </button>
        </div>

        <button className="start-btn" disabled={pool.length === 0} onClick={start}>
          Start — {pool.length} card{pool.length === 1 ? '' : 's'}
        </button>
      </div>
    )
  }

  // ---------- finished ----------
  if (pos >= deck.length) {
    return (
      <div className="container quiz-page">
        <a className="back" href="#/">← Back to list</a>
        <h1>Session complete 🎉</h1>
        <p className="quiz-result">
          ✅ Knew: <strong>{knewCount}</strong> · 🔁 To repeat: <strong>{repeatSlugs.length}</strong> of {deck.length}
        </p>
        {repeatSlugs.length > 0 && (
          <>
            <h3 className="quiz-label">Marked for review:</h3>
            <ul className="review-list">
              {repeatSlugs.map((slug) => {
                const a = articles.find((x) => x.slug === slug)
                return (
                  <li key={slug}>
                    <a href={`#/article/${slug}`}>{a?.title || slug}</a>
                  </li>
                )
              })}
            </ul>
          </>
        )}
        <div className="quiz-actions">
          <button className="start-btn" onClick={() => setDeck(null)}>New session</button>
        </div>
      </div>
    )
  }

  // ---------- card ----------
  const card = deck[pos]
  return (
    <div className="container quiz-page">
      <div className="quiz-top">
        <a className="back" href="#/">← Exit</a>
        <span className="quiz-progress">{pos + 1} / {deck.length}</span>
      </div>

      <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
        <div className="flashcard-meta">
          <span className={`badge level-${card.level.toLowerCase()}`}>{card.level}</span>
          <span className="category">{card.category}</span>
        </div>

        {!flipped ? (
          <>
            <h2 className="flashcard-front">Explain: {card.title}</h2>
            <p className="flashcard-hint">Say your answer out loud, then flip.</p>
          </>
        ) : (
          <div className="flashcard-back markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {card.answerCard}
            </ReactMarkdown>
            <a className="full-article" href={`#/article/${card.slug}`}>Open full article →</a>
          </div>
        )}
      </div>

      <div className="quiz-actions">
        {!flipped ? (
          <button className="start-btn" onClick={() => setFlipped(true)}>Show answer</button>
        ) : (
          <>
            <button className="know-btn" onClick={() => answer(true)}>✅ Knew it</button>
            <button className="repeat-btn" onClick={() => answer(false)}>🔁 Review again</button>
          </>
        )}
      </div>
    </div>
  )
}
