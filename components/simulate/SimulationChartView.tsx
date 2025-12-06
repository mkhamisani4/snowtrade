'use client'

import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getStockByTicker } from '@/lib/mock-stocks'

interface SimulationChartViewProps {
  selectedStock: string | null
  priceHistory: Map<string, number[]>
  currentPrices: Map<string, number>
}

export default function SimulationChartView({ selectedStock, priceHistory, currentPrices }: SimulationChartViewProps) {
  const stock = selectedStock ? getStockByTicker(selectedStock) : null

  if (!selectedStock || !stock) {
    return (
      <div className="card p-12 text-center">
        <div className="text-[#98989d] font-light">
          Select a stock to view chart
        </div>
      </div>
    )
  }

  const history = priceHistory.get(selectedStock) || []
  const currentPrice = currentPrices.get(selectedStock) || stock.price
  const previousPrice = history.length > 1 ? history[history.length - 2] : stock.price
  const change = currentPrice - previousPrice
  const changePercent = previousPrice > 0 ? ((change / previousPrice) * 100) : 0
  const isPositive = change >= 0

  const chartData = history.map((price, index) => ({
    hour: index + 1,
    price: price,
  }))

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
      </div>

      {chartData.length > 1 && (
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
              <XAxis dataKey="hour" stroke="#98989d" tick={{ fill: '#98989d', fontSize: 11 }} />
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
                labelFormatter={(label) => `Hour ${label}`}
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
      )}

      {chartData.length <= 1 && (
        <div className="h-80 flex items-center justify-center">
          <div className="text-[#98989d] font-light">Chart data will appear as time progresses</div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 pt-6 border-t border-[#38383a]/50">
        <div>
          <div className="text-xs text-[#98989d] font-light mb-1">Open</div>
          <div className="text-sm font-semibold text-white">${(history[0] || stock.price).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-[#98989d] font-light mb-1">High</div>
          <div className="text-sm font-semibold text-white">${(history.length > 0 ? Math.max(...history) : currentPrice).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-[#98989d] font-light mb-1">Low</div>
          <div className="text-sm font-semibold text-white">${(history.length > 0 ? Math.min(...history) : currentPrice).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-xs text-[#98989d] font-light mb-1">Current</div>
          <div className="text-sm font-semibold text-white">${currentPrice.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}

