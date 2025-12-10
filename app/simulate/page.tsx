'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TradingSimulation, SimulationState } from '@/lib/simulation-engine'
import { mockStocks } from '@/lib/mock-stocks'
import { Scenario } from '@/lib/scenarios'
import StockCard from '@/components/simulate/StockCard'
import ScenarioCard from '@/components/simulate/ScenarioCard'
import PortfolioPanel from '@/components/simulate/PortfolioPanel'
import TradeModal from '@/components/simulate/TradeModal'
import SimulationNewsTab from '@/components/simulate/SimulationNewsTab'
import SimulationChartView from '@/components/simulate/SimulationChartView'
import NewsPopup from '@/components/simulate/NewsPopup'
import EndSimulationPopup from '@/components/simulate/EndSimulationPopup'
import StockDetailModal from '@/components/simulate/StockDetailModal'

export default function SimulatePage() {
  const [simulation, setSimulation] = useState<TradingSimulation | null>(null)
  const [state, setState] = useState<SimulationState | null>(null)
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [newScenarios, setNewScenarios] = useState<Scenario[]>([])
  const [popupScenarios, setPopupScenarios] = useState<Scenario[]>([]) // Scenarios shown in popup
  const [priceChanges, setPriceChanges] = useState<Map<string, { old: number; new: number; change: number }>>(new Map())
  const [hasStarted, setHasStarted] = useState(false)
  const [activeTab, setActiveTab] = useState<'stocks' | 'news' | 'chart' | 'watchlist'>('stocks')
  const [showNewsPopup, setShowNewsPopup] = useState(false)
  const [isEndOfDay, setIsEndOfDay] = useState(false)
  const [isMidDay, setIsMidDay] = useState(false)
  const [showStockDetail, setShowStockDetail] = useState(false)
  const [selectedStockDetail, setSelectedStockDetail] = useState<typeof mockStocks[0] | null>(null)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')

  const startSimulation = () => {
    const sim = new TradingSimulation(80, 10000, difficulty) // 80 hours = 10 trading days (8 hours per day)
    setSimulation(sim)
    setState(sim.getState())
    setHasStarted(true)
  }

  const handleWatchlistToggle = (ticker: string) => {
    if (!simulation) return
    simulation.toggleWatchlist(ticker)
    setState(simulation.getState())
  }

  const handleOptionTrade = (ticker: string, type: 'call' | 'put', contracts: number, strikePrice: number, expirationHours: number) => {
    if (!simulation) return
    const result = simulation.executeOptionTrade(ticker, type, contracts, strikePrice, expirationHours)
    if (result.success) {
      setState(simulation.getState())
      setShowTradeModal(false)
      setSelectedStock(null)
    } else {
      alert(result.error)
    }
  }

  const handleCloseOption = (ticker: string, optionIndex: number) => {
    if (!simulation) return
    const result = simulation.closeOptionPosition(ticker, optionIndex)
    if (result.success) {
      setState(simulation.getState())
      setShowTradeModal(false)
      setSelectedStock(null)
    } else {
      alert(result.error)
    }
  }

  const handleTrade = (ticker: string, type: 'buy' | 'sell', shares: number) => {
    if (!simulation) return

    const result = simulation.executeTrade(ticker, type, shares)
    if (result.success) {
      setState(simulation.getState())
      setShowTradeModal(false)
      setSelectedStock(null)
    } else {
      alert(result.error)
    }
  }

  const handleNextHour = () => {
    if (!simulation || simulation.isComplete()) return

    const { newScenarios: scenarios, priceChanges: changes, isEndOfTradingDay, isMidDay: isMidDayEvent } = simulation.advanceHour()
    setNewScenarios(scenarios)
    setPriceChanges(changes)
    setIsEndOfDay(isEndOfTradingDay)
    setIsMidDay(isMidDayEvent)
    setState(simulation.getState())

    // Show popup at mid-day or end of trading day if there are new scenarios
    if ((isEndOfTradingDay || isMidDayEvent) && scenarios.length > 0) {
      setPopupScenarios(scenarios) // Store scenarios for popup
      setShowNewsPopup(true)
      // Don't auto-clear scenarios when popup is shown - wait for user to close
    } else if (!showNewsPopup) {
      // Only clear scenarios for regular hours if popup is not showing
      setTimeout(() => {
        setNewScenarios([])
        setPriceChanges(new Map())
      }, 5000)
    }
  }

  // Start screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="container mx-auto px-8 max-w-3xl text-center">
          <h1 className="text-6xl font-bold mb-6 tracking-tight">Trading Simulation</h1>
          <p className="text-xl text-[#98989d] mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Experience a real-time trading simulation. React to market events, make trades, and see how your decisions impact your portfolio.
          </p>
          
          <div className="card p-8 mb-8 max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-white tracking-tight">Simulation Details</h2>
            <div className="space-y-4 text-left mb-6">
              <div className="flex items-start gap-4">
                <div className="text-2xl">💰</div>
                <div>
                  <div className="font-semibold text-white mb-1">Starting Balance</div>
                  <div className="text-[#98989d] font-light">$10,000</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">⏰</div>
                <div>
                  <div className="font-semibold text-white mb-1">Duration</div>
                  <div className="text-[#98989d] font-light">80 hours (10 trading days, 8 hours/day)</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">📊</div>
                <div>
                  <div className="font-semibold text-white mb-1">Stocks Available</div>
                  <div className="text-[#98989d] font-light">10 fictional stocks across different sectors</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">⚡</div>
                <div>
                  <div className="font-semibold text-white mb-1">Market Events</div>
                  <div className="text-[#98989d] font-light">Random events will occur that affect stock prices</div>
                </div>
              </div>
            </div>

            {/* Difficulty Slider */}
            <div className="border-t border-[#38383a]/50 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold text-white mb-1">Difficulty</div>
                  <div className="text-sm text-[#98989d] font-light">
                    {difficulty === 'easy' && 'More positive events, easier to profit'}
                    {difficulty === 'medium' && 'Balanced positive and negative events'}
                    {difficulty === 'hard' && 'More negative events, higher volatility'}
                  </div>
                </div>
                <div className="px-4 py-2 bg-[#2c2c2e] rounded-xl">
                  <span className="text-lg font-semibold text-white capitalize">{difficulty}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all ios-button ${
                        difficulty === level
                          ? level === 'easy' 
                            ? 'bg-[#30d158] text-white' 
                            : level === 'medium'
                            ? 'bg-[#ff9f0a] text-white'
                            : 'bg-[#ff453a] text-white'
                          : 'bg-[#2c2c2e] text-[#98989d] hover:bg-[#38383a]'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={startSimulation}
              className="button-primary py-4 px-12 text-lg font-semibold"
            >
              Start Simulation
            </button>
            <Link
              href="/"
              className="text-[#98989d] hover:text-white transition-colors text-sm font-light"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!simulation || !state) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-lg text-[#98989d] font-light">Loading simulation...</div>
      </div>
    )
  }

  const portfolioValue = simulation.getPortfolioValue()
  const returnPercent = ((portfolioValue - state.startingBalance) / state.startingBalance) * 100
  const tradingDay = Math.floor((state.currentHour - 1) / 8) + 1
  const hourInTradingDay = ((state.currentHour - 1) % 8) + 1
  const isEndOfTradingDay = state.currentHour % 8 === 0

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[#38383a]/50">
        <div className="container mx-auto px-8 py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-[#007aff] hover:text-[#0051d5] transition-colors text-sm font-medium mb-2 inline-block">
                ← Back
              </Link>
              <h1 className="text-4xl font-bold tracking-tight">Trading Simulation</h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#98989d] mb-1 font-light">
                Hour {state.currentHour} of {state.totalHours} • Trading Day {tradingDay}, {hourInTradingDay}:00
              </div>
              <div className="text-3xl font-bold tracking-tight">
                ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-sm font-semibold mt-1 ${returnPercent >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">

                {/* Tabs */}
                <div className="flex gap-2 border-b border-[#38383a]/50">
                  <button
                    onClick={() => setActiveTab('stocks')}
                    className={`px-6 py-3 text-sm font-semibold transition-colors relative ${
                      activeTab === 'stocks'
                        ? 'text-white'
                        : 'text-[#98989d] hover:text-white'
                    }`}
                  >
                    Stocks
                    {activeTab === 'stocks' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007aff]"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('watchlist')}
                    className={`px-6 py-3 text-sm font-semibold transition-colors relative ${
                      activeTab === 'watchlist'
                        ? 'text-white'
                        : 'text-[#98989d] hover:text-white'
                    }`}
                  >
                    Watchlist
                    {activeTab === 'watchlist' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007aff]"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('news')}
                    className={`px-6 py-3 text-sm font-semibold transition-colors relative ${
                      activeTab === 'news'
                        ? 'text-white'
                        : 'text-[#98989d] hover:text-white'
                    }`}
                  >
                    News
                    {activeTab === 'news' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007aff]"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('chart')}
                    className={`px-6 py-3 text-sm font-semibold transition-colors relative ${
                      activeTab === 'chart'
                        ? 'text-white'
                        : 'text-[#98989d] hover:text-white'
                    }`}
                  >
                    Chart
                    {activeTab === 'chart' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007aff]"></div>
                    )}
                  </button>
                </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'stocks' && (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white tracking-tight">Stocks</h2>

                  </div>
                  <div className="space-y-3">
                    {mockStocks.map(stock => {
                      const currentPrice = state.stockPrices.get(stock.ticker) || stock.price
                      const priceChange = priceChanges.get(stock.ticker)
                      const position = state.positions.get(stock.ticker)
                      
                      return (
                        <StockCard
                          key={stock.ticker}
                          stock={stock}
                          currentPrice={currentPrice}
                          priceChange={priceChange}
                          position={position}
                          isWatched={state.watchlist?.has(stock.ticker)}
                          onClick={() => {
                            setSelectedStock(stock.ticker)
                            setShowTradeModal(true)
                          }}
                          onInfoClick={() => {
                            setSelectedStockDetail(stock)
                            setShowStockDetail(true)
                          }}
                          onWatchlistToggle={() => handleWatchlistToggle(stock.ticker)}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'watchlist' && (
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white tracking-tight">Watchlist</h2>
                    {state.watchlist && state.watchlist.size > 0 && (
                      <div className="text-sm text-[#98989d] font-light">
                        {state.watchlist.size} {state.watchlist.size === 1 ? 'stock' : 'stocks'}
                      </div>
                    )}
                  </div>
                  {!state.watchlist || state.watchlist.size === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">⭐</div>
                      <div className="text-lg text-white font-semibold mb-2">Your watchlist is empty</div>
                      <div className="text-sm text-[#98989d] font-light">
                        Click the star icon on any stock to add it to your watchlist
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mockStocks
                        .filter(stock => state.watchlist?.has(stock.ticker))
                        .map(stock => {
                          const currentPrice = state.stockPrices.get(stock.ticker) || stock.price
                          const priceChange = priceChanges.get(stock.ticker)
                          const position = state.positions.get(stock.ticker)
                          
                          return (
                            <StockCard
                              key={stock.ticker}
                              stock={stock}
                              currentPrice={currentPrice}
                              priceChange={priceChange}
                              position={position}
                              isWatched={true}
                              onClick={() => {
                                setSelectedStock(stock.ticker)
                                setShowTradeModal(true)
                              }}
                              onInfoClick={() => {
                                setSelectedStockDetail(stock)
                                setShowStockDetail(true)
                              }}
                              onWatchlistToggle={() => handleWatchlistToggle(stock.ticker)}
                            />
                          )
                        })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'news' && (
                <div className="card p-6">
                  <h2 className="text-xl font-semibold mb-6 text-white tracking-tight">News Feed</h2>
                  <div className="mb-4 p-3 bg-[#2c2c2e] rounded-xl border border-[#38383a]/50">
                    <p className="text-sm text-[#98989d] font-light">
                      <span className="text-[#007aff] font-semibold">10 news items</span> appear each hour. Only some are real market events that affect prices. Can you spot them?
                    </p>
                  </div>
                  <SimulationNewsTab
                    newsItems={state.allNewsItems}
                    activeScenarios={state.activeScenarios}
                  />
                </div>
              )}

              {activeTab === 'chart' && (
                <div>
                  {!selectedStock && (
                    <div className="card p-6 mb-6">
                      <h2 className="text-xl font-semibold mb-4 text-white tracking-tight">Select a Stock</h2>
                      <div className="grid grid-cols-2 gap-3">
                        {mockStocks.map(stock => (
                          <button
                            key={stock.ticker}
                            onClick={() => setSelectedStock(stock.ticker)}
                            className="card p-4 hover:bg-[#1c1c1e]/80 transition-all text-left"
                          >
                            <div className="font-semibold text-white">{stock.ticker}</div>
                            <div className="text-sm text-[#98989d] font-light">{stock.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedStock && (
                    <div>
                      <div className="mb-4 flex items-center gap-4">
                        <button
                          onClick={() => setSelectedStock(null)}
                          className="text-[#007aff] hover:text-[#0051d5] transition-colors text-sm font-medium"
                        >
                          ← Select Different Stock
                        </button>
                      </div>
                      <SimulationChartView
                        selectedStock={selectedStock}
                        priceHistory={state.priceHistory}
                        currentPrices={state.stockPrices}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Portfolio & Controls */}
          <div className="space-y-6">
            <PortfolioPanel
              state={state}
              portfolioValue={portfolioValue}
              priceHistory={state.priceHistory}
            />

            <div className="card p-6">
              <button
                onClick={handleNextHour}
                disabled={simulation.isComplete()}
                className="w-full button-primary py-4 px-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {simulation.isComplete() ? 'Simulation Complete' : 'Next Hour →'}
              </button>
              {simulation.isComplete() && (
                <div className="mt-4 p-4 bg-[#30d158]/10 border border-[#30d158]/30 rounded-xl">
                  <div className="text-sm text-[#98989d] mb-2">Final Performance</div>
                  <div className="text-lg font-semibold text-white">
                    {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}% return
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

          {/* Trade Modal */}
          {showTradeModal && selectedStock && (
            <TradeModal
              ticker={selectedStock}
              currentPrice={state.stockPrices.get(selectedStock) || 0}
              position={state.positions.get(selectedStock)}
              optionPositions={state.optionPositions.get(selectedStock) || []}
              currentHour={state.currentHour}
              cashBalance={state.cashBalance}
              onTrade={handleTrade}
              onOptionTrade={handleOptionTrade}
              onCloseOption={handleCloseOption}
              onClose={() => {
                setShowTradeModal(false)
                setSelectedStock(null)
              }}
            />
          )}

      {/* News Popup - Mid-day crisis or end of trading day */}
      {showNewsPopup && popupScenarios.length > 0 && (
        <NewsPopup
          scenarios={popupScenarios}
          tradingDay={tradingDay}
          isMidDay={isMidDay}
          onClose={() => {
            setShowNewsPopup(false)
            setIsEndOfDay(false)
            setIsMidDay(false)
            // Clear popup scenarios and regular scenarios after popup is closed
            setPopupScenarios([])
            setNewScenarios([])
            setPriceChanges(new Map())
          }}
        />
      )}

      {/* End of Simulation Popup */}
      {simulation.isComplete() && (
        <EndSimulationPopup
          startingBalance={state.startingBalance}
          finalBalance={portfolioValue}
          portfolioHistory={state.portfolioHistory}
          tradeHistory={state.tradeHistory}
          newsHistory={state.newsHistory}
          onClose={() => {
            // Could navigate back to home or restart
          }}
        />
      )}

      {/* Stock Detail Modal */}
      {showStockDetail && selectedStockDetail && (
        <StockDetailModal
          stock={selectedStockDetail}
          onClose={() => {
            setShowStockDetail(false)
            setSelectedStockDetail(null)
          }}
        />
      )}

      {/* Disclaimer */}
      <div className="fixed bottom-3 right-3 z-40">
        <div className="bg-[#1c1c1e]/95 backdrop-blur-sm border border-[#38383a]/50 rounded-lg px-3 py-1.5 max-w-[280px]">
          <p className="text-[10px] text-[#98989d] font-light leading-tight">
            <span className="text-[#007aff]">⚠️ Educational Only</span> • Simulated environment for learning. Not financial advice.
          </p>
        </div>
      </div>
    </div>
  )
}
