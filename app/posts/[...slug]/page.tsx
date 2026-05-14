import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import matter from 'gray-matter'

export const dynamic = 'force-static'

interface Props {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug.join('/'))
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description },
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function markdownToInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
}

async function MdxContent({ source }: { source: string }) {
  const { content } = matter(source)

  const lines = content.split('\n')
  const htmlLines: string[] = []
  let inCodeBlock = false
  let codeBlockLang = ''
  let codeContent = ''

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        htmlLines.push(`<pre><code class="language-${codeBlockLang}">${escapeHtml(codeContent)}</code></pre>`)
        codeContent = ''
        inCodeBlock = false
      } else {
        inCodeBlock = true
        codeBlockLang = line.slice(3).trim()
      }
      continue
    }
    if (inCodeBlock) {
      codeContent += line + '\n'
      continue
    }

    const trimmed = line.trim()

    if (line.startsWith('### ')) {
      htmlLines.push(`<h3 id="${slugify(line.slice(4))}">${line.slice(4)}</h3>`)
    } else if (line.startsWith('## ')) {
      htmlLines.push(`<h2 id="${slugify(line.slice(3))}">${line.slice(3)}</h2>`)
    } else if (line.startsWith('# ')) {
      htmlLines.push(`<h1 id="${slugify(line.slice(2))}">${line.slice(2)}</h1>`)
    } else if (line.startsWith('> ')) {
      htmlLines.push(`<blockquote>${markdownToInline(line.slice(2))}</blockquote>`)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      htmlLines.push(`<li>${markdownToInline(line.slice(2))}</li>`)
    } else if (/^\d+\.\s/.test(line)) {
      htmlLines.push(`<li>${markdownToInline(line.replace(/^\d+\.\s/, ''))}</li>`)
    } else if (trimmed.startsWith('![')) {
      const altMatch = trimmed.match(/!\[(.*?)\]/)
      const srcMatch = trimmed.match(/\((.*?)\)/)
      if (altMatch && srcMatch) {
        htmlLines.push(`<img alt="${altMatch[1]}" src="${srcMatch[1]}" />`)
      }
    } else if (trimmed === '') {
      htmlLines.push('')
    } else if (trimmed.startsWith('---')) {
      continue
    } else {
      htmlLines.push(`<p>${markdownToInline(line)}</p>`)
    }
  }

  return (
    <div
      className="article-content"
      dangerouslySetInnerHTML={{ __html: htmlLines.join('\n') }}
    />
  )
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug.join('/'))

  if (!post) notFound()

  return (
    <article>
      <Link
        href="/"
        className="text-sm text-muted dark:text-muted-dark hover:text-primary transition-colors mb-6 inline-block"
      >
        ← 返回首页
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted dark:text-muted-dark mb-3">
          <Link
            href={`/${post.category}`}
            className="uppercase tracking-wider font-medium hover:text-primary transition-colors"
          >
            {post.category}
          </Link>
          {post.date && (
            <>
              <span>·</span>
              <time>{post.date}</time>
            </>
          )}
          <span>·</span>
          <span>{post.readingTime} 分钟阅读</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
        {post.description && (
          <p className="text-lg text-muted dark:text-muted-dark">
            {post.description}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <MdxContent source={post.content || ''} />
    </article>
  )
}
