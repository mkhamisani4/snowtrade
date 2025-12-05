'use client'

import { PerformanceMetrics } from '@/lib/types'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  feedback: string
  metrics: PerformanceMetrics
  startingBalance: number
}

export default function FeedbackModal({
  isOpen,
  onClose,
  feedback,
  metrics,
  startingBalance,
}: FeedbackModalProps) {
  if (!isOpen) return null

  const returnPercent = (metrics.total_return * 100).toFixed(1)
  const isPositive = metrics.total_return >= 0

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-5xl font-bold tracking-tight text-white">Scenario Complete</h2>
            <button
              onClick={onClose}
              className="text-[#98989d] hover:text-white transition-colors text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#2c2c2e] ios-button"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="card-elevated p-6">
              <div className="text-sm text-[#98989d] mb-3 font-light">Final Balance</div>
              <div className="text-4xl font-bold text-white tracking-tight">
                ${metrics.final_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="card-elevated p-6">
              <div className="text-sm text-[#98989d] mb-3 font-light">Total Return</div>
              <div className={`text-4xl font-bold tracking-tight ${isPositive ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                {isPositive ? '+' : ''}{returnPercent}%
              </div>
            </div>
            <div className="card-elevated p-6">
              <div className="text-sm text-[#98989d] mb-3 font-light">Max Drawdown</div>
              <div className="text-4xl font-bold text-white tracking-tight">{(metrics.max_drawdown * 100).toFixed(1)}%</div>
            </div>
            <div className="card-elevated p-6">
              <div className="text-sm text-[#98989d] mb-3 font-light">Total Trades</div>
              <div className="text-4xl font-bold text-white tracking-tight">{metrics.trades_count}</div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-6 text-white tracking-tight">AI-Powered Feedback</h3>
            <div className="card-elevated p-8 whitespace-pre-wrap text-[#98989d] leading-relaxed font-light text-[15px]">
              {feedback}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="button-primary py-5 px-12 text-lg font-semibold"
            >
              Back to Scenarios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
