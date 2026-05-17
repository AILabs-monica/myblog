import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export default function Home() {
  const posts = getAllPosts()

  return (
    <div>
      <section className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Monica&apos;s Blog</h1>
        <p className="text-muted dark:text-muted-dark text-base">
          AI 技术 · 独立开发 · 产品思考
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold tracking-wide text-muted dark:text-muted-dark uppercase">最新文章</h2>
          <Link
            href="/ai"
            className="text-sm text-primary hover:underline"
          >
            查看全部 →
          </Link>
        </div>
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        {posts.length === 0 && (
          <div className="text-center py-16 text-muted dark:text-muted-dark">
            <p className="text-lg mb-2">还没有文章</p>
            <p className="text-sm">在 content/ 目录下创建 .mdx 文件即可发布</p>
          </div>
        )}
      </section>
    </div>
  )
}
