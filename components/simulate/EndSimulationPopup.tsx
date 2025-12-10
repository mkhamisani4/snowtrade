'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import html2canvas from 'html2canvas'
import { TradeRecord, ScenarioWithHour } from '@/lib/simulation-engine'
import { analyzeTradingBehavior, TradingAnalysis } from '@/lib/trading-analysis'
import { mockStocks, getStockByTicker } from '@/lib/mock-stocks'

interface EndSimulationPopupProps {
  startingBalance: number
  finalBalance: number
  portfolioHistory: number[]
  tradeHistory: TradeRecord[]
  newsHistory: ScenarioWithHour[]
  onClose: () => void
}

export default function EndSimulationPopup({ startingBalance, finalBalance, portfolioHistory, tradeHistory, newsHistory, onClose }: EndSimulationPopupProps) {
  const screenshotRef = useRef<HTMLDivElement>(null)
  const shareRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'performance' | 'learnings'>('performance')

  const totalReturn = finalBalance - startingBalance
  const returnPercent = ((finalBalance - startingBalance) / startingBalance) * 100
  const maxValue = Math.max(...portfolioHistory)
  const minValue = Math.min(...portfolioHistory)
  const maxDrawdown = maxValue > 0 ? ((maxValue - minValue) / maxValue) * 100 : 0
  
  const analysis = analyzeTradingBehavior(tradeHistory, portfolioHistory, newsHistory, returnPercent)

  const chartData = portfolioHistory.map((value, index) => ({
    hour: index + 1,
    value: parseFloat(value.toFixed(2)),
  }))

  const handleScreenshot = async () => {
    if (!screenshotRef.current) return

    try {
      const canvas = await html2canvas(screenshotRef.current, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `snowtrade-performance-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Error taking screenshot:', error)
      alert('Failed to take screenshot. Please try again.')
    }
  }

  const handleShare = async () => {
    if (!shareRef.current) return

    try {
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#000000',
        scale: 3, // Higher scale for better quality
        logging: false,
        useCORS: true,
      })

      // Try to use Web Share API if available, otherwise download
      const dataUrl = canvas.toDataURL('image/png')
      
      if (navigator.share) {
        // Convert data URL to blob
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], `snowtrade-share-${Date.now()}.png`, { type: 'image/png' })
        
        try {
          await navigator.share({
            title: 'My SnowTrade Simulation Results',
            text: `Check out my trading simulation results! ${returnPercent >= 0 ? '+' : ''}${returnPercent.toFixed(2)}% return`,
            files: [file]
          })
          return
        } catch (shareError) {
          // Fall through to download if share fails
        }
      }

      // Fallback to download
      const link = document.createElement('a')
      link.download = `snowtrade-share-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error generating share image:', error)
      alert('Failed to generate share image. Please try again.')
    }
  }

  // Get unique stocks traded
  const stocksTraded = Array.from(new Set(tradeHistory.map(t => t.ticker)))
  const buyTrades = tradeHistory.filter(t => t.type === 'buy')
  const stockPositions = new Map<string, number>()
  buyTrades.forEach(t => {
    stockPositions.set(t.ticker, (stockPositions.get(t.ticker) || 0) + t.shares)
  })

  // Get unique scenarios faced
  const scenariosFaced = Array.from(new Set(newsHistory.map(n => n.scenario.id))).length
  const positiveScenarios = newsHistory.filter(n => n.scenario.sentiment === 'positive').length
  const negativeScenarios = newsHistory.filter(n => n.scenario.sentiment === 'negative').length
  const extremeScenarios = newsHistory.filter(n => n.scenario.impact === 'extreme').length

  // Calculate best and worst performing trades
  const tradePerformance = new Map<string, { totalShares: number; avgPrice: number; currentValue: number }>()
  buyTrades.forEach(t => {
    const existing = tradePerformance.get(t.ticker) || { totalShares: 0, avgPrice: 0, currentValue: 0 }
    const totalCost = existing.totalShares * existing.avgPrice + t.shares * t.price
    existing.totalShares += t.shares
    existing.avgPrice = totalCost / existing.totalShares
    tradePerformance.set(t.ticker, existing)
  })

  const totalTrades = tradeHistory.length
  const totalHours = portfolioHistory.length

  return (
    <>
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div ref={screenshotRef} className="card max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-[#1c1c1e]">
          <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold tracking-tight text-white mb-4">Simulation Complete</h1>
            <p className="text-xl text-[#98989d] font-light">Your Trading Performance & Learnings</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-[#38383a]/50 mb-6">
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-6 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'performance'
                  ? 'text-white'
                  : 'text-[#98989d] hover:text-white'
              }`}
            >
              Performance
              {activeTab === 'performance' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007aff]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('learnings')}
              className={`px-6 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'learnings'
                  ? 'text-white'
                  : 'text-[#98989d] hover:text-white'
              }`}
            >
              Learnings & Insights
              {activeTab === 'learnings' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007aff]"></div>
              )}
            </button>
          </div>

          {activeTab === 'performance' && (
            <>
              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="card-elevated p-6">
              <div className="text-sm text-[#98989d] font-light mb-2">Starting Balance</div>
              <div className="text-3xl font-bold text-white">${startingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="card-elevated p-6">
              <div className="text-sm text-[#98989d] font-light mb-2">Final Balance</div>
              <div className="text-3xl font-bold text-white">${finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="card-elevated p-6">
              <div className="text-sm text-[#98989d] font-light mb-2">Total Return</div>
              <div className={`text-3xl font-bold ${totalReturn >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                {totalReturn >= 0 ? '+' : ''}${totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="card-elevated p-6">
              <div className="text-sm text-[#98989d] font-light mb-2">Return %</div>
              <div className={`text-3xl font-bold ${returnPercent >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Portfolio Chart */}
          <div className="card-elevated p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-white tracking-tight">Portfolio Value Over Time</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={returnPercent >= 0 ? '#30d158' : '#ff453a'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={returnPercent >= 0 ? '#30d158' : '#ff453a'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#38383a" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#98989d" 
                    tick={{ fill: '#98989d', fontSize: 11 }}
                    label={{ value: 'Hour', position: 'insideBottom', offset: -5, fill: '#98989d' }}
                  />
                  <YAxis 
                    stroke="#98989d" 
                    tick={{ fill: '#98989d', fontSize: 11 }}
                    tickFormatter={(value) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    label={{ value: 'Portfolio Value ($)', angle: -90, position: 'insideLeft', fill: '#98989d' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1c1e',
                      border: '0.5px solid #38383a',
                      borderRadius: '12px',
                      color: '#ffffff',
                      padding: '8px 12px'
                    }}
                    formatter={(value: any) => `$${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    labelFormatter={(label) => `Hour ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={returnPercent >= 0 ? '#30d158' : '#ff453a'}
                    strokeWidth={3}
                    fill="url(#performanceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card-elevated p-4">
              <div className="text-xs text-[#98989d] font-light mb-1">Peak Value</div>
              <div className="text-xl font-semibold text-white">${maxValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="card-elevated p-4">
              <div className="text-xs text-[#98989d] font-light mb-1">Lowest Value</div>
              <div className="text-xl font-semibold text-white">${minValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="card-elevated p-4">
              <div className="text-xs text-[#98989d] font-light mb-1">Max Drawdown</div>
              <div className="text-xl font-semibold text-[#ff453a]">{maxDrawdown.toFixed(2)}%</div>
            </div>
          </div>
            </>
          )}

          {activeTab === 'learnings' && (
            <div className="space-y-6">
              {/* Trading Style & Risk */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="card-elevated p-6">
                  <div className="text-sm text-[#98989d] font-light mb-2">Your Trading Style</div>
                  <div className="text-2xl font-bold text-white">{analysis.tradingStyle}</div>
                </div>
                <div className="card-elevated p-6">
                  <div className="text-sm text-[#98989d] font-light mb-2">Risk Level</div>
                  <div className={`text-2xl font-bold ${
                    analysis.riskLevel === 'High' ? 'text-[#ff453a]' : 
                    analysis.riskLevel === 'Low' ? 'text-[#30d158]' : 
                    'text-[#ff9f0a]'
                  }`}>
                    {analysis.riskLevel}
                  </div>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="card-elevated p-6">
                  <div className="text-sm text-[#98989d] font-light mb-2">Diversification Score</div>
                  <div className="text-3xl font-bold text-white">{analysis.diversificationScore.toFixed(0)}%</div>
                  <div className="text-xs text-[#98989d] font-light mt-1">
                    {analysis.diversificationScore > 70 ? 'Excellent' : 
                     analysis.diversificationScore > 50 ? 'Good' : 
                     analysis.diversificationScore > 30 ? 'Fair' : 'Needs Improvement'}
                  </div>
                </div>
                <div className="card-elevated p-6">
                  <div className="text-sm text-[#98989d] font-light mb-2">Timing Score</div>
                  <div className="text-3xl font-bold text-white">{analysis.timingScore.toFixed(0)}%</div>
                  <div className="text-xs text-[#98989d] font-light mt-1">
                    {analysis.timingScore > 70 ? 'Excellent' : 
                     analysis.timingScore > 50 ? 'Good' : 
                     'Needs Improvement'}
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-white tracking-tight">Key Insights</h3>
                <div className="space-y-3">
                  {analysis.insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`card-elevated p-5 border-l-4 ${
                        insight.category === 'strength' ? 'border-l-[#30d158]' :
                        insight.category === 'weakness' ? 'border-l-[#ff453a]' :
                        'border-l-[#007aff]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">
                          {insight.category === 'strength' ? '✅' :
                           insight.category === 'weakness' ? '⚠️' :
                           '💡'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                          <p className="text-sm text-[#98989d] font-light leading-relaxed">{insight.description}</p>
                        </div>
                        {insight.severity && (
                          <div className={`px-2 py-1 rounded text-xs font-semibold ${
                            insight.severity === 'high' ? 'bg-[#ff453a]/20 text-[#ff453a]' :
                            insight.severity === 'medium' ? 'bg-[#ff9f0a]/20 text-[#ff9f0a]' :
                            'bg-[#30d158]/20 text-[#30d158]'
                          }`}>
                            {insight.severity.toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips Section */}
              <div className="card-elevated p-6 bg-[#007aff]/10 border border-[#007aff]/30">
                <h3 className="text-xl font-semibold mb-3 text-white">📚 Key Learnings</h3>
                <ul className="space-y-2 text-sm text-[#98989d] font-light">
                  <li>• Research companies before trading - use the Info button to understand what each company does</li>
                  <li>• Diversification reduces risk - don't put all your money in one stock</li>
                  <li>• Not all news affects all stocks - analyze which companies are truly impacted</li>
                  <li>• Maintain cash reserves for opportunities and risk management</li>
                  <li>• Market volatility is normal - stay calm and stick to your strategy</li>
                </ul>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={handleShare}
              className="button-primary py-4 px-8 text-base font-semibold flex items-center gap-2"
            >
              📤 Share Results
            </button>
            <button
              onClick={handleScreenshot}
              className="px-8 py-4 bg-[#2c2c2e] hover:bg-[#38383a] text-white rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              📸 Screenshot
            </button>
            <button
              onClick={() => {
                router.push('/')
              }}
              className="px-8 py-4 bg-[#2c2c2e] hover:bg-[#38383a] text-white rounded-xl font-semibold transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Shareable Image - Hidden but rendered for capture */}
      <div ref={shareRef} className="fixed -left-[9999px] top-0 w-[1200px] bg-black text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div className="p-12 bg-gradient-to-br from-[#000000] via-[#1c1c1e] to-[#000000]">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-6xl font-bold mb-3 tracking-tight">SnowTrade</div>
            <div className="text-2xl text-[#98989d] font-light">Trading Simulation Results</div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            <div className="bg-[#1c1c1e] border border-[#38383a]/50 rounded-2xl p-6">
              <div className="text-sm text-[#98989d] mb-2 font-light">Starting Balance</div>
              <div className="text-3xl font-bold">${startingBalance.toLocaleString()}</div>
            </div>
            <div className="bg-[#1c1c1e] border border-[#38383a]/50 rounded-2xl p-6">
              <div className="text-sm text-[#98989d] mb-2 font-light">Final Balance</div>
              <div className="text-3xl font-bold">${finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-[#1c1c1e] border border-[#38383a]/50 rounded-2xl p-6">
              <div className="text-sm text-[#98989d] mb-2 font-light">Total Return</div>
              <div className={`text-3xl font-bold ${totalReturn >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                {totalReturn >= 0 ? '+' : ''}${totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-[#1c1c1e] border border-[#38383a]/50 rounded-2xl p-6">
              <div className="text-sm text-[#98989d] mb-2 font-light">Return %</div>
              <div className={`text-3xl font-bold ${returnPercent >= 0 ? 'text-[#30d158]' : 'text-[#ff453a]'}`}>
                {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-[#1c1c1e] border border-[#38383a]/50 rounded-2xl p-8 mb-10">
            <h2 className="text-3xl font-bold mb-6">Portfolio Performance</h2>
            <div style={{ width: '100%', height: '256px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="shareGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={returnPercent >= 0 ? '#30d158' : '#ff453a'} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={returnPercent >= 0 ? '#30d158' : '#ff453a'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#38383a" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#98989d" 
                    tick={{ fill: '#98989d', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#98989d" 
                    tick={{ fill: '#98989d', fontSize: 12 }}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={returnPercent >= 0 ? '#30d158' : '#ff453a'}
                    strokeWidth={3}
                    fill="url(#shareGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Stats Grid */}
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-[#1c1c1e] border border-[#38383a]/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4">Trading Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#98989d]">Total Trades</span>
                    <span className="font-semibold">{totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#98989d]">Stocks Traded</span>
                    <span className="font-semibold">{stocksTraded.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#98989d]">Trading Hours</span>
                    <span className="font-semibold">{totalHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#98989d]">Trading Style</span>
                    <span className="font-semibold">{analysis.tradingStyle}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1c1c1e] border border-[#38383a]/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4">Stocks Invested In</h3>
                <div className="space-y-2">
                  {stocksTraded.slice(0, 5).map(ticker => {
                    const shares = stockPositions.get(ticker) || 0
                    const stock = getStockByTicker(ticker)
                    return (
                      <div key={ticker} className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold">{ticker}</span>
                          {stock && <span className="text-[#98989d] text-sm ml-2">({stock.name})</span>}
                        </div>
                        <span className="text-[#98989d]">{shares} shares</span>
                      </div>
                    )
                  })}
                  {stocksTraded.length > 5 && (
                    <div className="text-[#98989d] text-sm">+{stocksTraded.length - 5} more</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-[#1c1c1e] border border-[#38383a]/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4">Market Events Faced</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#98989d]">Total Scenarios</span>
                    <span className="font-semibold">{scenariosFaced}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#30d158]">Positive Events</span>
                    <span className="font-semibold">{positiveScenarios}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#ff453a]">Negative Events</span>
                    <span className="font-semibold">{negativeScenarios}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#ff9f0a]">Extreme Events</span>
                    <span className="font-semibold">{extremeScenarios}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1c1c1e] border border-[#38383a]/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4">Performance Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#98989d]">Peak Value</span>
                    <span className="font-semibold">${maxValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#98989d]">Max Drawdown</span>
                    <span className="text-[#ff453a] font-semibold">{maxDrawdown.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#98989d]">Risk Level</span>
                    <span className={`font-semibold ${
                      analysis.riskLevel === 'High' ? 'text-[#ff453a]' : 
                      analysis.riskLevel === 'Low' ? 'text-[#30d158]' : 
                      'text-[#ff9f0a]'
                    }`}>
                      {analysis.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#98989d]">Diversification</span>
                    <span className="font-semibold">{analysis.diversificationScore.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-10 pt-6 border-t border-[#38383a]/50">
            <div className="text-sm text-[#98989d]">snowtrade.app • Educational Trading Simulation</div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

