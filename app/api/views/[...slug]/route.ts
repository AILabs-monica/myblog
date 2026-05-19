import { NextRequest, NextResponse } from 'next/server'

function getRedisConfig() {
  // Vercel KV 自动注入的变量名
  if (process.env.KV_URL && process.env.KV_REST_API_TOKEN) {
    return { url: process.env.KV_URL, token: process.env.KV_REST_API_TOKEN }
  }
  // Upstash Redis 集成注入的变量名
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN }
  }
  return { url: '', token: '' }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const slug = (await params).slug.join('/')
  const { url, token } = getRedisConfig()

  if (url && token) {
    try {
      const res = await fetch(`${url}/get/views:${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      return NextResponse.json({ views: data.result ? Number(data.result) : 0 })
    } catch {
      return NextResponse.json({ views: 0 })
    }
  }

  return NextResponse.json({ views: 0 })
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const slug = (await params).slug.join('/')
  const { url, token } = getRedisConfig()

  if (url && token) {
    try {
      const res = await fetch(`${url}/incr/views:${slug}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      return NextResponse.json({ views: data.result || 0 })
    } catch {
      return NextResponse.json({ views: 0 })
    }
  }

  return NextResponse.json({ views: 0 })
}
