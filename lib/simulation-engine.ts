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

export interface SimulationState {
  currentHour: number
  totalHours: number
  cashBalance: number
  startingBalance: number
  positions: Map<string, Position>
  stockPrices: Map<string, number>
  priceHistory: Map<string, number[]>
  activeScenarios: Scenario[]
  completedScenarios: Scenario[]
  portfolioHistory: number[]
  newsHistory: ScenarioWithHour[] // Track all scenarios with their hour
  allNewsItems: NewsItem[] // Track all news items (real + fake) per hour
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
  private scenarioProbability = 0.7 // 70% chance of scenario per trading day (8 hours)
  private difficulty: Difficulty

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
      stockPrices: new Map(),
      priceHistory: new Map(),
      activeScenarios: [],
      completedScenarios: [],
      portfolioHistory: [startingBalance],
      newsHistory: [], // Array of {scenario, hour}
      allNewsItems: [], // All news items (real + fake)
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
    this.state.positions.forEach((position, ticker) => {
      const currentPrice = this.getCurrentPrice(ticker)
      total += position.shares * currentPrice
    })
    return total
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
    
    // Mid-day crisis event (hour 4 of each trading day) - 1-2 scenarios
    // Ensure 50/50 split of positive/negative
    if (isMidDay && availableScenarios.length > 0) {
      const numMidDayScenarios = Math.random() < 0.5 ? 2 : 1
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

    // Update stock prices based on scenarios and random walk
    const priceChanges = new Map<string, { old: number; new: number; change: number }>()
    
    mockStocks.forEach(stock => {
      const currentPrice = this.state.stockPrices.get(stock.ticker) || stock.price
      let newPrice = currentPrice

      // Apply scenario impacts - HARD EFFECTS
      this.state.activeScenarios.forEach(scenario => {
        if (scenario.affectedStocks.includes(stock.ticker)) {
          const impactMultiplier = this.getImpactMultiplier(scenario.impact, scenario.sentiment)
          // Much larger base volatility for hard effects (5-10% instead of 2%)
          // Increase volatility on harder difficulties
          let baseVolatility = scenario.impact === 'extreme' ? 0.10 : scenario.impact === 'high' ? 0.07 : 0.05
          if (this.difficulty === 'hard') {
            baseVolatility *= 1.3 // 30% more impact on hard
          } else if (this.difficulty === 'easy') {
            baseVolatility *= 0.8 // 20% less impact on easy
          }
          const change = currentPrice * impactMultiplier * baseVolatility
          
          if (scenario.sentiment === 'positive') {
            newPrice += change
          } else if (scenario.sentiment === 'negative') {
            newPrice -= change
          } else if (scenario.sentiment === 'mixed') {
            newPrice += (Math.random() - 0.5) * change * 2
          }
        }
      })

      // Random walk component - more volatile on harder difficulties
      let randomVolatility = 0.002
      if (this.difficulty === 'hard') {
        randomVolatility = 0.004 // 2x more random volatility
      } else if (this.difficulty === 'easy') {
        randomVolatility = 0.001 // Less random volatility
      }
      const randomChange = (Math.random() - 0.5) * randomVolatility
      newPrice = newPrice * (1 + randomChange)

      // Ensure price doesn't go negative
      newPrice = Math.max(0.01, newPrice)

      const oldPrice = currentPrice
      const change = newPrice - oldPrice

      this.state.stockPrices.set(stock.ticker, newPrice)
      
      const history = this.state.priceHistory.get(stock.ticker) || []
      history.push(newPrice)
      this.state.priceHistory.set(stock.ticker, history)

      priceChanges.set(stock.ticker, { old: oldPrice, new: newPrice, change })
    })

    // Complete scenarios that have run their duration
    this.state.activeScenarios = this.state.activeScenarios.filter(scenario => {
      const shouldComplete = Math.random() < 0.3 // 30% chance to complete each active scenario
      if (shouldComplete) {
        this.state.completedScenarios.push(scenario)
        return false
      }
      return true
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
      
      // Target 2-4 scenarios per day total
      const targetScenarios = Math.floor(Math.random() * 3) + 2 // 2-4
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
    const multipliers: Record<string, Record<string, number>> = {
      low: { positive: 0.5, negative: -0.5, neutral: 0, mixed: 0 },
      medium: { positive: 1.0, negative: -1.0, neutral: 0, mixed: 0 },
      high: { positive: 2.0, negative: -2.0, neutral: 0, mixed: 0 },
      extreme: { positive: 4.0, negative: -4.0, neutral: 0, mixed: 0 },
    }
    return multipliers[impact]?.[sentiment] || 0
  }

  private getDifficultyRatios(): { positiveRatio: number; negativeRatio: number } {
    switch (this.difficulty) {
      case 'easy':
        return { positiveRatio: 0.70, negativeRatio: 0.30 } // 70% positive, 30% negative
      case 'hard':
        return { positiveRatio: 0.30, negativeRatio: 0.70 } // 30% positive, 70% negative
      default: // medium
        return { positiveRatio: 0.50, negativeRatio: 0.50 } // 50/50 balanced
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

