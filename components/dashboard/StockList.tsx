'use client'

import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { mockStocks } from '@/lib/mock-stocks'

interface StockListProps {
  onSelectStock: (ticker: string) => void
  selectedStock: string | null
}

export default function StockList({ onSelectStock, selectedStock }: StockListProps) {
  return (
    <div className="space-y-2">
      {mockStocks.map((stock) => {
        const isPositive = stock.change >= 0
        const chartData = stock.chartData.map((price, index) => ({
          value: price,
          index
        }))

        return (
          <div
            key={stock.ticker}
            onClick={() => onSelectStock(stock.ticker)}
            className={`card p-5 cursor-pointer hover:bg-[#1c1c1e]/80 transition-all duration-200 ${
              selectedStock === stock.ticker ? 'ring-2 ring-[#007aff]/50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div>
                    <div className="font-semibold text-lg text-white">{stock.ticker}</div>
                    <div className="text-xs text-[#98989d] font-light">{stock.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-[#98989d] font-light">Price: </span>
                    <span className="text-white font-semibold">${stock.price.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[#98989d] font-light">Vol: </span>
                    <span className="text-white font-medium">{(stock.volume / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={isPositive ? '#30d158' : '#ff453a'}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-right min-w-[80px]">
                  <div className={`text-lg font-semibold ${isPositive ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                    {isPositive ? '+' : ''}{stock.change.toFixed(2)}
                  </div>
                  <div className={`text-sm font-semibold ${isPositive ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                    {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
