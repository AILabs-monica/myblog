import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

export interface Post {
  slug: string
  title: string
  date: string
  description: string
  category: string
  tags: string[]
  readingTime: number
  content?: string
}

function getCategoryPath(category: string): string {
  return path.join(contentDir, category)
}

export function getAllPosts(category?: string): Post[] {
  const dirs = category ? [category] : fs.readdirSync(contentDir).filter(
    (d) => fs.statSync(path.join(contentDir, d)).isDirectory()
  )

  const posts: Post[] = []

  for (const dir of dirs) {
    const dirPath = getCategoryPath(dir)
    if (!fs.existsSync(dirPath)) continue

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))

    for (const file of files) {
      const slug = file.replace(/\.mdx?$/, '')
      const source = fs.readFileSync(path.join(dirPath, file), 'utf-8')
      const { data, content } = matter(source)
      const words = content.split(/\s+/).length
      const readingTime = Math.max(1, Math.ceil(words / 300))

      posts.push({
        slug: `${dir}/${slug}`,
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
        description: data.description || '',
        category: dir,
        tags: data.tags || [],
        readingTime,
      })
    }
  }

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts(category)
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(contentDir, `${slug}.mdx`)
  const mdPath = path.join(contentDir, `${slug}.md`)

  let filePath: string | null = null
  if (fs.existsSync(fullPath)) filePath = fullPath
  else if (fs.existsSync(mdPath)) filePath = mdPath

  if (!filePath) return null

  const source = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(source)
  const words = content.split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(words / 300))

  return {
    slug,
    title: data.title || slug.split('/').pop() || slug,
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
    description: data.description || '',
    category: slug.split('/')[0],
    tags: data.tags || [],
    readingTime,
    content,
  }
}
