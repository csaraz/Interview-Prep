// Loads all markdown articles from src/content at build time.
// Each article has frontmatter:
// ---
// title: ...
// level: Junior | Mid | Senior | Lead
// category: ...
// tags: comma, separated, tags
// order: 10
// ---

export const LEVELS = ['Junior', 'Mid', 'Senior', 'Lead']

const CATEGORY_ORDER = [
  'C# Fundamentals',
  '.NET Internals',
  'Async & Threading',
  'ASP.NET Core',
  'EF Core',
  'SQL & Database',
  'Patterns & Architecture',
  'DevOps & Cloud',
  'Testing',
  'Frontend',
  'Interview Lists',
]

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { meta: {}, body: raw }
  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    let value = line.slice(idx + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    meta[line.slice(0, idx).trim()] = value
  }
  return { meta, body: raw.slice(match[0].length) }
}

// Extracts the "Interview one-liners" (or similar summary section) bullets
// so flashcard mode has an "answer side" for each article.
function extractAnswerCard(body) {
  const section = body.match(
    /##\s*(?:Interview one-liners?|Interview-ready summary|The interview answer|Interview answer sketch)[^\n]*\r?\n([\s\S]*?)(?=\r?\n## |$)/
  )
  if (section) {
    const text = section[1].trim()
    if (text) return text
  }
  // fallback: first paragraph after the first heading/intro
  const paragraphs = body
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('#') && !p.startsWith('```') && !p.startsWith('|'))
  return paragraphs.slice(0, 2).join('\n\n')
}

const files = import.meta.glob('../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const articles = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { meta, body } = parseFrontmatter(raw)
    return {
      slug,
      title: meta.title || slug,
      level: LEVELS.includes(meta.level) ? meta.level : 'Mid',
      category: meta.category || 'General',
      tags: (meta.tags || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      order: Number(meta.order || 999),
      body,
      answerCard: extractAnswerCard(body),
      searchText: (
        (meta.title || '') + ' ' + (meta.tags || '') + ' ' + body
      ).toLowerCase(),
    }
  })
  .sort((a, b) => {
    const ca = CATEGORY_ORDER.indexOf(a.category)
    const cb = CATEGORY_ORDER.indexOf(b.category)
    if (ca !== cb) return (ca === -1 ? 99 : ca) - (cb === -1 ? 99 : cb)
    if (a.order !== b.order) return a.order - b.order
    return a.title.localeCompare(b.title)
  })

export const allTags = [...new Set(articles.flatMap((a) => a.tags))].sort()
export const allCategories = [...new Set(articles.map((a) => a.category))].sort(
  (a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a)
    const ib = CATEGORY_ORDER.indexOf(b)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  }
)
