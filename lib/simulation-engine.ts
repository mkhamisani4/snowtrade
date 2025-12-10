// Simulation engine for trading game
import { mockStocks, Stock } from './mock-stocks'
import { scenarios, Scenario } from './scenarios'
import { generateFakeNews, NewsItem } from './fake-news'

export interface ScenarioWithHour {
  scenario: Scenario
  hour: number
}

// Re-export NewsItem for convenience
export type { NewsItem } from './fake-news'

export interface TradeRecord {
  ticker: string
  type: 'buy' | 'sell' | 'call' | 'put'
  shares: number
  price: number
  hour: number
  strikePrice?: number // For options
  expirationHour?: number // For options
}

export interface OptionPosition {
  ticker: string
  type: 'call' | 'put'
  contracts: number
  strikePrice: number
  premium: number
  expirationHour: number
  hour: number // When purchased
}

export interface SimulationState {
  currentHour: number
  totalHours: number
  cashBalance: number
  startingBalance: number
  positions: Map<string, Position>
  optionPositions: Map<string, OptionPosition[]> // ticker -> array of option positions
  watchlist: Set<string> // Tickers on watchlist
  stockPrices: Map<string, number>
  priceHistory: Map<string, number[]>
  activeScenarios: Scenario[]
  completedScenarios: Scenario[]
  portfolioHistory: number[]
  newsHistory: ScenarioWithHour[] // Track all scenarios with their hour
  allNewsItems: NewsItem[] // Track all news items (real + fake) per hour
  tradeHistory: TradeRecord[] // Track all trades for learning analysis
}

export interface Position {
  ticker: string
  shares: number
  avgPrice: number
}

