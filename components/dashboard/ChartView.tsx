'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { getStockByTicker } from '@/lib/mock-stocks'

interface ChartViewProps {
  selectedStock: string | null
}

export default function ChartView({ selectedStock }: ChartViewProps) {
  const stock = selectedStock ? getStockByTicker(selectedStock) : null

  // Generate chart data based on the stock's current price
  const generateChartData = (days: number) => {
    if (!stock) return []
    
    const data = []
    const basePrice = stock.price
    for (let i = 0; i < days; i++) {
      // Generate price movement that ends at the current price
      const progress = i / (days - 1)
      const targetPrice = basePrice
      const startPrice = basePrice - stock.change
      const price = startPrice + (targetPrice - startPrice) * progress + (Math.random() - 0.5) * 2
      data.push({
        date: i + 1,
        price: Math.max(0.01, price),
        volume: Math.floor(Math.random() * 10000000) + 5000000
      })
    }
    return data
  }

  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M')
  const chartData = generateChartData(
    timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 365
  )

  if (!selectedStock || !stock) {
    return (
      <div className="card p-12 text-center">
        <div className="text-[#98989d] font-light">
          Select a stock to view chart
        </div>
      </div>
    )
  }

  const currentPrice = stock.price
  const previousPrice = stock.price - stock.change
  const change = stock.change
  const changePercent = stock.changePercent
  const isPositive = change >= 0

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-3xl font-bold text-white mb-1 tracking-tight">{stock.ticker}</div>
          <div className="text-sm text-[#98989d] font-light mb-2">{stock.name}</div>
          <div className="flex items-center gap-3">
            <div className={`text-xl font-semibold ${isPositive ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
              ${currentPrice.toFixed(2)}
            </div>
            <div className={`text-sm font-semibold ${isPositive ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-[#007aff] text-white'
                  : 'bg-[#2c2c2e] text-[#98989d] hover:bg-[#38383a]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${selectedStock}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? '#30d158' : '#ff453a'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isPositive ? '#30d158' : '#ff453a'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#38383a" strokeOpacity={0.3} />
            <XAxis dataKey="date" stroke="#98989d" tick={{ fill: '#98989d', fontSize: 11 }} />
            <YAxis stroke="#98989d" tick={{ fill: '#98989d', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1c1c1e',
                border: '0.5px solid #38383a',
                borderRadius: '12px',
                color: '#ffffff',
                padding: '8px 12px'
              }}
              formatter={(value: any) => `$${parseFloat(value).toFixed(2)}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#30d158' : '#ff453a'}
              strokeWidth={2.5}
              fill={`url(#gradient-${selectedStock})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 pt-6 border-t border-[#38383a]/50">
        <div>
          <div className="text-xs text-[#98989d] font-light mb-1">Open</div>
          <div className="text-sm font-semibold text-white">${previousPrice.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-[#98989d] font-light mb-1">High</div>
          <div className="text-sm font-semibold text-white">${Math.max(...chartData.map(d => d.price), currentPrice).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-[#98989d] font-light mb-1">Low</div>
          <div className="text-sm font-semibold text-white">${Math.min(...chartData.map(d => d.price), currentPrice).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-[#98989d] font-light mb-1">Volume</div>
          <div className="text-sm font-semibold text-white">{(stock.volume / 1000000).toFixed(1)}M</div>
        </div>
      </div>
    </div>
  )
}
