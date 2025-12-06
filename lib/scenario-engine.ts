import { Stock, PriceData, NewsItem, Trade, PortfolioPosition } from './types'

export function generatePricePath(
  basePrice: number,
  volatility: number,
  days: number,
  shocks: { day: number; impact: number }[] = []
): number[] {
  const prices: number[] = [basePrice]
  
  for (let day = 1; day < days; day++) {
    // Random walk with drift
    const randomChange = (Math.random() - 0.5) * volatility * 2
    const drift = -0.001 // Slight negative drift
    
    // Apply shocks if any
    const shock = shocks.find(s => s.day === day)
    const shockImpact = shock ? shock.impact : 0
    
    const newPrice = prices[day - 1] * (1 + randomChange + drift + shockImpact)
    prices.push(Math.max(0.01, newPrice)) // Prevent negative prices
  }
  
  return prices
}

export function calculatePortfolioValue(
  positions: Map<string, PortfolioPosition>,
  currentPrices: Map<string, number>,
  cashBalance: number
): number {
  let totalValue = cashBalance
  
  positions.forEach((position, stockId) => {
    const currentPrice = currentPrices.get(stockId) || 0
    const longValue = position.shares * currentPrice
    const shortValue = position.short_shares * (position.avg_short_price - currentPrice)
    totalValue += longValue + shortValue
  })
  
  return totalValue
}

export function calculateMaxDrawdown(portfolioHistory: number[]): number {
  let maxDrawdown = 0
  let peak = portfolioHistory[0]
  
  for (let i = 1; i < portfolioHistory.length; i++) {
    if (portfolioHistory[i] > peak) {
      peak = portfolioHistory[i]
    }
    const drawdown = (peak - portfolioHistory[i]) / peak
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }
  
  return maxDrawdown
}

export function calculatePortfolioConcentration(
  positions: Map<string, PortfolioPosition>,
  currentPrices: Map<string, number>,
  totalValue: number
): number {
  if (totalValue === 0) return 0
  
  let maxPositionValue = 0
  
  positions.forEach((position, stockId) => {
    const currentPrice = currentPrices.get(stockId) || 0
    const positionValue = position.shares * currentPrice
    if (positionValue > maxPositionValue) {
      maxPositionValue = positionValue
    }
  })
  
  return maxPositionValue / totalValue
}

export function processTrade(
  trade: Trade,
  positions: Map<string, PortfolioPosition>,
  cashBalance: number,
  currentPrice: number
): { newPositions: Map<string, PortfolioPosition>; newCashBalance: number; error?: string } {
  const newPositions = new Map(positions)
  let newCashBalance = cashBalance
  
  const position = newPositions.get(trade.stock_id) || {
    stock_id: trade.stock_id,
    shares: 0,
    short_shares: 0,
    avg_buy_price: 0,
    avg_short_price: 0,
  }
  
  switch (trade.type) {
    case 'buy':
      const cost = trade.shares * currentPrice
      if (cost > newCashBalance) {
        return { newPositions, newCashBalance, error: 'Insufficient funds' }
      }
      
      const totalShares = position.shares + trade.shares
      const totalCost = position.shares * position.avg_buy_price + cost
      position.shares = totalShares
      position.avg_buy_price = totalShares > 0 ? totalCost / totalShares : 0
      newCashBalance -= cost
      break
      
    case 'sell':
      if (position.shares < trade.shares) {
        return { newPositions, newCashBalance, error: 'Insufficient shares' }
      }
      
      position.shares -= trade.shares
      newCashBalance += trade.shares * currentPrice
      break
      
    case 'short':
      // Short selling: borrow shares and sell them
      const shortProceeds = trade.shares * currentPrice
      const totalShortShares = position.short_shares + trade.shares
      const totalShortCost = position.short_shares * position.avg_short_price + shortProceeds
      position.short_shares = totalShortShares
      position.avg_short_price = totalShortShares > 0 ? totalShortCost / totalShortShares : 0
      newCashBalance += shortProceeds
      break
      
    case 'cover':
      // Cover short: buy back shares
      if (position.short_shares < trade.shares) {
        return { newPositions, newCashBalance, error: 'Insufficient short position' }
      }
      
      const coverCost = trade.shares * currentPrice
      if (coverCost > newCashBalance) {
        return { newPositions, newCashBalance, error: 'Insufficient funds to cover' }
      }
      
      position.short_shares -= trade.shares
      newCashBalance -= coverCost
      break
  }
  
  newPositions.set(trade.stock_id, position)
  return { newPositions, newCashBalance }
}


