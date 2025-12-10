'use client'

import { useState } from 'react'
import Link from 'next/link'
import PortfolioOverview from '@/components/dashboard/PortfolioOverview'
import StockList from '@/components/dashboard/StockList'
import NewsTab from '@/components/dashboard/NewsTab'
import ChartView from '@/components/dashboard/ChartView'
import { getStockByTicker } from '@/lib/mock-stocks'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'stocks' | 'news' | 'chart'>('stocks')
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  
  // Calculate portfolio value from positions
  const glcrStock = getStockByTicker('GLCR')
  const autoStock = getStockByTicker('AUTO')
  const cashBalance = 10000
  const positions = [
    { ticker: 'GLCR', shares: 10, currentPrice: glcrStock?.price || 178.20 },
    { ticker: 'AUTO', shares: 5, currentPrice: autoStock?.price || 112.00 },
  ]
  const portfolioValue = positions.reduce((sum, pos) => sum + (pos.shares * pos.currentPrice), 0) + cashBalance
  const startingValue = 10000
  const totalReturn = ((portfolioValue - startingValue) / startingValue) * 100

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Subtle animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#000000] via-[#0a0a0f] to-[#000000]"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,122,255,0.08),transparent_60%)] pointer-events-none"></div>
      
      {/* Header */}
      <div className="border-b border-[#38383a]/50 backdrop-blur-xl bg-black/50 relative z-10">
        <div className="container mx-auto px-8 py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-[#007aff] hover:text-[#0051d5] transition-all text-sm font-medium mb-2 inline-block hover:drop-shadow-[0_0_8px_rgba(0,122,255,0.5)]">
                ← Back
              </Link>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-[#98989d] bg-clip-text text-transparent">SnowTrade</h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#98989d] mb-1 font-light">Portfolio Value</div>
              <div className="text-3xl font-bold tracking-tight">
                ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-sm font-semibold mt-1 transition-all ${
                totalReturn >= 0 
                  ? 'text-[#30d158] drop-shadow-[0_0_8px_rgba(48,209,88,0.4)]' 
                  : 'text-[#ff453a] drop-shadow-[0_0_8px_rgba(255,69,58,0.4)]'
              }`}>
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-[#38383a]/50">
              <button
                onClick={() => setActiveTab('stocks')}
                className={`px-6 py-3 text-sm font-semibold transition-all relative ${
                  activeTab === 'stocks'
                    ? 'text-white'
                    : 'text-[#98989d] hover:text-white'
                }`}
              >
                Stocks
                {activeTab === 'stocks' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#007aff] to-transparent shadow-[0_0_8px_rgba(0,122,255,0.6)]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`px-6 py-3 text-sm font-semibold transition-all relative ${
                  activeTab === 'news'
                    ? 'text-white'
                    : 'text-[#98989d] hover:text-white'
                }`}
              >
                News
                {activeTab === 'news' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#007aff] to-transparent shadow-[0_0_8px_rgba(0,122,255,0.6)]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-6 py-3 text-sm font-semibold transition-all relative ${
                  activeTab === 'chart'
                    ? 'text-white'
                    : 'text-[#98989d] hover:text-white'
                }`}
              >
                Chart
                {activeTab === 'chart' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#007aff] to-transparent shadow-[0_0_8px_rgba(0,122,255,0.6)]"></div>
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'stocks' && (
                <StockList onSelectStock={setSelectedStock} selectedStock={selectedStock} />
              )}
              {activeTab === 'news' && <NewsTab />}
              {activeTab === 'chart' && <ChartView selectedStock={selectedStock} />}
            </div>
          </div>

          {/* Right Column - Portfolio & Trading */}
          <div className="space-y-6">
            <PortfolioOverview />
          </div>
        </div>
      </div>
    </div>
  )
}