export interface Trade {
  ticker: string
  type: 'buy' | 'sell'
  shares: number
  price: number
  hour: number
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export class TradingSimulation {
  private state: SimulationState
  private allScenarios: Scenario[]
  private scenarioProbability = 0.85 // 85% chance of scenario per trading day (8 hours) - increased for more events
  private difficulty: Difficulty
  private randomCrashProbability = 0.15 // 15% chance of random negative price movement per hour

  constructor(totalHours: number = 80, startingBalance: number = 10000, difficulty: Difficulty = 'medium') {
    this.difficulty = difficulty
    // 80 hours = 10 trading days (8 hours per trading day)
    this.allScenarios = [...scenarios]
    this.state = {
      currentHour: 1,
      totalHours,
      cashBalance: startingBalance,
      startingBalance,
      positions: new Map(),
      optionPositions: new Map(),
      watchlist: new Set(),
      stockPrices: new Map(),
      priceHistory: new Map(),
      activeScenarios: [],
      completedScenarios: [],
      portfolioHistory: [startingBalance],
      newsHistory: [], // Array of {scenario, hour}
      allNewsItems: [], // All news items (real + fake)
      tradeHistory: [], // Track all trades
    }

    // Initialize stock prices
    mockStocks.forEach(stock => {
      this.state.stockPrices.set(stock.ticker, stock.price)
      this.state.priceHistory.set(stock.ticker, [stock.price])
    })
  }

  getState(): SimulationState {
    return { ...this.state }
  }

  getCurrentPrice(ticker: string): number {
    return this.state.stockPrices.get(ticker) || 0
  }

  getPortfolioValue(): number {
    let total = this.state.cashBalance
    // Stock positions
    this.state.positions.forEach((position, ticker) => {
      const currentPrice = this.getCurrentPrice(ticker)
      total += position.shares * currentPrice
    })
    // Option positions
    this.state.optionPositions.forEach((options, ticker) => {
      const currentPrice = this.getCurrentPrice(ticker)
      options.forEach(option => {
        if (option.expirationHour > this.state.currentHour) {
          // Option is still active, calculate intrinsic value
          let intrinsicValue = 0
          if (option.type === 'call') {
            intrinsicValue = Math.max(0, currentPrice - option.strikePrice)
          } else { // put
            intrinsicValue = Math.max(0, option.strikePrice - currentPrice)
          }
          // Options are worth 100 shares per contract
          total += intrinsicValue * option.contracts * 100
        }
        // Expired options are worth 0
      })
    })
    return total
  }

  toggleWatchlist(ticker: string): void {
    if (this.state.watchlist.has(ticker)) {
      this.state.watchlist.delete(ticker)
    } else {
      this.state.watchlist.add(ticker)
    }
  }

  executeOptionTrade(
    ticker: string,
    type: 'call' | 'put',
    contracts: number,
    strikePrice: number,
    expirationHours: number = 8 // Default 1 trading day
  ): { success: boolean; error?: string } {
    const currentPrice = this.getCurrentPrice(ticker)
    if (!currentPrice) {
      return { success: false, error: 'Stock not found' }
    }

    // Simplified option pricing: premium = (current price * volatility * time) / 10
    // For calls: add intrinsic value if in-the-money
    // For puts: add intrinsic value if in-the-money
    const timeValue = expirationHours / 80 // Normalize to simulation length
    const volatility = 0.15 // Base volatility
    let premium = currentPrice * volatility * timeValue

    if (type === 'call' && currentPrice > strikePrice) {
      premium += (currentPrice - strikePrice) * 0.1 // In-the-money premium
    } else if (type === 'put' && currentPrice < strikePrice) {
      premium += (strikePrice - currentPrice) * 0.1 // In-the-money premium
    }

    const totalCost = premium * contracts * 100 // 100 shares per contract

    if (totalCost > this.state.cashBalance) {
      return { success: false, error: 'Insufficient funds' }
    }

    // Add option position
    const expirationHour = this.state.currentHour + expirationHours
    const option: OptionPosition = {
      ticker,
      type,
      contracts,
      strikePrice,
      premium,
      expirationHour,
      hour: this.state.currentHour,
    }

    const existingOptions = this.state.optionPositions.get(ticker) || []
    existingOptions.push(option)
    this.state.optionPositions.set(ticker, existingOptions)

    this.state.cashBalance -= totalCost

    // Record trade
    this.state.tradeHistory.push({
      ticker,
      type,
      shares: contracts,
      price: premium,
      hour: this.state.currentHour,
      strikePrice,
      expirationHour,
    })

    return { success: true }
  }

  closeOptionPosition(
    ticker: string,
    optionIndex: number
  ): { success: boolean; error?: string; proceeds?: number } {
    const options = this.state.optionPositions.get(ticker)
    if (!options || optionIndex < 0 || optionIndex >= options.length) {
      return { success: false, error: 'Option position not found' }
    }

    const option = options[optionIndex]
    
    // Check if option is expired
    if (option.expirationHour <= this.state.currentHour) {
      return { success: false, error: 'Option has expired' }
    }

    // Calculate current intrinsic value
    const currentPrice = this.getCurrentPrice(ticker)
    let intrinsicValue = 0
    if (option.type === 'call') {
      intrinsicValue = Math.max(0, currentPrice - option.strikePrice)
    } else { // put
      intrinsicValue = Math.max(0, option.strikePrice - currentPrice)
    }

    // Calculate proceeds (intrinsic value * contracts * 100)
    const proceeds = intrinsicValue * option.contracts * 100

    // Remove the option position
    options.splice(optionIndex, 1)
    if (options.length === 0) {
      this.state.optionPositions.delete(ticker)
    } else {
      this.state.optionPositions.set(ticker, options)
    }

    // Add proceeds to cash balance
    this.state.cashBalance += proceeds

    // Record trade
    this.state.tradeHistory.push({
      ticker,
      type: option.type === 'call' ? 'call' : 'put',
      shares: option.contracts,
      price: intrinsicValue,
      hour: this.state.currentHour,
      strikePrice: option.strikePrice,
      expirationHour: option.expirationHour,
    })

    return { success: true, proceeds }
  }

  executeTrade(ticker: string, type: 'buy' | 'sell', shares: number): { success: boolean; error?: string } {
    const currentPrice = this.getCurrentPrice(ticker)
    if (!currentPrice) {
      return { success: false, error: 'Stock not found' }
    }

    const position = this.state.positions.get(ticker) || { ticker, shares: 0, avgPrice: 0 }

    if (type === 'buy') {
      const cost = shares * currentPrice
      if (cost > this.state.cashBalance) {
        return { success: false, error: 'Insufficient funds' }
      }

      const totalShares = position.shares + shares
      const totalCost = position.shares * position.avgPrice + cost
      const newAvgPrice = totalShares > 0 ? totalCost / totalShares : currentPrice

      this.state.positions.set(ticker, {
        ticker,
        shares: totalShares,
        avgPrice: newAvgPrice,
      })
      this.state.cashBalance -= cost
      
      // Record trade
      this.state.tradeHistory.push({
        ticker,
        type: 'buy',
        shares,
        price: currentPrice,
        hour: this.state.currentHour,
      })
    } else {
      if (position.shares < shares) {
        return { success: false, error: 'Insufficient shares' }
      }

      const proceeds = shares * currentPrice
      this.state.positions.set(ticker, {
        ticker,
        shares: position.shares - shares,
        avgPrice: position.avgPrice,
      })
      this.state.cashBalance += proceeds
      
      // Record trade
      this.state.tradeHistory.push({
        ticker,
        type: 'sell',
        shares,
        price: currentPrice,
        hour: this.state.currentHour,
      })
    }

    return { success: true }
  }

  advanceHour(): { newScenarios: Scenario[]; priceChanges: Map<string, { old: number; new: number; change: number }>; isEndOfTradingDay: boolean; isMidDay: boolean; newsItems: NewsItem[] } {
    if (this.state.currentHour >= this.state.totalHours) {
      return { newScenarios: [], priceChanges: new Map(), isEndOfTradingDay: false, isMidDay: false, newsItems: [] }
    }

    this.state.currentHour++
    const isEndOfTradingDay = this.state.currentHour % 8 === 0 // End of 8-hour trading day
    const isMidDay = this.state.currentHour % 8 === 4 // Mid-day crisis at hour 4 of each trading day

    // Generate new scenarios - mid-day and end-of-day events
    const newScenarios: Scenario[] = []
    const availableScenarios = this.allScenarios.filter(
      s => !this.state.activeScenarios.includes(s) && !this.state.completedScenarios.includes(s)
    )
    
    // Mid-day crisis event (hour 4 of each trading day) - 1-3 scenarios
    // Bias towards negative events
    if (isMidDay && availableScenarios.length > 0) {
      // More likely to have 2-3 scenarios, with bias towards negatives
      const numMidDayScenarios = Math.random() < 0.3 ? 1 : Math.random() < 0.7 ? 2 : 3
      const positiveScenarios = availableScenarios.filter(s => s.sentiment === 'positive')
      const negativeScenarios = availableScenarios.filter(s => s.sentiment === 'negative')
      
      // Count current sentiment balance
      const currentPositive = this.state.activeScenarios.filter(s => s.sentiment === 'positive').length
      const currentNegative = this.state.activeScenarios.filter(s => s.sentiment === 'negative').length
      
      // Get difficulty-based target ratios
      const { positiveRatio, negativeRatio } = this.getDifficultyRatios()
      
      const midDayAvailable: Scenario[] = []
      for (let i = 0; i < numMidDayScenarios; i++) {
        // Balance towards difficulty target ratio
        const totalActive = currentPositive + currentNegative
        const targetPositive = totalActive * positiveRatio
        const targetNegative = totalActive * negativeRatio
        
        if (currentPositive < targetPositive && positiveScenarios.length > 0) {
          const randomIndex = Math.floor(Math.random() * positiveScenarios.length)
          midDayAvailable.push(positiveScenarios[randomIndex])
          positiveScenarios.splice(randomIndex, 1)
        } else if (currentNegative < targetNegative && negativeScenarios.length > 0) {
          const randomIndex = Math.floor(Math.random() * negativeScenarios.length)
          midDayAvailable.push(negativeScenarios[randomIndex])
          negativeScenarios.splice(randomIndex, 1)
        } else {
          // Use difficulty-weighted random selection
          const usePositive = Math.random() < positiveRatio
          if (usePositive && positiveScenarios.length > 0) {
            const randomIndex = Math.floor(Math.random() * positiveScenarios.length)
            midDayAvailable.push(positiveScenarios[randomIndex])
            positiveScenarios.splice(randomIndex, 1)
          } else if (negativeScenarios.length > 0) {
            const randomIndex = Math.floor(Math.random() * negativeScenarios.length)
            midDayAvailable.push(negativeScenarios[randomIndex])
            negativeScenarios.splice(randomIndex, 1)
          }
        }
      }
      
      for (const scenario of midDayAvailable) {
        newScenarios.push(scenario)
        this.state.activeScenarios.push(scenario)
        this.state.newsHistory.push({ scenario, hour: this.state.currentHour })
      }
    }

    // Random hourly negative event chance (5% per hour for market-wide negative movement)
    const randomMarketNegative = Math.random() < 0.05 // 5% chance per hour
    
    // Update stock prices based on scenarios and random walk
    const priceChanges = new Map<string, { old: number; new: number; change: number }>()
    
    mockStocks.forEach(stock => {
      const currentPrice = this.state.stockPrices.get(stock.ticker) || stock.price
      let newPrice = currentPrice
      
      // Apply random market-wide negative movement if triggered
      if (randomMarketNegative) {
        const marketDrop = 0.02 + Math.random() * 0.03 // 2-5% drop
        newPrice = newPrice * (1 - marketDrop)
      }

      // Apply scenario impacts - CAPPED AND BOUNDED
      let totalScenarioImpact = 0 // Track total impact from all scenarios
      const affectedScenarios = this.state.activeScenarios.filter(s => s.affectedStocks.includes(stock.ticker))
      
      // Limit how many scenarios can affect a stock at once (max 2)
      const maxScenariosPerStock = 2
      const scenariosToApply = affectedScenarios.slice(0, maxScenariosPerStock)
      
      // Find how long each scenario has been active
      scenariosToApply.forEach(scenario => {
        // Find when this scenario was added
        const scenarioEntry = this.state.newsHistory.find(item => item.scenario.id === scenario.id)
        const hoursActive = scenarioEntry ? this.state.currentHour - scenarioEntry.hour : 1
        
        // Decay impact over time - scenarios lose 50% of impact after 4 hours
        const decayFactor = Math.max(0.3, 1 - (hoursActive - 1) * 0.15) // Decay to 30% after ~5 hours
        
        const impactMultiplier = this.getImpactMultiplier(scenario.impact, scenario.sentiment)
        // Reduced base volatility to prevent explosions
        let baseVolatility = scenario.impact === 'extreme' ? 0.03 : scenario.impact === 'high' ? 0.02 : scenario.impact === 'medium' ? 0.015 : 0.01
        if (this.difficulty === 'hard') {
          baseVolatility *= 1.2 // 20% more impact on hard (reduced from 30%)
        } else if (this.difficulty === 'easy') {
          baseVolatility *= 0.7 // 30% less impact on easy
        }
        const impact = impactMultiplier * baseVolatility * decayFactor
        
        if (scenario.sentiment === 'positive') {
          totalScenarioImpact += impact
        } else if (scenario.sentiment === 'negative') {
          totalScenarioImpact -= impact
        } else if (scenario.sentiment === 'mixed') {
          totalScenarioImpact += (Math.random() - 0.5) * impact * 2
        }
      })
      
      // Cap total scenario impact per hour to prevent explosions (max 6% per hour)
      totalScenarioImpact = Math.max(-0.06, Math.min(0.06, totalScenarioImpact))
      newPrice = newPrice * (1 + totalScenarioImpact)

      // Random walk component - more volatile on harder difficulties
      let randomVolatility = 0.002
      if (this.difficulty === 'hard') {
        randomVolatility = 0.003 // Reduced from 0.004
      } else if (this.difficulty === 'easy') {
        randomVolatility = 0.001 // Less random volatility
      }
      
      // Add random negative crashes - more frequent but capped
      let randomCrash = 0
      if (Math.random() < this.randomCrashProbability) {
        // Random crash: 2-5% drop (reduced from 3-8%)
        const crashSeverity = 0.02 + Math.random() * 0.03 // 2-5% drop
        randomCrash = -crashSeverity
      }
      
      // Add random negative drift - slight downward bias
      const negativeDrift = -0.0003 // Small negative drift (reduced)
      
      const randomChange = (Math.random() - 0.5) * randomVolatility + randomCrash + negativeDrift
      newPrice = newPrice * (1 + randomChange)
      
      // CAP TOTAL HOURLY CHANGE - prevent explosions (max 8% up or down per hour)
      const hourlyChange = (newPrice - currentPrice) / currentPrice
      if (Math.abs(hourlyChange) > 0.08) {
        const cappedChange = hourlyChange > 0 ? 0.08 : -0.08
        newPrice = currentPrice * (1 + cappedChange)
      }

      // Ensure price doesn't go negative and stays within reasonable bounds
      // Stock can't go below $0.01 or above 3x original price (or below 0.2x original)
      const originalPrice = stock.price
      const minPrice = Math.max(0.01, originalPrice * 0.2) // Can't drop below 20% of original
      const maxPrice = originalPrice * 3 // Can't exceed 3x original price (was 5x)
      newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice))

      const oldPrice = currentPrice
      const change = newPrice - oldPrice

      this.state.stockPrices.set(stock.ticker, newPrice)
      
      const history = this.state.priceHistory.get(stock.ticker) || []
      history.push(newPrice)
      this.state.priceHistory.set(stock.ticker, history)

      priceChanges.set(stock.ticker, { old: oldPrice, new: newPrice, change })
    })

