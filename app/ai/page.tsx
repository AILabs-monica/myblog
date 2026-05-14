import { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export const metadata: Metadata = {
  title: 'AI',
  description: 'AI 技术文章',
}

export default function AIPage() {
  const posts = getAllPosts()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">AI 技术</h1>
      <div className="space-y-4">
        {posts.filter(p => p.category === 'ai').map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
