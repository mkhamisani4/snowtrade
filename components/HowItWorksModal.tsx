'use client'

import { useState } from 'react'

interface HowItWorksModalProps {
  isOpen: boolean
  onClose: () => void
}

const slides = [
  {
    title: 'Welcome to SnowTrade',
    content: 'A risk-free trading simulator designed for students and early career professionals. Learn real trading skills without risking real money.',
    icon: '🎓'
  },
  {
    title: 'How It Works',
    content: 'You start with $10,000 in virtual cash. Over 80 hours (10 trading days), you\'ll react to market events, news, and scenarios by buying and selling stocks.',
    icon: '💰'
  },
  {
    title: 'Market Events & News',
    content: 'Each hour, you\'ll see 10 news items. Some are real market events that affect stock prices, others are just noise. Research companies to identify which news matters.',
    icon: '📰'
  },
  {
    title: 'Make Trading Decisions',
    content: 'Click on any stock to buy or sell shares. Use the Info button to research companies - understand their industry, products, and business model to make informed decisions.',
    icon: '📊'
  },
  {
    title: 'Track Your Performance',
    content: 'Watch your portfolio value change in real-time. See how your decisions impact your returns. At the end, get detailed feedback on your trading style and learnings.',
    icon: '📈'
  },
  {
    title: 'Learn & Improve',
    content: 'After each simulation, receive personalized insights about your trading behavior, risk management, and decision-making. Practice makes perfect!',
    icon: '✨'
  }
]

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  if (!isOpen) return null

  const slide = slides[currentSlide]
  const isFirst = currentSlide === 0
  const isLast = currentSlide === slides.length - 1

  const nextSlide = () => {
    if (!isLast) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onClose()
    }
  }

  const prevSlide = () => {
    if (!isFirst) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full relative">
        <div className="p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-[#98989d] hover:text-white transition-colors text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#2c2c2e]"
          >
            ✕
          </button>

          {/* Slide Content */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-6">{slide.icon}</div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">{slide.title}</h2>
            <p className="text-lg text-[#98989d] font-light leading-relaxed max-w-xl mx-auto">
              {slide.content}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-[#007aff]'
                    : 'w-2 bg-[#38383a] hover:bg-[#2c2c2e]'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevSlide}
              disabled={isFirst}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                isFirst
                  ? 'bg-[#2c2c2e] text-[#38383a] cursor-not-allowed'
                  : 'bg-[#2c2c2e] text-white hover:bg-[#38383a]'
              }`}
            >
              ← Previous
            </button>
            <div className="text-sm text-[#98989d] font-light">
              {currentSlide + 1} of {slides.length}
            </div>
            <button
              onClick={nextSlide}
              className="button-primary px-6 py-3 font-semibold"
            >
              {isLast ? 'Get Started' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