        // Complete scenarios that have run their duration
        // Negative scenarios last longer to have more impact
        this.state.activeScenarios = this.state.activeScenarios.filter(scenario => {
          // Negative scenarios have 20% chance to complete (last longer)
          // Positive scenarios have 40% chance to complete (shorter duration)
          const completionChance = scenario.sentiment === 'negative' ? 0.2 : 0.4
          const shouldComplete = Math.random() < completionChance
          if (shouldComplete) {
            this.state.completedScenarios.push(scenario)
            return false
          }
          return true
        })

        // Expire options
        this.state.optionPositions.forEach((options, ticker) => {
          const activeOptions = options.filter(option => option.expirationHour > this.state.currentHour)
          if (activeOptions.length === 0) {
            this.state.optionPositions.delete(ticker)
          } else {
            this.state.optionPositions.set(ticker, activeOptions)
          }
        })

    // At end of trading day, trigger remaining scenarios to total 2-4 per day
    // Ensure 50/50 split of positive/negative
    if (isEndOfTradingDay) {
      // Count scenarios that happened today
      const currentDay = Math.floor((this.state.currentHour - 1) / 8)
      const scenariosToday = this.state.newsHistory.filter(item => {
        const scenarioDay = Math.floor((item.hour - 1) / 8)
        return scenarioDay === currentDay
      }).length
      
      // Target 3-5 scenarios per day total (increased for more events)
      const targetScenarios = Math.floor(Math.random() * 3) + 3 // 3-5
      const remainingScenarios = Math.max(0, targetScenarios - scenariosToday)
      
      const dayEndScenarios: Scenario[] = []
      const positiveAvailable = this.allScenarios.filter(
        s => !this.state.activeScenarios.includes(s) && !this.state.completedScenarios.includes(s) && !newScenarios.includes(s) && s.sentiment === 'positive'
      )
      const negativeAvailable = this.allScenarios.filter(
        s => !this.state.activeScenarios.includes(s) && !this.state.completedScenarios.includes(s) && !newScenarios.includes(s) && s.sentiment === 'negative'
      )
      
      // Count current sentiment balance
      const currentPositive = this.state.activeScenarios.filter(s => s.sentiment === 'positive').length
      const currentNegative = this.state.activeScenarios.filter(s => s.sentiment === 'negative').length
      
      // Get difficulty-based target ratios
      const { positiveRatio, negativeRatio } = this.getDifficultyRatios()
      
      for (let i = 0; i < remainingScenarios; i++) {
        let selectedScenario: Scenario | null = null
        
        // Balance towards difficulty target ratio
        const totalActive = currentPositive + currentNegative
        const targetPositive = totalActive * positiveRatio
        const targetNegative = totalActive * negativeRatio
        
        if (currentPositive < targetPositive && positiveAvailable.length > 0) {
          const randomIndex = Math.floor(Math.random() * positiveAvailable.length)
          selectedScenario = positiveAvailable[randomIndex]
          positiveAvailable.splice(randomIndex, 1)
        } else if (currentNegative < targetNegative && negativeAvailable.length > 0) {
          const randomIndex = Math.floor(Math.random() * negativeAvailable.length)
          selectedScenario = negativeAvailable[randomIndex]
          negativeAvailable.splice(randomIndex, 1)
        } else {
          // Use difficulty-weighted random selection
          const usePositive = Math.random() < positiveRatio
          if (usePositive && positiveAvailable.length > 0) {
            const randomIndex = Math.floor(Math.random() * positiveAvailable.length)
            selectedScenario = positiveAvailable[randomIndex]
            positiveAvailable.splice(randomIndex, 1)
          } else if (negativeAvailable.length > 0) {
            const randomIndex = Math.floor(Math.random() * negativeAvailable.length)
            selectedScenario = negativeAvailable[randomIndex]
            negativeAvailable.splice(randomIndex, 1)
          }
        }
        
        if (selectedScenario) {
          dayEndScenarios.push(selectedScenario)
          this.state.activeScenarios.push(selectedScenario)
          this.state.newsHistory.push({ scenario: selectedScenario, hour: this.state.currentHour })
        }
      }
      
      newScenarios.push(...dayEndScenarios)
    }

