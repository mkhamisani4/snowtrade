export interface Stock {
  id: string
  ticker: string
  name: string
  sector: string
  volatility: number
  storyline: string
  base_price: number
}

export interface Scenario {
  id: string
  name: string
  description: string
  duration_days: number
  starting_balance: number
  stock_ids: string[]
}

export interface PriceData {
  stock_id: string
  day: number
  price: number
}

export interface NewsItem {
  id: string
  scenario_id: string
  day: number
  headline: string
  content: string
  type: 'good' | 'bad' | 'rumor' | 'macro' | 'sector'
  affected_stocks: string[]
}

export interface Trade {
  id: string
  session_id: string
  stock_id: string
  type: 'buy' | 'sell' | 'short'
  shares: number
  price: number
  day: number
  created_at: string
}

export interface TradingSession {
  id: string
  user_id?: string
  scenario_id: string
  current_day: number
  cash_balance: number
  started_at: string
  completed_at?: string
  final_balance?: number
}

export interface PortfolioPosition {
  stock_id: string
  shares: number
  short_shares: number
  avg_buy_price: number
  avg_short_price: number
}

export interface PerformanceMetrics {
  final_balance: number
  total_return: number
  max_drawdown: number
  risk_score: number
  trades_count: number
  portfolio_concentration: number
}

