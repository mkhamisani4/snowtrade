import Link from 'next/link'

export default function Home() {
  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      <div className="container mx-auto px-8 py-8 max-w-5xl flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#007aff]/15 border border-[#007aff]/30 mb-4">
            <span className="text-xs font-semibold text-[#007aff]">Financial Trading Education</span>
          </div>
          <h1 className="text-6xl font-bold mb-3 tracking-tight">
            SnowTrade
          </h1>
          <p className="text-xl text-[#98989d] mb-2 font-light tracking-tight">
            Trading Education for Students & Early Career Professionals
          </p>
          <p className="text-base text-[#98989d] max-w-2xl mx-auto leading-relaxed font-light">
            Master trading through immersive scenarios. Perfect for students and early career professionals looking to build real-world trading skills in a risk-free environment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mb-6">
          <div className="card p-5 hover:bg-[#1c1c1e]/80 transition-all duration-300">
            <h2 className="text-lg font-semibold mb-2 text-white tracking-tight">
              Built for Students
            </h2>
            <p className="text-[#98989d] leading-relaxed text-sm font-light">
              Learn fundamentals without risking real money. Perfect for finance, business, and economics students building practical skills.
            </p>
          </div>

          <div className="card p-5 hover:bg-[#1c1c1e]/80 transition-all duration-300">
            <h2 className="text-lg font-semibold mb-2 text-white tracking-tight">
              Early Career Ready
            </h2>
            <p className="text-[#98989d] leading-relaxed text-sm font-light">
              Gain hands-on experience that employers value. Practice trading scenarios that mirror real market conditions you'll face in your career.
            </p>
          </div>

          <div className="card p-5 hover:bg-[#1c1c1e]/80 transition-all duration-300">
            <h2 className="text-lg font-semibold mb-2 text-white tracking-tight">
              AI-Powered Learning
            </h2>
            <p className="text-[#98989d] leading-relaxed text-sm font-light">
              Get personalized feedback on your trading decisions. Understand your risk profile and learn from AI-driven analysis tailored to your learning journey.
            </p>
          </div>

          <div className="card p-5 hover:bg-[#1c1c1e]/80 transition-all duration-300">
            <h2 className="text-lg font-semibold mb-2 text-white tracking-tight">
              Real Scenarios
            </h2>
            <p className="text-[#98989d] leading-relaxed text-sm font-light">
              Experience AI bubbles, interest rate shocks, earnings surprises, and meme stock volatility. Each scenario teaches real market dynamics.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/scenarios"
            className="inline-block button-primary py-3.5 px-10 text-base font-semibold"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </div>
  )
}
