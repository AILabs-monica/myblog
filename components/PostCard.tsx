import Link from 'next/link'
import { Post } from '@/lib/posts'

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="border border-border dark:border-border-dark rounded-lg p-5 hover:border-primary/50 transition-colors">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="flex items-center gap-2 text-xs text-muted dark:text-muted-dark mb-2">
          <span className="uppercase tracking-wider font-medium">{post.category}</span>
          {post.date && (
            <>
              <span>·</span>
              <time>{post.date}</time>
            </>
          )}
          <span>·</span>
          <span>{post.readingTime} 分钟阅读</span>
        </div>
        <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        {post.description && (
          <p className="text-sm text-muted dark:text-muted-dark leading-relaxed">
            {post.description}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
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
      </Link>
    </article>
  )
}
