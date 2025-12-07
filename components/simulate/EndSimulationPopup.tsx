'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import html2canvas from 'html2canvas'
import { TradeRecord, ScenarioWithHour } from '@/lib/simulation-engine'
import { analyzeTradingBehavior, TradingAnalysis } from '@/lib/trading-analysis'

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

  return (
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
              onClick={handleScreenshot}
              className="button-primary py-4 px-8 text-base font-semibold flex items-center gap-2"
            >
              📸 Take Screenshot
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
    </div>
  )
}

