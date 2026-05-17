import Link from 'next/link'
import { Post } from '@/lib/posts'

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

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group rounded-xl border border-border/60 dark:border-border-dark/60 bg-card dark:bg-card-dark p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-[0_2px_20px_rgba(99,102,241,0.08)] dark:hover:shadow-[0_2px_20px_rgba(99,102,241,0.12)]">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="flex items-center gap-2 text-xs text-muted dark:text-muted-dark mb-3">
          <span className="font-semibold text-primary dark:text-primary tracking-wide">{post.category}</span>
          {post.date && (
            <>
              <span>·</span>
              <time>{post.date}</time>
            </>
          )}
          <span>·</span>
          <span>{post.readingTime} 分钟阅读</span>
        </div>
        <h2 className="text-lg font-semibold mb-2 leading-snug group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        {post.description && (
          <p className="text-sm text-muted dark:text-muted-dark leading-relaxed line-clamp-2">
            {post.description}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs px-2.5 py-0.5 rounded-md border ${getTagColor(tag)}`}
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
