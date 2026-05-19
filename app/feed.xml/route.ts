import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  const posts = getAllPosts()

  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>https://monica-aiblog.vercel.app/posts/${post.slug}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${post.date ? new Date(post.date).toUTCString() : ''}</pubDate>
      <guid>https://monica-aiblog.vercel.app/posts/${post.slug}</guid>
    </item>`
    )
    .join('')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Monica's Blog</title>
    <link>https://monica-aiblog.vercel.app</link>
    <description>AI 技术、独立开发、产品思考</description>
    <language>zh-CN</language>
    <atom:link href="https://monica-aiblog.vercel.app/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