    // Generate 10 news items per hour (mix of real scenarios and fake news)
    const newsItems = generateFakeNews(this.state.currentHour, newScenarios)
    this.state.allNewsItems.push(...newsItems)

    // Update portfolio history
    const portfolioValue = this.getPortfolioValue()
    this.state.portfolioHistory.push(portfolioValue)

    return { newScenarios, priceChanges, isEndOfTradingDay, isMidDay, newsItems }
  }

  private getImpactMultiplier(impact: string, sentiment: string): number {
    // Reduced multipliers to prevent price explosions
    const multipliers: Record<string, Record<string, number>> = {
      low: { positive: 0.3, negative: -0.3, neutral: 0, mixed: 0 },
      medium: { positive: 0.6, negative: -0.6, neutral: 0, mixed: 0 },
      high: { positive: 1.0, negative: -1.0, neutral: 0, mixed: 0 },
      extreme: { positive: 1.5, negative: -1.5, neutral: 0, mixed: 0 }, // Reduced from 4.0
    }
    return multipliers[impact]?.[sentiment] || 0
  }

  private getDifficultyRatios(): { positiveRatio: number; negativeRatio: number } {
    switch (this.difficulty) {
      case 'easy':
        return { positiveRatio: 0.60, negativeRatio: 0.40 } // 60% positive, 40% negative (was 70/30)
      case 'hard':
        return { positiveRatio: 0.20, negativeRatio: 0.80 } // 20% positive, 80% negative (was 30/70)
      default: // medium
        return { positiveRatio: 0.40, negativeRatio: 0.60 } // 40% positive, 60% negative (was 50/50) - more negatives by default
    }
  }

  isComplete(): boolean {
    return this.state.currentHour >= this.state.totalHours
  }

  getPerformanceMetrics() {
    const finalValue = this.getPortfolioValue()
    const totalReturn = (finalValue - this.state.startingBalance) / this.state.startingBalance
    const maxValue = Math.max(...this.state.portfolioHistory)
    const minValue = Math.min(...this.state.portfolioHistory)
    const maxDrawdown = maxValue > 0 ? (maxValue - minValue) / maxValue : 0

    return {
      finalValue,
      startingBalance: this.state.startingBalance,
      totalReturn,
      maxDrawdown,
      totalTrades: 0, // Could track this if needed
    }
  }
}

