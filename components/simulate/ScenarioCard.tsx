'use client'

import { Scenario } from '@/lib/scenarios'

interface ScenarioCardProps {
  scenario: Scenario
  isNew?: boolean
}

export default function ScenarioCard({ scenario, isNew }: ScenarioCardProps) {
  // Don't reveal sentiment - users must decide for themselves
  const getSentimentColor = () => {
    return 'bg-[#007aff]/15 text-[#007aff] border-[#007aff]/30'
  }

  const getImpactBadge = (impact: string) => {
    const colors: Record<string, string> = {
      low: 'bg-[#98989d]/20 text-[#98989d]',
      medium: 'bg-[#007aff]/20 text-[#007aff]',
      high: 'bg-[#ff9f0a]/20 text-[#ff9f0a]',
      extreme: 'bg-[#ff453a]/20 text-[#ff453a]',
    }
    return colors[impact] || colors.medium
  }

  return (
    <div className={`p-4 rounded-xl border ${getSentimentColor()} ${isNew ? 'animate-pulse' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-white text-base flex-1">{scenario.title}</h3>
        <div className={`px-2 py-1 rounded text-xs font-semibold ${getImpactBadge(scenario.impact)}`}>
          {scenario.impact.toUpperCase()}
        </div>
      </div>
      <p className="text-sm text-[#98989d] mb-3 font-light leading-relaxed">{scenario.description}</p>
      <div className="text-xs text-[#98989d] font-light italic">
        Research which stocks might be affected by this news
      </div>
    </div>
  )
}

