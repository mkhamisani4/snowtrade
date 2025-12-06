'use client'

import { Scenario } from '@/lib/scenarios'
import ScenarioCard from './ScenarioCard'

interface NewsPopupProps {
  scenarios: Scenario[]
  tradingDay: number
  isMidDay?: boolean
  onClose: () => void
}

export default function NewsPopup({ scenarios, tradingDay, isMidDay = false, onClose }: NewsPopupProps) {
  if (scenarios.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                {isMidDay ? '⚠️ Mid-Day Crisis - Trading Day ' + tradingDay : '📰 End of Trading Day ' + tradingDay}
              </h2>
              <p className="text-sm text-[#98989d] font-light">
                {isMidDay ? 'Breaking news affecting markets right now' : 'Market events and news from today\'s trading session'}
              </p>
              <p className="text-xs text-[#007aff] font-light mt-2">
                💡 Research which stocks might be affected by reviewing company information
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#98989d] hover:text-white transition-colors text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#2c2c2e]"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} isNew />
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="button-primary py-3 px-8 text-base font-semibold"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

