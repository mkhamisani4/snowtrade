'use client'

import { useState } from 'react'
import { Stock, PortfolioPosition } from '@/lib/types'

interface TradingInterfaceProps {
  stock: Stock
  currentPrice: number
  position?: PortfolioPosition
  cashBalance: number
  onTrade: (stockId: string, type: 'buy' | 'sell' | 'short' | 'cover', shares: number) => void
}

export default function TradingInterface({
  stock,
  currentPrice,
  position,
  cashBalance,
  onTrade,
}: TradingInterfaceProps) {
  const [shares, setShares] = useState('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell' | 'short' | 'cover'>('buy')

  const ownedShares = position?.shares || 0
  const shortShares = position?.short_shares || 0

  function handleTrade() {
    const numShares = parseInt(shares)
    if (!numShares || numShares <= 0) {
      alert('Please enter a valid number of shares')
      return
    }

    if (tradeType === 'buy' && numShares * currentPrice > cashBalance) {
      alert('Insufficient funds')
      return
    }

    if (tradeType === 'sell' && numShares > ownedShares) {
      alert('Insufficient shares')
      return
    }

    if (tradeType === 'cover' && numShares > shortShares) {
      alert('Insufficient short position')
      return
    }

    onTrade(stock.id, tradeType, numShares)
    setShares('')
  }

  return (
    <div className="mt-8 p-6 bg-[#1c1c1e] rounded-2xl border border-[#38383a]/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-semibold text-xl text-white mb-1">{stock.ticker}</div>
          <div className="text-sm text-[#98989d] font-light">
            ${currentPrice.toFixed(2)} • {stock.sector}
          </div>
        </div>
        <div className="text-right text-sm text-[#98989d] font-light">
          {ownedShares > 0 && <div className="text-white font-medium mb-1">Owned: {ownedShares}</div>}
          {shortShares > 0 && <div className="text-[#ff453a] font-medium">Shorted: {shortShares}</div>}
        </div>
      </div>

      <div className="flex gap-2.5 mb-5">
        <button
          onClick={() => setTradeType('buy')}
          className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold ios-button ${
            tradeType === 'buy'
              ? 'bg-[#30d158] text-white'
              : 'bg-[#2c2c2e] text-[#98989d] hover:bg-[#38383a]'
          }`}
        >
          Buy
        </button>
        {ownedShares > 0 && (
          <button
            onClick={() => setTradeType('sell')}
            className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold ios-button ${
              tradeType === 'sell'
                ? 'bg-[#ff453a] text-white'
                : 'bg-[#2c2c2e] text-[#98989d] hover:bg-[#38383a]'
            }`}
          >
            Sell
          </button>
        )}
        <button
          onClick={() => setTradeType('short')}
          className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold ios-button ${
            tradeType === 'short'
              ? 'bg-[#ff9f0a] text-white'
              : 'bg-[#2c2c2e] text-[#98989d] hover:bg-[#38383a]'
          }`}
        >
          Short
        </button>
        {shortShares > 0 && (
          <button
            onClick={() => setTradeType('cover')}
            className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold ios-button ${
              tradeType === 'cover'
                ? 'bg-[#007aff] text-white'
                : 'bg-[#2c2c2e] text-[#98989d] hover:bg-[#38383a]'
            }`}
          >
            Cover
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <input
          type="number"
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          placeholder="Shares"
          className="ios-input flex-1 px-5 py-3.5 text-white placeholder-[#98989d] text-[15px] font-light"
          min="1"
        />
        <button
          onClick={handleTrade}
          className="px-8 py-3.5 bg-[#007aff] hover:bg-[#0051d5] text-white rounded-xl font-semibold ios-button"
        >
          Execute
        </button>
      </div>

      {shares && !isNaN(parseInt(shares)) && (
        <div className="mt-4 text-sm text-[#98989d] font-light">
          Cost: ${(parseInt(shares) * currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      )}
    </div>
  )
}
