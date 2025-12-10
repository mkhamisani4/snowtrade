'use client'

import { useState, useEffect } from 'react'
import { Position, OptionPosition } from '@/lib/simulation-engine'

interface TradeModalProps {
  ticker: string
  currentPrice: number
  position?: Position
  optionPositions?: OptionPosition[]
  currentHour?: number
  cashBalance: number
  onTrade: (ticker: string, type: 'buy' | 'sell', shares: number) => void
  onOptionTrade?: (ticker: string, type: 'call' | 'put', contracts: number, strikePrice: number, expirationHours: number) => void
  onCloseOption?: (ticker: string, optionIndex: number) => void
  onClose: () => void
}

export default function TradeModal({ ticker, currentPrice, position, optionPositions = [], currentHour = 1, cashBalance, onTrade, onOptionTrade, onCloseOption, onClose }: TradeModalProps) {
  const [shares, setShares] = useState('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell' | 'call' | 'put' | 'close-option'>('buy')
  const [strikePrice, setStrikePrice] = useState('')
  const [contracts, setContracts] = useState('')
  const [expirationHours, setExpirationHours] = useState(8)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const ownedShares = position?.shares || 0
  const isOptions = tradeType === 'call' || tradeType === 'put'
  const isClosingOption = tradeType === 'close-option'
  
  // Filter active options
  const activeOptions = optionPositions.filter(opt => opt.expirationHour > currentHour)
  
  // Auto-select at-the-money strike when switching to options
  useEffect(() => {
    if (isOptions && !strikePrice) {
      setStrikePrice(currentPrice.toFixed(2))
    }
  }, [isOptions, currentPrice, strikePrice])

  const handleTrade = () => {
    if (isClosingOption) {
      if (!onCloseOption || selectedOptionIndex === null) {
        alert('Please select an option to close')
        return
      }
      onCloseOption(ticker, selectedOptionIndex)
      return
    }
    
    if (isOptions) {
      if (!onOptionTrade) {
        alert('Options trading not available')
        return
      }
      const numContracts = parseInt(contracts)
      const strike = parseFloat(strikePrice)
      if (!numContracts || numContracts <= 0) {
        alert('Please enter a valid number of contracts')
        return
      }
      if (!strike || strike <= 0) {
        alert('Please enter a valid strike price')
        return
      }
      onOptionTrade(ticker, tradeType, numContracts, strike, expirationHours)
    } else {
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
  }

  // Calculate option premium (simplified)
  const calculateOptionPremium = () => {
    if (!isOptions || !strikePrice || !contracts) return 0
    const strike = parseFloat(strikePrice)
    const numContracts = parseInt(contracts)
    if (!strike || !numContracts) return 0
    
    const timeValue = expirationHours / 80
    const volatility = 0.15
    let premium = currentPrice * volatility * timeValue
    
    if (tradeType === 'call' && currentPrice > strike) {
      premium += (currentPrice - strike) * 0.1
    } else if (tradeType === 'put' && currentPrice < strike) {
      premium += (strike - currentPrice) * 0.1
    }
    
    return premium * numContracts * 100 // 100 shares per contract
  }

  const cost = isOptions 
    ? calculateOptionPremium()
    : (shares && !isNaN(parseInt(shares)) ? parseInt(shares) * currentPrice : 0)

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

          <div className="mb-4">
            <div className="text-xs text-[#98989d] font-light mb-2">Trade Type</div>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setTradeType('buy')}
                className={`flex-1 px-4 py-2 rounded-xl text-xs font-semibold ios-button ${
                  tradeType === 'buy'
                    ? 'bg-[#30d158] text-white'
                    : 'bg-[#2c2c2e] text-[#98989d] hover:bg-[#38383a]'
                }`}
              >
                Buy Stock
              </button>
              {ownedShares > 0 && (
                <button
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 px-4 py-2 rounded-xl text-xs font-semibold ios-button ${
                    tradeType === 'sell'
                      ? 'bg-[#ff453a] text-white'
                      : 'bg-[#2c2c2e] text-[#98989d] hover:bg-[#38383a]'
                  }`}
                >
                  Sell Stock
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTradeType('call')}
                className={`flex-1 px-4 py-2 rounded-xl text-xs font-semibold ios-button ${
                  tradeType === 'call'
                    ? 'bg-[#007aff] text-white'
                    : 'bg-[#2c2c2e] text-[#98989d] hover:bg-[#38383a]'
                }`}
              >
                Buy Call
              </button>
              <button
                onClick={() => setTradeType('put')}
                className={`flex-1 px-4 py-2 rounded-xl text-xs font-semibold ios-button ${
                  tradeType === 'put'
                    ? 'bg-[#ff9f0a] text-white'
                    : 'bg-[#2c2c2e] text-[#98989d] hover:bg-[#38383a]'
                }`}
              >
                Buy Put
              </button>
            </div>
            {activeOptions.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setTradeType('close-option')}
                  className={`w-full px-4 py-2 rounded-xl text-xs font-semibold ios-button ${
                    tradeType === 'close-option'
                      ? 'bg-[#30d158] text-white'
                      : 'bg-[#2c2c2e] text-[#98989d] hover:bg-[#38383a]'
                  }`}
                >
                  Close Option Position
                </button>
              </div>
            )}
          </div>

          {isClosingOption ? (
            <>
              <div className="mb-4">
                <label className="block text-sm text-[#98989d] font-light mb-2">Select Option to Close</label>
                {activeOptions.length === 0 ? (
                  <div className="text-sm text-[#98989d] font-light py-4 text-center">No active options</div>
                ) : (
                  <div className="space-y-2">
                    {activeOptions.map((opt, idx) => {
                      const originalIndex = optionPositions.findIndex(o => 
                        o.ticker === opt.ticker && 
                        o.type === opt.type && 
                        o.strikePrice === opt.strikePrice && 
                        o.expirationHour === opt.expirationHour &&
                        o.hour === opt.hour
                      )
                      let intrinsicValue = 0
                      if (opt.type === 'call') {
                        intrinsicValue = Math.max(0, currentPrice - opt.strikePrice)
                      } else {
                        intrinsicValue = Math.max(0, opt.strikePrice - currentPrice)
                      }
                      const currentValue = intrinsicValue * opt.contracts * 100
                      const pnl = currentValue - (opt.premium * opt.contracts * 100)
                      const hoursRemaining = opt.expirationHour - currentHour
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedOptionIndex(originalIndex)}
                          className={`w-full p-3 rounded-xl text-left transition-all ${
                            selectedOptionIndex === originalIndex
                              ? 'bg-[#007aff] border-2 border-[#007aff]'
                              : 'bg-[#1c1c1e] border border-[#38383a]/50 hover:bg-[#2c2c2e]'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <div className="font-semibold text-white text-sm">
                                {opt.type.toUpperCase()} ${opt.strikePrice.toFixed(2)}
                              </div>
                              <div className="text-xs text-[#98989d] mt-0.5">
                                {opt.contracts} contracts • {hoursRemaining}h remaining
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-white text-sm">${currentValue.toFixed(2)}</div>
                              <div className={`text-xs font-semibold ${pnl >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                                {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </>
          ) : isOptions ? (
            <>
              <div className="mb-4">
                <label className="block text-sm text-[#98989d] font-light mb-2">Contracts</label>
                <input
                  type="number"
                  value={contracts}
                  onChange={(e) => setContracts(e.target.value)}
                  placeholder="0"
                  className="ios-input w-full px-4 py-3 text-white placeholder-[#98989d] text-[15px] font-light"
                  min="1"
                />
                <p className="text-xs text-[#98989d] font-light mt-1">1 contract = 100 shares</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-[#98989d] font-light mb-2">Strike Price</label>
                <div className="grid grid-cols-3 gap-2">
                  {(() => {
                    // Generate strike prices: 10% below, 5% below, current, 5% above, 10% above
                    const strikes = [
                      currentPrice * 0.90,
                      currentPrice * 0.95,
                      currentPrice,
                      currentPrice * 1.05,
                      currentPrice * 1.10
                    ]
                    return strikes.map((strike, idx) => {
                      const isSelected = strikePrice && Math.abs(parseFloat(strikePrice) - strike) < 0.01
                      const isAtm = idx === 2
                      return (
                        <button
                          key={idx}
                          onClick={() => setStrikePrice(strike.toFixed(2))}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-[#007aff] text-white'
                              : 'bg-[#2c2c2e] text-[#98989d] hover:bg-[#38383a]'
                          }`}
                        >
                          ${strike.toFixed(2)}
                          {isAtm && <div className="text-[10px] mt-0.5 opacity-75">ATM</div>}
                        </button>
                      )
                    })
                  })()}
                </div>
                {strikePrice && (
                  <div className="mt-2 text-xs text-[#98989d] font-light">
                    {tradeType === 'call' 
                      ? (parseFloat(strikePrice) < currentPrice ? 'In-the-money' : parseFloat(strikePrice) > currentPrice ? 'Out-of-the-money' : 'At-the-money')
                      : (parseFloat(strikePrice) > currentPrice ? 'In-the-money' : parseFloat(strikePrice) < currentPrice ? 'Out-of-the-money' : 'At-the-money')
                    }
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm text-[#98989d] font-light mb-2">Expiration (hours)</label>
                <select
                  value={expirationHours}
                  onChange={(e) => setExpirationHours(parseInt(e.target.value))}
                  className="ios-input w-full px-4 py-3 text-white text-[15px] font-light"
                >
                  <option value={8}>1 Trading Day (8 hours)</option>
                  <option value={16}>2 Trading Days (16 hours)</option>
                  <option value={24}>3 Trading Days (24 hours)</option>
                  <option value={40}>5 Trading Days (40 hours)</option>
                </select>
              </div>
            </>
          ) : (
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
          )}

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
              disabled={isClosingOption && selectedOptionIndex === null}
            >
              {isClosingOption ? 'Close Option' : 'Execute'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

