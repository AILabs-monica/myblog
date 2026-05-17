import fs from 'fs'
import path from 'path'

const sourceDir = '/mnt/c/ubuntu/articles'
const contentDir = path.join(process.cwd(), 'content', 'ai')
const publicImagesDir = path.join(process.cwd(), 'public', 'images')

fs.mkdirSync(contentDir, { recursive: true })
fs.mkdirSync(publicImagesDir, { recursive: true })

const folders = fs.readdirSync(sourceDir)

for (const folder of folders) {
  const folderPath = path.join(sourceDir, folder)
  if (!fs.statSync(folderPath).isDirectory()) continue

  const htmlFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.html'))
  if (htmlFiles.length === 0) continue

  const htmlFile = htmlFiles[0]
  const htmlPath = path.join(folderPath, htmlFile)
  let html = fs.readFileSync(htmlPath, 'utf-8')

  // Extract title from <title> tag
  const titleMatch = html.match(/<title>([^<]+)<\/title>/)
  const title = titleMatch ? titleMatch[1].trim() : folder

  // Extract a description (first <p> that looks like article content, after h1)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  const body = bodyMatch ? bodyMatch[1] : html

  // Get first meaningful paragraph for description
  const pMatch = body.match(/<p[^>]*class="[^"]*mb-4[^"]*"[^>]*>([^<]+)<\/p>/)
  const description = pMatch ? pMatch[1].trim().slice(0, 150) : ''

  // Extract date - estimate from folder or use today
  const date = '2026-05-17'

  // Generate slug from folder name
  const slug = folder
    .replace(/[：:]/g, '')
    .replace(/[？?]/g, '')
    .replace(/[、，。！；]/g, '-')
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  // Extract images from HTML body
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g
  let imgMatch
  let imgIndex = 0
  const imageMap: Record<string, string> = {}

  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const src = imgMatch[1]
    if (src.startsWith('http') || src.startsWith('data:')) {
      imgIndex++
      const localName = `${slug}-${imgIndex}${path.extname(src) || '.png'}`
      const localPath = path.join(publicImagesDir, localName)
      imageMap[src] = `/images/${localName}`

      try {
        if (src.startsWith('http')) {
          const response = await fetch(src)
          const buffer = Buffer.from(await response.arrayBuffer())
          fs.writeFileSync(localPath, buffer)
          console.log(`  Downloaded: ${src} -> ${localName}`)
        }
      } catch (e) {
        console.log(`  Failed to download: ${src}`)
      }
    }
  }

  // Replace image URLs in HTML
  for (const [original, local] of Object.entries(imageMap)) {
    html = html.replaceAll(original, local)
  }

  // Extract just the article body content (inside <article> or <body>)
  let articleContent = body
  const articleMatch = body.match(/<article[^>]*>([\s\S]*)<\/article>/i)
  if (articleMatch) {
    articleContent = articleMatch[1]
  }

  // Clean up - remove script tags
  articleContent = articleContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  // Remove tailwind CDN link
  articleContent = articleContent.replace(/<script[^>]*src="[^"]*tailwindcss[^"]*"[^>]*><\/script>/gi, '')
  // Remove style tags
  articleContent = articleContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

  // Build mdx file
  const mdxContent = `---
title: "${title}"
date: "${date}"
description: "${description}"
tags: ["AI"]
---

<section>
${articleContent.trim()}
</section>
`

  const mdxPath = path.join(contentDir, `${slug}.mdx`)
  fs.writeFileSync(mdxPath, mdxContent)
  console.log(`✓ Created: ${slug}.mdx`)
}

console.log('\nDone! All articles imported.')
