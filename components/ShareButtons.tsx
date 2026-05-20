'use client'

import { useState, useRef, useEffect } from 'react'

function QRCodeSVG({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadQR = async () => {
      if (typeof window === 'undefined') return
      const QRCode = (await import('qrcode')).default
      if (ref.current) {
        ref.current.innerHTML = ''
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, url, {
          width: 180,
          margin: 2,
          color: { dark: '#111', light: '#fff' },
        })
        ref.current.appendChild(canvas)
      }
    }
    loadQR()
  }, [url])

  return <div ref={ref} />
}

export default function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const url = `https://monica-aiblog.vercel.app/posts/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      label: '𝕏',
    },
    {
      name: '微博',
      href: `https://service.weibo.com/share/share.php?title=${encodedTitle}&url=${encodedUrl}`,
      label: '微博',
    },
    {
      name: '知乎',
      href: `https://zhuanlan.zhihu.com/write?topic=${encodedTitle}&utm_source=${encodedUrl}`,
      label: '知乎',
    },
  ]

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.375rem',
        flexWrap: 'wrap',
      }}>
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`分享到 ${link.name}`}
            style={{
              padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)',
              border: '2.5px solid #111', background: 'var(--surface)',
              color: 'var(--text-1)', fontWeight: 700, fontSize: '0.75rem',
              textDecoration: 'none', cursor: 'pointer',
            }}
          >
            {link.label}
          </a>
        ))}
        <button
          onClick={() => setShowQR(true)}
          title="微信扫码分享"
          style={{
            padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)',
            border: '2.5px solid #111', background: 'var(--surface)',
            color: 'var(--text-1)', fontWeight: 700, fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          微信
        </button>
        <button
          onClick={copyLink}
          title="复制链接"
          style={{
            padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)',
            border: '2.5px solid #111', background: copied ? 'var(--accent-3)' : 'var(--surface)',
            color: 'var(--text-1)', fontWeight: 700, fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          {copied ? '✓' : '🔗'}
        </button>
      </div>

      {showQR && (
        <div
          onClick={() => setShowQR(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 'var(--radius)',
              border: '2.5px solid #111', padding: '1.5rem',
              textAlign: 'center', boxShadow: '5px 5px 0 #111',
            }}
          >
            <QRCodeSVG url={url} />
            <p style={{
              marginTop: '0.75rem', fontSize: '0.75rem',
              color: '#666', fontWeight: 600,
            }}>
              微信扫码分享
            </p>
          </div>
        </div>
      )}
    </>
  )
}
