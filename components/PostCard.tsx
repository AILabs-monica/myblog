import Link from 'next/link'
import { Post } from '@/lib/posts'
import ViewCounter from './ViewCounter'

export default function PostCard({ post }: { post: Post }) {
  return (
    <article style={{
      borderRadius: 'var(--radius)', border: '2.5px solid #111',
      background: 'var(--surface)', padding: '1.25rem',
      boxShadow: '5px 5px 0 #111',
    }}>
      <Link href={`/posts/${post.slug}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '0.75rem',
          fontWeight: 700,
        }}>
          <span style={{
            background: 'var(--accent-3)', color: '#111',
            padding: '0.125rem 0.5rem', borderRadius: 'var(--radius-sm)',
            border: '2px solid #111',
          }}>{post.category}</span>
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
        <h2 style={{
          fontSize: '1.125rem', fontWeight: 800,
          marginBottom: '0.5rem', lineHeight: 1.3, color: 'var(--text-1)',
        }}>
          {post.title}
        </h2>
        {post.description && (
          <p style={{
            fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {post.description}
          </p>
        )}
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.75rem' }}>
            {post.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: '0.75rem', padding: '0.125rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-soft)', color: 'var(--text-1)',
                border: '2px solid #111', fontWeight: 700,
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  )
}
