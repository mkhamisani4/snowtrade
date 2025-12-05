'use client'

import { NewsItem, Stock } from '@/lib/types'

interface NewsFeedProps {
  news: NewsItem[]
  stocks: Stock[]
}

export default function NewsFeed({ news, stocks }: NewsFeedProps) {
  const stockMap = new Map(stocks.map(s => [s.id, s]))

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'good':
        return 'bg-[#30d158]/15 text-[#30d158] border-[#30d158]/20'
      case 'bad':
        return 'bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/20'
      case 'rumor':
        return 'bg-[#ff9f0a]/15 text-[#ff9f0a] border-[#ff9f0a]/20'
      case 'macro':
        return 'bg-[#007aff]/15 text-[#007aff] border-[#007aff]/20'
      case 'sector':
        return 'bg-[#af52de]/15 text-[#af52de] border-[#af52de]/20'
      default:
        return 'bg-[#2c2c2e] text-[#98989d] border-[#38383a]'
    }
  }

  if (news.length === 0) {
    return (
      <div className="card p-8">
        <h2 className="text-2xl font-semibold mb-4 text-white tracking-tight">News Feed</h2>
        <div className="text-sm text-[#98989d] font-light">No news for this day</div>
      </div>
    )
  }

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-semibold mb-8 text-white tracking-tight">News Feed</h2>
      <div className="space-y-5">
        {news.map((item) => {
          const affectedStocks = item.affected_stocks
            ?.map(id => stockMap.get(id))
            .filter(Boolean)
            .map(s => s?.ticker)
            .join(', ') || 'Market'

          return (
            <div key={item.id} className="p-6 bg-[#1c1c1e] rounded-2xl border border-[#38383a]/50">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${getTypeColor(item.type)}`}>
                  {item.type.toUpperCase()}
                </span>
                {affectedStocks && (
                  <span className="text-xs text-[#98989d] font-light">
                    {affectedStocks}
                  </span>
                )}
              </div>
              <h3 className="font-semibold mb-3 text-white text-lg tracking-tight">{item.headline}</h3>
              <p className="text-sm text-[#98989d] leading-relaxed font-light">{item.content}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
