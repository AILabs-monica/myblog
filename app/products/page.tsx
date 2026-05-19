import { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export const metadata: Metadata = {
  title: '产品',
  description: '独立开发与产品思考',
  alternates: {
    canonical: 'https://myblog.vercel.app/products',
  },
  openGraph: {
    title: '产品 — Monica\'s Blog',
    description: '独立开发与产品思考',
    url: 'https://myblog.vercel.app/products',
  },
}

export default function ProductsPage() {
  const posts = getAllPosts()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">产品</h1>
      <div className="space-y-4">
        {posts.filter(p => p.category === 'products').map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
