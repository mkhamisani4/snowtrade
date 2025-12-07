'use client'

import { SimulationState } from '@/lib/simulation-engine'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface PortfolioPanelProps {
  state: SimulationState
  portfolioValue: number
  priceHistory: Map<string, number[]>
}

export default function PortfolioPanel({ state, portfolioValue, priceHistory }: PortfolioPanelProps) {
  const chartData = state.portfolioHistory.map((value, index) => ({
    hour: index + 1,
    value: parseFloat(value.toFixed(2)),
  }))

  const returnPercent = ((portfolioValue - state.startingBalance) / state.startingBalance) * 100

  // Calculate Y-axis ticks based on actual data
  const minValue = Math.min(...state.portfolioHistory)
  const maxValue = Math.max(...state.portfolioHistory)
  const range = maxValue - minValue
  const tickCount = 5
  const tickStep = range / (tickCount - 1)
  const yAxisTicks = Array.from({ length: tickCount }, (_, i) => {
    return minValue + (tickStep * i)
  })

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-6 text-white tracking-tight">Portfolio</h2>

      <div className="mb-6">
        <div className="text-3xl font-bold mb-2 text-white tracking-tight">
          ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`text-sm font-semibold ${returnPercent >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
          {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%
        </div>
      </div>

      {state.portfolioHistory.length > 1 && (
        <div className="mb-6 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007aff" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#007aff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#38383a" strokeOpacity={0.3} />
              <XAxis dataKey="hour" stroke="#98989d" tick={{ fill: '#98989d', fontSize: 11 }} />
              <YAxis 
                stroke="#98989d" 
                tick={{ fill: '#98989d', fontSize: 11 }}
                tickFormatter={(value) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                domain={[minValue * 0.99, maxValue * 1.01]}
                ticks={yAxisTicks}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1c1e',
                  border: '0.5px solid #38383a',
                  borderRadius: '12px',
                  color: '#ffffff',
                  padding: '8px 12px'
                }}
                formatter={(value: any) => `$${parseFloat(value).toLocaleString()}`}
                labelFormatter={(label) => `Hour ${label}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#007aff"
                strokeWidth={2.5}
                fill="url(#portfolioGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="space-y-1 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#98989d] font-light">Cash</span>
          <span className="text-white font-medium">${state.cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#98989d] font-light">Invested</span>
          <span className="text-white font-medium">${(portfolioValue - state.cashBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="border-t border-[#38383a]/50 pt-4">
        <h3 className="text-sm font-semibold text-white mb-3">Stock Positions</h3>
        {state.positions.size === 0 ? (
          <div className="text-sm text-[#98989d] font-light py-4">No stock positions</div>
        ) : (
          <div className="space-y-3 mb-4">
            {Array.from(state.positions.values())
              .filter(pos => pos.shares > 0)
              .map((pos) => {
                const currentPrice = state.stockPrices.get(pos.ticker) || 0
                const value = pos.shares * currentPrice
                const pnl = (currentPrice - pos.avgPrice) * pos.shares
                const pnlPercent = pos.avgPrice > 0 ? ((currentPrice - pos.avgPrice) / pos.avgPrice) * 100 : 0

                return (
                  <div key={pos.ticker} className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-white">{pos.ticker}</div>
                      <div className="text-xs text-[#98989d] font-light mt-0.5">
                        {pos.shares} shares @ ${pos.avgPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">${value.toFixed(2)}</div>
                      <div className={`text-xs font-semibold mt-0.5 ${pnl >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                        {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        )}
        
        {state.optionPositions && state.optionPositions.size > 0 && (
          <>
            <h3 className="text-sm font-semibold text-white mb-3 mt-4">Options Positions</h3>
            <div className="space-y-2">
              {Array.from(state.optionPositions.entries()).map(([ticker, options]) => {
                const currentPrice = state.stockPrices.get(ticker) || 0
                return options
                  .filter(opt => opt.expirationHour > state.currentHour)
                  .map((opt, idx) => {
                    let intrinsicValue = 0
                    if (opt.type === 'call') {
                      intrinsicValue = Math.max(0, currentPrice - opt.strikePrice)
                    } else {
                      intrinsicValue = Math.max(0, opt.strikePrice - currentPrice)
                    }
                    const value = intrinsicValue * opt.contracts * 100
                    const pnl = value - (opt.premium * opt.contracts * 100)

                    return (
                      <div key={`${ticker}-${idx}`} className="flex justify-between items-start text-xs">
                        <div>
                          <div className="font-semibold text-white">{ticker} {opt.type.toUpperCase()}</div>
                          <div className="text-[#98989d] font-light mt-0.5">
                            {opt.contracts} @ ${opt.strikePrice.toFixed(2)} • Exp: H{opt.expirationHour}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-white">${value.toFixed(2)}</div>
                          <div className={`text-[10px] font-semibold mt-0.5 ${pnl >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                            {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    )
                  })
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

