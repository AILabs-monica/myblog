import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Monica's Blog",
    template: "%s — Monica's Blog",
  },
  description: "AI 技术、独立开发、产品思考 — Monica 的个人博客",
  metadataBase: new URL("https://monica-aiblog.vercel.app"),
  alternates: {
    canonical: "https://monica-aiblog.vercel.app",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "Monica's Blog",
    description: "AI 技术、独立开发、产品思考",
    type: "website",
    url: "https://monica-aiblog.vercel.app",
    locale: "zh_CN",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "googlec84586560d4d2508",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <nav style={{
          position: 'sticky', top: 0, zIndex: 50,
          borderBottom: '2.5px solid #111',
          background: 'var(--bg)',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            maxWidth: '768px', margin: '0 auto', padding: '0.75rem 1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <a href="/" style={{
              fontSize: '1rem', fontWeight: 800, color: 'var(--text-1)',
              textDecoration: 'none', letterSpacing: '-0.02em',
            }}>
              ✦ Monica&apos;s Blog
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
              <a href="/" style={{ color: 'var(--text-2)', textDecoration: 'none' }}>首页</a>
              <a href="/ai" style={{ color: 'var(--text-2)', textDecoration: 'none' }}>AI</a>
              <a href="/products" style={{ color: 'var(--text-2)', textDecoration: 'none' }}>产品</a>
              <a href="/about" style={{ color: 'var(--text-2)', textDecoration: 'none' }}>关于我</a>
              <button id="theme-toggle" style={{
                padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)',
                color: 'var(--text-2)', cursor: 'pointer',
                border: '2.5px solid #111', background: 'var(--accent-3)',
                fontSize: '1rem', fontWeight: 700,
              }} aria-label="切换主题">🌙</button>
            </div>
          </div>
        </nav>
        <main style={{
          maxWidth: '768px', margin: '0 auto', padding: '2.5rem 1rem',
        }}>
          {children}
        </main>
        <footer style={{
          borderTop: '2.5px solid #111', marginTop: '4rem',
        }}>
          <div style={{
            maxWidth: '768px', margin: '0 auto', padding: '2rem 1rem',
            textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-3)',
            fontWeight: 600,
          }}>
            <p>© {new Date().getFullYear()} Monica&apos;s Blog</p>
          </div>
        </footer>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') document.documentElement.classList.add('dark');
                document.getElementById('theme-toggle')?.addEventListener('click', function() {
                  document.documentElement.classList.toggle('dark');
                  const isDark = document.documentElement.classList.contains('dark');
                  localStorage.setItem('theme', isDark ? 'dark' : 'light');
                  this.textContent = isDark ? '☀️' : '🌙';
                });
                document.getElementById('theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
