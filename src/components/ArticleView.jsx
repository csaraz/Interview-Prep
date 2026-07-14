import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { articles } from '../lib/content.js'
import { getState, toggleIn } from '../lib/store.js'

export default function ArticleView({ article }) {
  const [state, setState] = useState(getState())

  if (!article) {
    return (
      <div className="container">
        <a className="back" href="#/">← Back to list</a>
        <p>Article not found.</p>
      </div>
    )
  }

  const isRead = state.read.includes(article.slug)
  const isFav = state.favs.includes(article.slug)

  const idx = articles.indexOf(article)
  const prev = idx > 0 ? articles[idx - 1] : null
  const next = idx < articles.length - 1 ? articles[idx + 1] : null

  return (
    <div className="container article-page">
      <div className="article-toolbar">
        <a className="back" href="#/">← Back to list</a>
        <div className="toolbar-actions">
          <button
            className={`action-btn ${isRead ? 'active-read' : ''}`}
            onClick={() => setState({ ...toggleIn('read', article.slug) })}
          >
            {isRead ? '✓ Read' : 'Mark as read'}
          </button>
          <button
            className={`action-btn ${isFav ? 'active-fav' : ''}`}
            onClick={() => setState({ ...toggleIn('favs', article.slug) })}
          >
            {isFav ? '★ Favorited' : '☆ Favorite'}
          </button>
        </div>
      </div>
      <div className="article-meta">
        <span className={`badge level-${article.level.toLowerCase()}`}>{article.level}</span>
        <span className="category">{article.category}</span>
        {article.tags.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      <article className="markdown">
        <h1>{article.title}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {article.body}
        </ReactMarkdown>
      </article>
      <nav className="article-nav">
        {prev ? <a href={`#/article/${prev.slug}`}>← {prev.title}</a> : <span />}
        {next ? <a href={`#/article/${next.slug}`}>{next.title} →</a> : <span />}
      </nav>
    </div>
  )
}
