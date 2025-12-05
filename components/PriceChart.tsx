'use client'

import { Stock } from '@/lib/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PriceChartProps {
  stock: Stock
  prices: number[]
  currentDay: number
  currentPrice: number
}

export default function PriceChart({ stock, prices, currentDay, currentPrice }: PriceChartProps) {
  const visiblePrices = prices.slice(0, currentDay)
  const chartData = visiblePrices.map((price, index) => ({
    day: index + 1,
    price: price.toFixed(2),
  }))

  const priceChange = visiblePrices.length > 1
    ? ((currentPrice - visiblePrices[0]) / visiblePrices[0]) * 100
    : 0

  const isPositive = priceChange >= 0

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="font-semibold text-2xl text-white mb-1 tracking-tight">{stock.ticker}</div>
          <div className="text-sm text-[#98989d] font-light">{stock.name} • {stock.sector}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-3xl text-white mb-1 tracking-tight">${currentPrice.toFixed(2)}</div>
          <div className={`text-base font-semibold ${isPositive ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        </div>
      </div>

      {visiblePrices.length > 1 && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${stock.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? '#30d158' : '#ff453a'} stopOpacity={0.25}/>
                  <stop offset="95%" stopColor={isPositive ? '#30d158' : '#ff453a'} stopOpacity={0}/>
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
                formatter={(value: any) => `$${parseFloat(value).toFixed(2)}`}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? '#30d158' : '#ff453a'}
                strokeWidth={3}
                dot={false}
                fill={`url(#gradient-${stock.id})`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
