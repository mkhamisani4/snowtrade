'use client'

import { Stock, PortfolioPosition, PerformanceMetrics } from '@/lib/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PortfolioViewProps {
  positions: Map<string, PortfolioPosition>
  stocks: Stock[]
  currentPrices: Map<string, number>
  cashBalance: number
  portfolioValue: number
  portfolioHistory: number[]
}

export default function PortfolioView({
  positions,
  stocks,
  currentPrices,
  cashBalance,
  portfolioValue,
  portfolioHistory,
}: PortfolioViewProps) {
  const stockMap = new Map(stocks.map(s => [s.id, s]))

  const positionList = Array.from(positions.entries())
    .filter(([_, pos]) => pos.shares > 0 || pos.short_shares > 0)
    .map(([stockId, pos]) => {
      const stock = stockMap.get(stockId)
      const currentPrice = currentPrices.get(stockId) || 0
      const longValue = pos.shares * currentPrice
      const shortPnL = pos.short_shares * (pos.avg_short_price - currentPrice)
      const longPnL = pos.shares * (currentPrice - pos.avg_buy_price)

      return {
        stock,
        position: pos,
        currentPrice,
        longValue,
        shortPnL,
        longPnL,
        totalValue: longValue + shortPnL,
      }
    })
    .sort((a, b) => b.totalValue - a.totalValue)

  const chartData = portfolioHistory.map((value, index) => ({
    day: index + 1,
    value: value.toFixed(2),
  }))

  return (
    <div className="card p-8">
      <h2 className="text-2xl font-semibold mb-8 text-white tracking-tight">Portfolio</h2>

      <div className="mb-8">
        <div className="text-5xl font-bold mb-3 text-white tracking-tight">
          ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-sm text-[#98989d] font-light">
          Cash: ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {portfolioHistory.length > 1 && (
        <div className="mb-8 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007aff" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#007aff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#38383a" strokeOpacity={0.3} />
              <XAxis dataKey="day" stroke="#98989d" tick={{ fill: '#98989d', fontSize: 11 }} />
              <YAxis stroke="#98989d" tick={{ fill: '#98989d', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1c1e',
                  border: '0.5px solid #38383a',
                  borderRadius: '12px',
                  color: '#ffffff',
                  padding: '8px 12px'
                }}
                formatter={(value: any) => `$${parseFloat(value).toLocaleString()}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#007aff"
                strokeWidth={3}
                dot={false}
                fill="url(#portfolioGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="space-y-5">
        <h3 className="font-semibold text-white text-lg tracking-tight">Positions</h3>
        {positionList.length === 0 ? (
          <div className="text-sm text-[#98989d] py-6 font-light">No open positions</div>
        ) : (
          positionList.map(({ stock, position, currentPrice, longValue, shortPnL, longPnL }) => (
            <div key={stock?.id} className="pb-5 border-b border-[#38383a]/50 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-white text-lg mb-1">{stock?.ticker}</div>
                  <div className="text-sm text-[#98989d] font-light">
                    {position.shares > 0 && `${position.shares} @ $${position.avg_buy_price.toFixed(2)}`}
                    {position.shares > 0 && position.short_shares > 0 && ' • '}
                    {position.short_shares > 0 && `${position.short_shares} short @ $${position.avg_short_price.toFixed(2)}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white text-lg">${longValue.toFixed(2)}</div>
                  {(longPnL !== 0 || shortPnL !== 0) && (
                    <div className={`text-sm font-semibold mt-1 ${longPnL + shortPnL >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                      {longPnL + shortPnL >= 0 ? '+' : ''}
                      ${(longPnL + shortPnL).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
