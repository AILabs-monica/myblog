'use client'

import { useState } from 'react'

export default function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const url = `https://monica-aiblog.vercel.app/posts/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      label: 'X',
    },
    {
      name: '微博',
      href: `https://service.weibo.com/share/share.php?title=${encodedTitle}&url=${encodedUrl}`,
      label: '微博',
    },
  ]

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      marginTop: '3rem', paddingTop: '1.5rem',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        fontSize: '0.875rem', color: 'var(--text-2)',
      }}>
        <span style={{ fontWeight: 600 }}>分享到</span>
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-sm)',
              border: '2.5px solid #111', background: 'var(--surface)',
              color: 'var(--text-1)', fontWeight: 700, fontSize: '0.75rem',
              textDecoration: 'none', cursor: 'pointer',
            }}
          >
            {link.label}
          </a>
        ))}
        <button
          onClick={copyLink}
          style={{
            padding: '0.375rem 0.75rem', borderRadius: 'var(--radius-sm)',
            border: '2.5px solid #111', background: copied ? 'var(--accent-3)' : 'var(--surface)',
            color: 'var(--text-1)', fontWeight: 700, fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          {copied ? '已复制' : '复制链接'}
        </button>
      </div>
    </div>
  )
}
