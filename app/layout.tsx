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
      <body className="min-h-screen bg-bg text-text dark:bg-bg-dark dark:text-text-dark">
        <nav className="sticky top-0 z-50 border-b border-border/60 dark:border-border-dark/60 bg-bg/75 dark:bg-bg-dark/75 backdrop-blur-md">
          <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-base font-semibold tracking-tight text-text dark:text-text-dark hover:text-primary dark:hover:text-primary transition-colors">
              Monica&apos;s Blog
            </a>
            <div className="flex items-center gap-5 text-sm">
              <a href="/" className="text-muted dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">首页</a>
              <a href="/ai" className="text-muted dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">AI</a>
              <a href="/products" className="text-muted dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">产品</a>
              <a href="/about" className="text-muted dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">关于我</a>
              <button id="theme-toggle" className="ml-1 p-1 rounded-md text-muted dark:text-muted-dark hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="切换主题">
                🌙
              </button>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-3xl px-4 py-10">
          {children}
        </main>
        <footer className="border-t border-border/60 dark:border-border-dark/60 mt-16">
          <div className="mx-auto max-w-3xl px-4 py-8 text-center text-xs text-muted dark:text-muted-dark">
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
