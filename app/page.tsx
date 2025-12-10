'use client'

import { useState } from 'react'
import Link from 'next/link'
import HowItWorksModal from '@/components/HowItWorksModal'

export default function Home() {
  const [showHowItWorks, setShowHowItWorks] = useState(false)

  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#0a0a0f] to-[#000000] opacity-100"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,122,255,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(48,209,88,0.05),transparent_50%)]"></div>
      {/* Subtle winter gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(135,206,250,0.03),transparent_70%)] pointer-events-none"></div>
      
      {/* Subtle snowflakes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 10 + 10}px`,
          }}
        >
          ❄
        </div>
      ))}
      
      <div className="container mx-auto px-8 py-8 max-w-5xl flex-1 flex flex-col justify-center relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#007aff]/20 border border-[#007aff]/40 mb-4 backdrop-blur-sm glow-blue winter-glow">
            <span className="text-xs font-semibold text-[#007aff]">Financial Trading Education</span>
          </div>
          <h1 className="text-6xl font-bold mb-3 tracking-tight bg-gradient-to-r from-white via-white to-[#98989d] bg-clip-text text-transparent">
            SnowTrade
          </h1>
          <p className="text-xl text-[#98989d] mb-2 font-light tracking-tight">
            Trading Education for Students & Early Career Professionals
          </p>
          <p className="text-base text-[#98989d] max-w-2xl mx-auto leading-relaxed font-light">
            Master trading through immersive scenarios. Perfect for students and early career professionals looking to build real-world trading skills in a risk-free environment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-2xl mb-3">🎓</div>
            <h2 className="text-lg font-semibold mb-2 text-white tracking-tight">
              Built for Students
            </h2>
            <p className="text-[#98989d] leading-relaxed text-sm font-light">
              Learn fundamentals without risking real money. Perfect for finance, business, and economics students building practical skills.
            </p>
          </div>

          <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-2xl mb-3">🚀</div>
            <h2 className="text-lg font-semibold mb-2 text-white tracking-tight">
              Early Career Ready
            </h2>
            <p className="text-[#98989d] leading-relaxed text-sm font-light">
              Gain hands-on experience that employers value. Practice trading scenarios that mirror real market conditions you'll face in your career.
            </p>
          </div>

          <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-2xl mb-3">🤖</div>
            <h2 className="text-lg font-semibold mb-2 text-white tracking-tight">
              AI-Powered Learning
            </h2>
            <p className="text-[#98989d] leading-relaxed text-sm font-light">
              Get personalized feedback on your trading decisions. Understand your risk profile and learn from AI-driven analysis tailored to your learning journey.
            </p>
          </div>

          <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-2xl mb-3">📊</div>
            <h2 className="text-lg font-semibold mb-2 text-white tracking-tight">
              Real Scenarios
            </h2>
            <p className="text-[#98989d] leading-relaxed text-sm font-light">
              Experience AI bubbles, interest rate shocks, earnings surprises, and meme stock volatility. Each scenario teaches real market dynamics.
            </p>
          </div>
        </div>

        <div className="text-center flex flex-col items-center gap-3">
          <div className="flex gap-3">
            <Link
              href="/simulate"
              className="inline-block button-primary py-3.5 px-10 text-base font-semibold"
            >
              Start Learning
            </Link>
            <button
              onClick={() => setShowHowItWorks(true)}
              className="inline-block button-primary py-3.5 px-10 text-base font-semibold"
            >
              How It Works
            </button>
          </div>
        </div>
      </div>

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
      />

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
