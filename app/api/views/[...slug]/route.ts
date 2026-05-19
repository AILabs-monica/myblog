import { NextRequest, NextResponse } from 'next/server'

function getRedisUrl(): string | null {
  return process.env.REDIS_URL || null
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const slug = (await params).slug.join('/')
  const redisUrl = getRedisUrl()

  if (!redisUrl) {
    return NextResponse.json({ views: 0 })
  }

  try {
    const { Redis } = await import('ioredis')
    const redis = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      retryStrategy: () => null,
    })
    await redis.connect()
    const val = await redis.get(`views:${slug}`)
    await redis.quit()
    return NextResponse.json({ views: val ? Number(val) : 0 })
  } catch {
    return NextResponse.json({ views: 0 })
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const slug = (await params).slug.join('/')
  const redisUrl = getRedisUrl()

  if (!redisUrl) {
    return NextResponse.json({ views: 0 })
  }

  try {
    const { Redis } = await import('ioredis')
    const redis = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      retryStrategy: () => null,
    })
    await redis.connect()
    const val = await redis.incr(`views:${slug}`)
    await redis.quit()
    return NextResponse.json({ views: val })
  } catch {
    return NextResponse.json({ views: 0 })
  }
}
