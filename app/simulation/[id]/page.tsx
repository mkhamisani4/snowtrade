'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Stock, Scenario, PriceData, NewsItem, Trade, TradingSession, PortfolioPosition } from '@/lib/types'
import { processTrade, calculatePortfolioValue, calculateMaxDrawdown, calculatePortfolioConcentration } from '@/lib/scenario-engine'
import { generateTradingFeedback } from '@/lib/ai-service'
import TradingInterface from '@/components/TradingInterface'
import PortfolioView from '@/components/PortfolioView'
import NewsFeed from '@/components/NewsFeed'
import PriceChart from '@/components/PriceChart'
import FeedbackModal from '@/components/FeedbackModal'

export default function SimulationPage() {
  const params = useParams()
  const router = useRouter()
  const scenarioId = params.id as string

  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [stocks, setStocks] = useState<Stock[]>([])
  const [currentDay, setCurrentDay] = useState(1)
  const [session, setSession] = useState<TradingSession | null>(null)
  const [priceData, setPriceData] = useState<Map<string, number[]>>(new Map())
  const [currentPrices, setCurrentPrices] = useState<Map<string, number>>(new Map())
  const [news, setNews] = useState<NewsItem[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [positions, setPositions] = useState<Map<string, PortfolioPosition>>(new Map())
  const [cashBalance, setCashBalance] = useState(10000)
  const [portfolioHistory, setPortfolioHistory] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [aiFeedback, setAiFeedback] = useState('')

  useEffect(() => {
    if (scenarioId) {
      initializeSimulation()
    }
  }, [scenarioId])

  async function initializeSimulation() {
    try {
      // Load scenario
      const { data: scenarioData, error: scenarioError } = await supabase
        .from('scenarios')
        .select('*')
        .eq('id', scenarioId)
        .single()

      if (scenarioError) throw scenarioError
      if (!scenarioData) throw new Error('Scenario not found')

      setScenario(scenarioData)
      setCashBalance(scenarioData.starting_balance)

      // Load stocks
      const { data: stocksData, error: stocksError } = await supabase
        .from('stocks')
        .select('*')
        .in('id', scenarioData.stock_ids)

      if (stocksError) throw stocksError
      setStocks(stocksData || [])

      // Create or load session
      let sessionData: TradingSession | null = null
      const { data: existingSession } = await supabase
        .from('trading_sessions')
        .select('*')
        .eq('scenario_id', scenarioId)
        .is('completed_at', null)
        .order('started_at', { ascending: false })
        .limit(1)
        .single()

      if (existingSession) {
        sessionData = existingSession
        setCurrentDay(existingSession.current_day)
        setCashBalance(existingSession.cash_balance)
      } else {
        const { data: newSession, error: sessionError } = await supabase
          .from('trading_sessions')
          .insert({
            scenario_id: scenarioId,
            current_day: 1,
            cash_balance: scenarioData.starting_balance,
          })
          .select()
          .single()

        if (sessionError) throw sessionError
        sessionData = newSession
      }

      setSession(sessionData)

      // Load or generate price data
      await loadPriceData(scenarioId, stocksData || [])

      // Load news for current day
      await loadNews(scenarioId, 1)

      // Load existing trades and positions
      if (sessionData) {
        await loadTradesAndPositions(sessionData.id)
      }

      // Initialize portfolio history
      const initialValue = calculatePortfolioValue(new Map(), currentPrices, cashBalance)
      setPortfolioHistory([initialValue])
    } catch (error) {
      console.error('Error initializing simulation:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadPriceData(scenarioId: string, stocks: Stock[]) {
    const { data, error } = await supabase
      .from('price_data')
      .select('*')
      .eq('scenario_id', scenarioId)
      .order('day')

    if (error) {
      console.error('Error loading price data:', error)
      // Generate price data if not exists
      await generatePriceData(scenarioId, stocks)
      return
    }

    const priceMap = new Map<string, number[]>()
    const currentPriceMap = new Map<string, number>()

    stocks.forEach(stock => {
      const stockPrices = data
        ?.filter(p => p.stock_id === stock.id)
        .sort((a, b) => a.day - b.day)
        .map(p => parseFloat(p.price.toString())) || []

      if (stockPrices.length > 0) {
        priceMap.set(stock.id, stockPrices)
        currentPriceMap.set(stock.id, stockPrices[0] || stock.base_price)
      } else {
        // Fallback to base price
        priceMap.set(stock.id, [stock.base_price])
        currentPriceMap.set(stock.id, stock.base_price)
      }
    })

    setPriceData(priceMap)
    setCurrentPrices(currentPriceMap)
  }

  async function generatePriceData(scenarioId: string, stocks: Stock[]) {
    // This would ideally be done server-side, but for MVP we'll generate client-side
    // In production, you'd want an API route or background job
    const { data: scenarioData } = await supabase
      .from('scenarios')
      .select('duration_days')
      .eq('id', scenarioId)
      .single()

    if (!scenarioData) return

    const pricesToInsert: any[] = []

    stocks.forEach(stock => {
      const prices = generatePricePath(
        stock.base_price,
        stock.volatility,
        scenarioData.duration_days
      )

      prices.forEach((price, day) => {
        pricesToInsert.push({
          scenario_id: scenarioId,
          stock_id: stock.id,
          day: day + 1,
          price: price.toFixed(2),
        })
      })
    })

    await supabase.from('price_data').insert(pricesToInsert)
    await loadPriceData(scenarioId, stocks)
  }

  function generatePricePath(basePrice: number, volatility: number, days: number): number[] {
    const prices: number[] = [basePrice]
    for (let day = 1; day < days; day++) {
      const randomChange = (Math.random() - 0.5) * volatility * 2
      const drift = -0.001
      const newPrice = prices[day - 1] * (1 + randomChange + drift)
      prices.push(Math.max(0.01, newPrice))
    }
    return prices
  }

  async function loadNews(scenarioId: string, day: number) {
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .eq('scenario_id', scenarioId)
      .eq('day', day)
      .order('created_at')

    if (error) {
      console.error('Error loading news:', error)
      return
    }

    setNews(data || [])
  }

  async function loadTradesAndPositions(sessionId: string) {
    const { data: tradesData, error } = await supabase
      .from('trades')
      .select('*')
      .eq('session_id', sessionId)
      .order('day, created_at')

    if (error) {
      console.error('Error loading trades:', error)
      return
    }

    setTrades(tradesData || [])

    // Reconstruct positions from trades
    const positionsMap = new Map<string, PortfolioPosition>()
    const currentPricesMap = new Map(currentPrices)

    tradesData?.forEach(trade => {
      const position = positionsMap.get(trade.stock_id) || {
        stock_id: trade.stock_id,
        shares: 0,
        short_shares: 0,
        avg_buy_price: 0,
        avg_short_price: 0,
      }

      const price = parseFloat(trade.price.toString())
      const shares = trade.shares

      switch (trade.type) {
        case 'buy':
          const totalShares = position.shares + shares
          const totalCost = position.shares * position.avg_buy_price + shares * price
          position.shares = totalShares
          position.avg_buy_price = totalShares > 0 ? totalCost / totalShares : 0
          break
        case 'sell':
          position.shares -= shares
          break
        case 'short':
          const totalShortShares = position.short_shares + shares
          const totalShortCost = position.short_shares * position.avg_short_price + shares * price
          position.short_shares = totalShortShares
          position.avg_short_price = totalShortShares > 0 ? totalShortCost / totalShortShares : 0
          break
        case 'cover':
          position.short_shares -= shares
          break
      }

      positionsMap.set(trade.stock_id, position)
    })

    setPositions(positionsMap)
  }

  async function executeTrade(
    stockId: string,
    type: 'buy' | 'sell' | 'short' | 'cover',
    shares: number
  ) {
    if (!session) return

    const currentPrice = currentPrices.get(stockId)
    if (!currentPrice) return

    const trade: Trade = {
      id: '',
      session_id: session.id,
      stock_id: stockId,
      type,
      shares,
      price: currentPrice,
      day: currentDay,
      created_at: new Date().toISOString(),
    }

    const result = processTrade(trade, positions, cashBalance, currentPrice)
    if (result.error) {
      alert(result.error)
      return
    }

    // Save trade to database
    const { data: savedTrade, error } = await supabase
      .from('trades')
      .insert({
        session_id: session.id,
        stock_id: stockId,
        type,
        shares,
        price: currentPrice,
        day: currentDay,
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving trade:', error)
      alert('Failed to save trade')
      return
    }

    setTrades([...trades, savedTrade])
    setPositions(result.newPositions)
    setCashBalance(result.newCashBalance)

    // Update portfolio history
    const newValue = calculatePortfolioValue(result.newPositions, currentPrices, result.newCashBalance)
    setPortfolioHistory([...portfolioHistory, newValue])
  }

  async function nextDay() {
    if (!session || !scenario) return

    const newDay = currentDay + 1

    if (newDay > scenario.duration_days) {
      await completeScenario()
      return
    }

    // Update prices
    const newPrices = new Map<string, number>()
    priceData.forEach((prices, stockId) => {
      const dayPrice = prices[newDay - 1]
      if (dayPrice !== undefined) {
        newPrices.set(stockId, dayPrice)
      }
    })
    setCurrentPrices(newPrices)
    setCurrentDay(newDay)

    // Load news for new day
    await loadNews(scenario.id, newDay)

    // Update session
    await supabase
      .from('trading_sessions')
      .update({ current_day: newDay })
      .eq('id', session.id)

    // Update portfolio history
    const newValue = calculatePortfolioValue(positions, newPrices, cashBalance)
    setPortfolioHistory([...portfolioHistory, newValue])
  }

  async function completeScenario() {
    if (!session || !scenario) return

    const finalValue = calculatePortfolioValue(positions, currentPrices, cashBalance)
    const maxDrawdown = calculateMaxDrawdown(portfolioHistory)
    const concentration = calculatePortfolioConcentration(positions, currentPrices, finalValue)
    const totalReturn = (finalValue - scenario.starting_balance) / scenario.starting_balance

    const metrics = {
      final_balance: finalValue,
      total_return: totalReturn,
      max_drawdown: maxDrawdown,
      risk_score: maxDrawdown + (1 - concentration) * 0.1,
      trades_count: trades.length,
      portfolio_concentration: concentration,
    }

    // Generate AI feedback
    const feedback = await generateTradingFeedback(trades, stocks, metrics, scenario.name)
    setAiFeedback(feedback)

    // Update session
    await supabase
      .from('trading_sessions')
      .update({
        completed_at: new Date().toISOString(),
        final_balance: finalValue,
        ai_feedback: feedback,
      })
      .eq('id', session.id)

    setShowFeedback(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-lg text-[#98989d] font-light">Loading simulation...</div>
      </div>
    )
  }

  if (!scenario || !session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-lg text-white font-light">Scenario not found</div>
      </div>
    )
  }

  const portfolioValue = calculatePortfolioValue(positions, currentPrices, cashBalance)
  const returnPercent = ((portfolioValue - scenario.starting_balance) / scenario.starting_balance) * 100

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-8 py-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">{scenario.name}</h1>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[#98989d] text-lg font-light">Day {currentDay} of {scenario.duration_days}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold mb-2 tracking-tight">
                ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-xl font-semibold mb-1 ${returnPercent >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%
              </div>
              <div className="text-sm text-[#98989d] font-light">
                Cash: ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-8">
              <h2 className="text-2xl font-semibold mb-8 text-white tracking-tight">Stocks</h2>
              <div className="space-y-8">
                {stocks.map(stock => (
                  <div key={stock.id} className="pb-8 border-b border-[#38383a]/50 last:border-0 last:pb-0">
                    <PriceChart
                      stock={stock}
                      prices={priceData.get(stock.id) || []}
                      currentDay={currentDay}
                      currentPrice={currentPrices.get(stock.id) || stock.base_price}
                    />
                    <TradingInterface
                      stock={stock}
                      currentPrice={currentPrices.get(stock.id) || stock.base_price}
                      position={positions.get(stock.id)}
                      cashBalance={cashBalance}
                      onTrade={executeTrade}
                    />
                  </div>
                ))}
              </div>
            </div>

            <NewsFeed news={news} stocks={stocks} />
          </div>

          <div className="space-y-6">
            <PortfolioView
              positions={positions}
              stocks={stocks}
              currentPrices={currentPrices}
              cashBalance={cashBalance}
              portfolioValue={portfolioValue}
              portfolioHistory={portfolioHistory}
            />

            <div className="card p-6">
              <button
                onClick={nextDay}
                disabled={currentDay >= scenario.duration_days}
                className="w-full button-primary py-5 px-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentDay >= scenario.duration_days ? 'Complete Scenario' : 'Next Day →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => {
          setShowFeedback(false)
          router.push('/scenarios')
        }}
        feedback={aiFeedback}
        metrics={{
          final_balance: portfolioValue,
          total_return: (portfolioValue - scenario.starting_balance) / scenario.starting_balance,
          max_drawdown: calculateMaxDrawdown(portfolioHistory),
          risk_score: 0,
          trades_count: trades.length,
          portfolio_concentration: calculatePortfolioConcentration(positions, currentPrices, portfolioValue),
        }}
        startingBalance={scenario.starting_balance}
      />
    </div>
  )
}

