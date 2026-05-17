import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export default function Home() {
  const posts = getAllPosts()

  return (
    <div>
      <section style={{ marginBottom: '3rem' }}>
        <h1 style={{
          fontSize: '2rem', fontWeight: 700, fontStyle: 'italic',
          letterSpacing: '-0.02em', marginBottom: '0.5rem', color: 'var(--text-1)',
        }}>Monica&apos;s Blog</h1>
        <p style={{ color: 'var(--text-2)', fontSize: '1rem' }}>
          AI 技术 · 独立开发 · 产品思考
        </p>
      </section>

      <section>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{
            fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em',
            textTransform: 'uppercase', color: 'var(--text-3)',
          }}>最新文章</h2>
          <Link href="/ai" style={{
            fontSize: '0.875rem', color: 'var(--accent)',
            textDecoration: 'underline', textUnderlineOffset: '2px',
          }}>
            查看全部 →
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-3)' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>还没有文章</p>
            <p style={{ fontSize: '0.875rem' }}>在 content/ 目录下创建 .mdx 文件即可发布</p>
          </div>
        )}
      </section>
    </div>
  )
}
