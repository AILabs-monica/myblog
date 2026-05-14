import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Monica's Blog",
    template: "%s — Monica's Blog",
  },
  description: "AI 技术、独立开发、产品思考",
  metadataBase: new URL("https://myblog.vercel.app"),
  openGraph: {
    title: "Monica's Blog",
    description: "AI 技术、独立开发、产品思考",
    type: "website",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen">
        <nav className="border-b border-border dark:border-border-dark">
          <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-lg font-bold hover:text-primary transition-colors">
              Monica&apos;s Blog
            </a>
            <div className="flex items-center gap-4 text-sm text-muted dark:text-muted-dark">
              <a href="/" className="hover:text-primary transition-colors">首页</a>
              <a href="/ai" className="hover:text-primary transition-colors">AI</a>
              <a href="/products" className="hover:text-primary transition-colors">产品</a>
              <button id="theme-toggle" className="ml-2 p-1 hover:text-primary transition-colors" aria-label="切换主题">
                🌙
              </button>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-3xl px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-border dark:border-border-dark mt-16">
          <div className="mx-auto max-w-3xl px-4 py-6 text-center text-sm text-muted dark:text-muted-dark">
            <p>© {new Date().getFullYear()} Monica&apos;s Blog. Built with Next.js.</p>
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
