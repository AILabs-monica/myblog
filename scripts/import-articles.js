const fs = require('fs')
const path = require('path')

const sourceDir = '/mnt/c/ubuntu/articles'
const contentDir = path.join(process.cwd(), 'content', 'ai')

// Map Chinese folder names to English slugs
const slugMap = {
  'AI本周大事件Agent管理与企业格局巨变': 'ai-agent-management-weekly',
  'AI疯狂24小时：Cerebras上市暴涨108%、6.5亿美元赌AI自我进化、OpenAI苹果联盟破裂': 'cerebras-ipo-ai-crazy-24h',
  'AI算力中心50台燃气轮机背后产业链': 'ai-data-center-gas-turbines',
  'DeepSeek不差钱为什么融500亿': 'deepseek-50-billion-funding',
  '国内AI一周大事件-阿里腾讯蚂蚁齐发力': 'china-ai-weekly-may-2026',
  '当AI开始管理AI-FinOperator深度解读': 'fin-operator-ai-managing-ai',
  '手机一震电脑自己写起了代码': 'phone-triggers-coding-agent',
}

fs.mkdirSync(contentDir, { recursive: true })

const folders = fs.readdirSync(sourceDir)

// Remove previously imported files (keep original mdx files)
for (const file of fs.readdirSync(contentDir)) {
  if (file !== 'ai-coding-evolution.mdx' && 
      file !== 'attention-mechanism.mdx' && 
      file !== 'hyperframe-mojibake.mdx') {
    fs.unlinkSync(path.join(contentDir, file))
  }
}

for (const folder of folders) {
  const folderPath = path.join(sourceDir, folder)
  if (!fs.statSync(folderPath).isDirectory()) continue

  const htmlFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.html'))
  if (htmlFiles.length === 0) continue

  const htmlFile = htmlFiles[0]
  const htmlPath = path.join(folderPath, htmlFile)
  let html = fs.readFileSync(htmlPath, 'utf-8')

  const titleMatch = html.match(/<title>([^<]+)<\/title>/)
  const title = titleMatch ? titleMatch[1].trim() : folder

  const pMatch = html.match(/<p[^>]*class="[^"]*mb-4[^"]*"[^>]*>([^<]+)<\/p>/)
  let description = pMatch ? pMatch[1].trim().slice(0, 200) : ''
  // Strip any HTML entities or quotes from description
  description = description.replace(/[""]/g, '').replace(/[""]/g, '').replace(/&quot;/g, '')

  // Get English slug
  const slug = slugMap[folder]
  if (!slug) {
    console.log(`⚠ No slug for: ${folder}`)
    continue
  }

  let articleContent = html
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (bodyMatch) articleContent = bodyMatch[1]

  const articleMatch = articleContent.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
  if (articleMatch) articleContent = articleMatch[1]

  articleContent = articleContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  articleContent = articleContent.replace(/<script[^>]*src="[^"]*tailwindcss[^"]*"[^>]*><\/script>/gi, '')
  articleContent = articleContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  articleContent = articleContent.replace(/@media[\s\S]*?{[\s\S]*?}/g, '')
  articleContent = articleContent.replace(/\n{3,}/g, '\n\n')

  // Remove duplicate header elements (h1, subtitle, author/date lines)
  // These are already rendered by the page template
  articleContent = articleContent.replace(/<h1[^>]*>.*?<\/h1>\s*(<p[^>]*>.*?<\/p>\s*){1,2}/i, '')

  const mdxContent = `---
title: "${title.replace(/"/g, '\\"')}"
date: "2026-05-17"
description: "${description}"
tags: ["AI"]
---

${articleContent.trim()}
`

  // Store English slug to Chinese folder name mapping for future imports
  const mdxPath = path.join(contentDir, `${slug}.mdx`)
  fs.writeFileSync(mdxPath, mdxContent)
  console.log(`✓ ${slug}.mdx <- ${folder}`)
}

// Save slug mapping for future reference
const mappingPath = path.join(process.cwd(), 'scripts', 'slug-mapping.json')
fs.writeFileSync(mappingPath, JSON.stringify(slugMap, null, 2))
console.log(`\nSlug mapping saved to scripts/slug-mapping.json`)
console.log('Done!')
