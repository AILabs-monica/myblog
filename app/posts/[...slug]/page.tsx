import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import matter from 'gray-matter'
import ViewCounter from '@/components/ViewCounter'

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
  const slugStr = slug.join('/')
  const post = getPostBySlug(slugStr)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://monica-aiblog.vercel.app/posts/${slugStr}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://monica-aiblog.vercel.app/posts/${slugStr}`,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

const tagColors: Record<string, string> = {
  AI: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800',
  Transformer: 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800',
  深度学习: 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800',
  编程: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
  Copilot: 'bg-sky-50 text-sky-600 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800',
  Agent: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
  HyperFrame: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800',
  视频生成: 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800',
  踩坑: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
  独立开发: 'bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800',
  产品: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
  变现: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
}

function getTagColor(tag: string): string {
  return tagColors[tag] || 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700'
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

  const trimmed = content.trim()
  if (trimmed.startsWith('<') && (trimmed.startsWith('<p') || trimmed.startsWith('<h1') || trimmed.startsWith('<h2') || trimmed.startsWith('<h3') || trimmed.startsWith('<section') || trimmed.startsWith('<article') || trimmed.startsWith('<div') || trimmed.startsWith('<svg'))) {
    return (
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

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
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
          fontSize: '0.875rem', color: 'var(--text-2)',
          textDecoration: 'none', marginBottom: '2rem',
        }}
      >
        ← 返回首页
      </Link>

      <header style={{
        marginBottom: '2.5rem', paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.875rem', color: 'var(--text-3)', marginBottom: '1rem',
        }}>
          <Link
            href={`/${post.category}`}
            style={{ fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em' }}
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
          <span>·</span>
          <ViewCounter slug={post.slug} />
        </div>
        <h1 style={{
          fontSize: '1.875rem', fontWeight: 700, fontStyle: 'italic',
          letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '0.75rem',
          color: 'var(--text-1)',
        }}>{post.title}</h1>
        {post.description && (
          <p style={{ fontSize: '1rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
            {post.description}
          </p>
        )}
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
            {post.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: '0.75rem', padding: '0.125rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-soft)', color: 'var(--text-2)',
                border: '1px solid var(--border)',
              }}>
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
