'use client'

import { useState } from 'react'
import { Position } from '@/lib/simulation-engine'

interface TradeModalProps {
  ticker: string
  currentPrice: number
  position?: Position
  cashBalance: number
  onTrade: (ticker: string, type: 'buy' | 'sell', shares: number) => void
  onClose: () => void
}

export default function TradeModal({ ticker, currentPrice, position, cashBalance, onTrade, onClose }: TradeModalProps) {
  const [shares, setShares] = useState('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const ownedShares = position?.shares || 0

  const handleTrade = () => {
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

    onTrade(ticker, tradeType, numShares)
  }

  const cost = shares && !isNaN(parseInt(shares)) ? parseInt(shares) * currentPrice : 0

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">Trade {ticker}</h2>
            <button
              onClick={onClose}
              className="text-[#98989d] hover:text-white transition-colors text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#2c2c2e]"
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <div className="text-3xl font-bold text-white mb-2">${currentPrice.toFixed(2)}</div>
            {ownedShares > 0 && (
              <div className="text-sm text-[#98989d] font-light">
                You own {ownedShares} shares
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-6">
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
          </div>

          <div className="mb-6">
            <label className="block text-sm text-[#98989d] font-light mb-2">Shares</label>
            <input
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="0"
              className="ios-input w-full px-4 py-3 text-white placeholder-[#98989d] text-[15px] font-light"
              min="1"
            />
          </div>

          {cost > 0 && (
            <div className="mb-6 p-4 bg-[#1c1c1e] rounded-xl">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-[#98989d] font-light">Cost</span>
                <span className="text-white font-semibold">${cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {tradeType === 'buy' && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#98989d] font-light">Cash After</span>
                  <span className={`font-semibold ${(cashBalance - cost) >= 0 ? 'text-white' : 'text-[#ff453a]'}`}>
                    ${(cashBalance - cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#2c2c2e] hover:bg-[#38383a] text-white rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleTrade}
              className="flex-1 px-6 py-3 bg-[#007aff] hover:bg-[#0051d5] text-white rounded-xl font-semibold ios-button"
            >
              Execute
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

