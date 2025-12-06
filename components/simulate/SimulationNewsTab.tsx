'use client'

import { Scenario } from '@/lib/scenarios'
import ScenarioCard from './ScenarioCard'
import { NewsItem } from '@/lib/simulation-engine'

interface SimulationNewsTabProps {
  newsItems: NewsItem[]
  activeScenarios: Scenario[]
}

export default function SimulationNewsTab({ newsItems, activeScenarios }: SimulationNewsTabProps) {
  if (newsItems.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-[#98989d] font-light">No news yet. Advance time to see market events.</div>
      </div>
    )
  }

  // Show most recent news first
  const sortedNews = [...newsItems].reverse()

  // Don't show sentiment colors - users must decide for themselves
  const getTypeColor = () => {
    return 'bg-[#007aff]/15 text-[#007aff] border-[#007aff]/20'
  }

  return (
    <div className="space-y-3">
      {sortedNews.map((item, index) => {
        // Check if this is a real scenario
        const realScenario = activeScenarios.find(s => 
          s.title === item.headline || s.affectedStocks.some(t => item.tickers.includes(t))
        )
        const isActive = !!realScenario

        return (
          <div
            key={item.id}
            className={`card p-5 hover:bg-[#1c1c1e]/80 transition-all duration-200 ${
              item.isReal ? 'border-l-2 border-l-[#007aff]' : 'opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-white text-lg leading-snug">{item.headline}</h3>
                  {item.isReal && (
                    <span className="px-2 py-0.5 bg-[#007aff]/20 text-[#007aff] rounded text-xs font-semibold">
                      REAL
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-[#98989d] font-light">
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>Hour {item.time}</span>
                </div>
              </div>
              {/* Don't show sentiment - removed to make it harder */}
            </div>
            {item.tickers.length > 0 && (
              <div className="flex items-center gap-2 pt-3 border-t border-[#38383a]/50">
                <span className="text-xs text-[#98989d] font-light">Related:</span>
                <div className="flex gap-2">
                  {item.tickers.map((ticker) => (
                    <span key={ticker} className="px-2 py-0.5 bg-[#2c2c2e] rounded text-xs text-white font-medium">
                      {ticker}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {realScenario && (
              <div className="mt-3 pt-3 border-t border-[#38383a]/50">
                <ScenarioCard scenario={realScenario} isNew={isActive} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

