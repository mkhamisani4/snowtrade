// Analyze trading behavior and generate learning insights
import { TradeRecord } from './simulation-engine'
import { ScenarioWithHour } from './simulation-engine'
import { mockStocks } from './mock-stocks'

export interface TradingInsight {
  category: 'strength' | 'weakness' | 'tip'
  title: string
  description: string
  severity?: 'low' | 'medium' | 'high'
}

export interface TradingAnalysis {
  insights: TradingInsight[]
  tradingStyle: string
  riskLevel: string
  diversificationScore: number
  timingScore: number
}

export function analyzeTradingBehavior(
  trades: TradeRecord[],
  portfolioHistory: number[],
  newsHistory: ScenarioWithHour[],
  finalReturn: number
): TradingAnalysis {
  const insights: TradingInsight[] = []
  
  // Analyze trade frequency
  const totalTrades = trades.length
  const avgTradesPerDay = totalTrades / 10 // 10 trading days
  const isOvertrading = avgTradesPerDay > 5
  const isUndertrading = avgTradesPerDay < 1 && totalTrades > 0
  
  if (isOvertrading) {
    insights.push({
      category: 'weakness',
      title: 'Overtrading Detected',
      description: `You made ${totalTrades} trades (${avgTradesPerDay.toFixed(1)} per day). Overtrading can lead to higher transaction costs and emotional decision-making. Consider being more selective with your trades.`,
      severity: 'high'
    })
  } else if (isUndertrading) {
    insights.push({
      category: 'tip',
      title: 'Consider More Active Trading',
      description: `You made only ${totalTrades} trades. While patience is good, consider taking advantage of more opportunities when they arise.`,
      severity: 'low'
    })
  }
  
  // Analyze diversification
  const uniqueStocks = new Set(trades.map(t => t.ticker))
  const diversificationScore = (uniqueStocks.size / 10) * 100 // Out of 10 stocks
  
  if (diversificationScore < 30) {
    insights.push({
      category: 'weakness',
      title: 'Low Diversification',
      description: `You traded only ${uniqueStocks.size} different stocks. Diversification helps reduce risk. Consider spreading investments across more sectors.`,
      severity: 'high'
    })
  } else if (diversificationScore > 70) {
    insights.push({
      category: 'strength',
      title: 'Good Diversification',
      description: `You diversified across ${uniqueStocks.size} different stocks. This helps manage risk effectively.`,
      severity: 'low'
    })
  }
  
  // Analyze position concentration
  const buyTrades = trades.filter(t => t.type === 'buy')
  const tickerCounts = new Map<string, number>()
  buyTrades.forEach(t => {
    tickerCounts.set(t.ticker, (tickerCounts.get(t.ticker) || 0) + t.shares)
  })
  
  const maxPosition = Math.max(...Array.from(tickerCounts.values()))
  const totalShares = Array.from(tickerCounts.values()).reduce((a, b) => a + b, 0)
  const concentration = totalShares > 0 ? (maxPosition / totalShares) * 100 : 0
  
  if (concentration > 50) {
    insights.push({
      category: 'weakness',
      title: 'High Position Concentration',
      description: `Your largest position represents ${concentration.toFixed(0)}% of your portfolio. High concentration increases risk if that stock underperforms.`,
      severity: 'high'
    })
  }
  
  // Analyze cash management (simplified - would need actual cash balance)
  // For now, estimate based on trade activity
  const totalBuyValue = buyTrades.reduce((sum, t) => sum + (t.shares * t.price), 0)
  const estimatedCashUsed = Math.min(totalBuyValue, 10000) // Cap at starting balance
  const cashPercentage = ((10000 - estimatedCashUsed) / 10000) * 100
  
  if (cashPercentage > 80) {
    insights.push({
      category: 'tip',
      title: 'High Cash Position',
      description: `You held ${cashPercentage.toFixed(0)}% cash. While safe, you may have missed opportunities. Consider deploying more capital when confident.`,
      severity: 'low'
    })
  } else if (cashPercentage < 10) {
    insights.push({
      category: 'weakness',
      title: 'Low Cash Reserve',
      description: `You held very little cash (${cashPercentage.toFixed(0)}%). Maintaining cash reserves helps you take advantage of opportunities and manage risk.`,
      severity: 'medium'
    })
  }
  
  // Analyze timing (buying after news)
  let goodTimingCount = 0
  let badTimingCount = 0
  
  trades.forEach(trade => {
    if (trade.type === 'buy') {
      // Check if there was relevant news before this trade
      const relevantNews = newsHistory.filter(n => 
        n.scenario.affectedStocks.includes(trade.ticker) && 
        n.hour < trade.hour && 
        n.hour >= trade.hour - 3 // Within 3 hours
      )
      
      if (relevantNews.length > 0) {
        // Check if news was positive and price went up, or negative and price went down
        const latestNews = relevantNews[relevantNews.length - 1]
        // This is simplified - in reality we'd check price movement
        goodTimingCount++
      }
    }
  })
  
  // Analyze return performance
  if (finalReturn > 20) {
    insights.push({
      category: 'strength',
      title: 'Strong Performance',
      description: `You achieved a ${finalReturn.toFixed(1)}% return! Excellent work managing your portfolio through market volatility.`,
      severity: 'low'
    })
  } else if (finalReturn < -10) {
    insights.push({
      category: 'weakness',
      title: 'Negative Returns',
      description: `You finished with ${finalReturn.toFixed(1)}% return. Review your strategy - consider risk management and research before trades.`,
      severity: 'high'
    })
  }
  
  // Determine trading style
  let tradingStyle = 'Balanced Trader'
  if (isOvertrading && concentration > 40) {
    tradingStyle = 'Aggressive Momentum Trader'
  } else if (avgTradesPerDay < 2 && diversificationScore > 60) {
    tradingStyle = 'Conservative Diversified Investor'
  } else if (concentration > 60) {
    tradingStyle = 'Concentrated Position Trader'
  }
  
  // Determine risk level
  let riskLevel = 'Moderate'
  if (concentration > 50 || diversificationScore < 30) {
    riskLevel = 'High'
  } else if (diversificationScore > 70 && concentration < 30) {
    riskLevel = 'Low'
  }
  
  // Calculate scores
  const timingScore = totalTrades > 0 ? Math.min(100, (goodTimingCount / totalTrades) * 100) : 50
  
  return {
    insights,
    tradingStyle,
    riskLevel,
    diversificationScore,
    timingScore
  }
}

