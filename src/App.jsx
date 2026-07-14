import { useEffect, useState } from 'react'
import ArticleList from './components/ArticleList.jsx'
import ArticleView from './components/ArticleView.jsx'
import Flashcards from './components/Flashcards.jsx'
import { articles } from './lib/content.js'

function parseHash() {
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (hash.startsWith('article/')) {
    return { page: 'article', slug: decodeURIComponent(hash.slice('article/'.length)) }
  }
  if (hash === 'quiz' || hash.startsWith('quiz')) {
    return { page: 'quiz' }
  }
  return { page: 'list' }
}

export default function App() {
  const [route, setRoute] = useState(parseHash())

  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (route.page === 'article') {
    const article = articles.find((a) => a.slug === route.slug)
    return <ArticleView article={article} />
  }
  if (route.page === 'quiz') {
    return <Flashcards />
  }
  return <ArticleList />
}
