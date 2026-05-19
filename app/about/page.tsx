import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: '关于我和这个博客',
  alternates: {
    canonical: 'https://myblog.vercel.app/about',
  },
  openGraph: {
    title: 'About — Monica\'s Blog',
    description: '关于我和这个博客',
    url: 'https://myblog.vercel.app/about',
  },
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">About</h1>

      <section className="space-y-5 text-base leading-relaxed text-muted dark:text-muted-dark">
        <p>
          你好，我是 Monica。这个博客主要记录我在 AI 技术、独立开发和产品方面的思考与实践。
        </p>

        <p>
          关注方向包括：大语言模型、AI Agent、AI 编程工具、独立产品开发。
        </p>

        <p>
          博客内容同步发布在微信公众号，这里作为归档和查阅用。
        </p>
      </section>
    </div>
  )
}
