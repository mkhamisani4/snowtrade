'use client'

import { useState } from 'react'
import { getStockByTicker } from '@/lib/mock-stocks'

export default function PortfolioOverview() {
  const [cashBalance] = useState(10000)
  
  // Get current prices from shared stock data
  const glcrStock = getStockByTicker('GLCR')
  const autoStock = getStockByTicker('AUTO')
  
  const [positions] = useState([
    { 
      ticker: 'GLCR', 
      shares: 10, 
      avgPrice: glcrStock ? glcrStock.price - glcrStock.change : 175.50, 
      currentPrice: glcrStock?.price || 178.20, 
      pnl: glcrStock ? (glcrStock.price - (glcrStock.price - glcrStock.change)) * 10 : 27.00 
    },
    { 
      ticker: 'AUTO', 
      shares: 5, 
      avgPrice: autoStock ? autoStock.price - autoStock.change : 108.50, 
      currentPrice: autoStock?.price || 112.00, 
      pnl: autoStock ? (autoStock.price - (autoStock.price - autoStock.change)) * 5 : 17.50 
    },
  ])

  const totalValue = positions.reduce((sum, pos) => sum + (pos.shares * pos.currentPrice), 0) + cashBalance
  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0)

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-6 text-white tracking-tight">Portfolio</h2>

      <div className="mb-6">
        <div className="text-3xl font-bold mb-2 text-white tracking-tight">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className={`text-sm font-semibold ${totalPnL >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
          {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)} ({((totalPnL / (totalValue - totalPnL)) * 100).toFixed(2)}%)
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#98989d] font-light">Cash</span>
          <span className="text-white font-medium">${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#98989d] font-light">Invested</span>
          <span className="text-white font-medium">${(totalValue - cashBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="border-t border-[#38383a]/50 pt-4">
        <h3 className="text-sm font-semibold text-white mb-3">Positions</h3>
        {positions.length === 0 ? (
          <div className="text-sm text-[#98989d] font-light py-4">No positions</div>
        ) : (
          <div className="space-y-3">
            {positions.map((pos) => (
              <div key={pos.ticker} className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-white">{pos.ticker}</div>
                  <div className="text-xs text-[#98989d] font-light mt-0.5">
                    {pos.shares} shares @ ${pos.avgPrice.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">${(pos.shares * pos.currentPrice).toFixed(2)}</div>
                  <div className={`text-xs font-semibold mt-0.5 ${pos.pnl >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                    {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-[#38383a]/50">
        <button className="w-full button-primary py-3.5 px-6 text-sm font-semibold">
          Trade
        </button>
      </div>
    </div>
  )
}
