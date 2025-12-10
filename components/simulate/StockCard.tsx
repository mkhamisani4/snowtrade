'use client'

import { Stock } from '@/lib/mock-stocks'
import { Position } from '@/lib/simulation-engine'

interface StockCardProps {
  stock: Stock
  currentPrice: number
  priceChange?: { old: number; new: number; change: number }
  position?: Position
  isWatched?: boolean
  onClick: () => void
  onInfoClick?: () => void
  onWatchlistToggle?: () => void
}

export default function StockCard({ stock, currentPrice, priceChange, position, isWatched, onClick, onInfoClick, onWatchlistToggle }: StockCardProps) {
  const changePercent = priceChange 
    ? ((priceChange.change / priceChange.old) * 100)
    : ((currentPrice - stock.price) / stock.price) * 100
  
  const isPositive = changePercent >= 0
  const hasPosition = position && position.shares > 0

  return (
    <div
      onClick={onClick}
      className="card p-5 cursor-pointer group relative overflow-hidden"
    >
      {/* Subtle gradient overlay on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        isPositive ? 'bg-gradient-to-br from-[#30d158]/5 to-transparent' : 'bg-gradient-to-br from-[#ff453a]/5 to-transparent'
      }`}></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1">
              <div className="font-semibold text-lg text-white group-hover:text-white transition-colors">{stock.ticker}</div>
              <div className="text-xs text-[#98989d] font-light group-hover:text-[#b0b0b5] transition-colors">{stock.name}</div>
            </div>
            {hasPosition && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-[#007aff]/25 to-[#007aff]/15 text-[#007aff] rounded-lg text-xs font-semibold border border-[#007aff]/30 backdrop-blur-sm">
                {position.shares} shares
              </div>
            )}
            <div className="flex gap-2">
              {onWatchlistToggle && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onWatchlistToggle()
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isWatched
                      ? 'bg-[#ff9f0a]/20 text-[#ff9f0a] hover:bg-[#ff9f0a]/30'
                      : 'bg-[#2c2c2e] hover:bg-[#38383a] text-[#98989d]'
                  }`}
                >
                  {isWatched ? '⭐' : '☆'}
                </button>
              )}
              {onInfoClick && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onInfoClick()
                  }}
                  className="px-3 py-1.5 bg-[#2c2c2e] hover:bg-[#38383a] text-white rounded-lg text-xs font-semibold transition-all"
                >
                  ℹ️ Info
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-[#98989d] font-light">Price: </span>
              <span className="text-white font-semibold">${currentPrice.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[#98989d] font-light">Sector: </span>
              <span className="text-white font-medium">{stock.sector}</span>
            </div>
          </div>
        </div>
        <div className="text-right min-w-[100px]">
          {priceChange && (
            <div className={`text-lg font-semibold mb-1 transition-all ${
              isPositive 
                ? 'text-[#30d158] group-hover:drop-shadow-[0_0_8px_rgba(48,209,88,0.5)]' 
                : 'text-[#ff453a] group-hover:drop-shadow-[0_0_8px_rgba(255,69,58,0.5)]'
            }`}>
              {isPositive ? '+' : ''}{priceChange.change.toFixed(2)}
            </div>
          )}
          <div className={`text-sm font-semibold transition-all ${
            isPositive 
              ? 'text-[#30d158] group-hover:drop-shadow-[0_0_6px_rgba(48,209,88,0.4)]' 
              : 'text-[#ff453a] group-hover:drop-shadow-[0_0_6px_rgba(255,69,58,0.4)]'
          }`}>
            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  )
}

