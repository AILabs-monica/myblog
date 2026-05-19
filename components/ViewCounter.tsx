'use client'

import { useEffect } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ViewCounter({ slug }: { slug: string }) {
  const { data, mutate } = useSWR<{ views: number }>(
    `/api/views/${slug}`,
    fetcher
  )

  useEffect(() => {
    let cancelled = false
    const increment = async () => {
      const res = await fetch(`/api/views/${slug}`, { method: 'POST' })
      const json = await res.json()
      if (!cancelled) mutate(json, { revalidate: false })
    }
    increment()
    return () => { cancelled = true }
  }, [slug, mutate])

  return <span>{data?.views ?? 0} 次阅读</span>
}
