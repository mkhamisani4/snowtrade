'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Scenario } from '@/lib/types'

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScenarios()
  }, [])

  async function loadScenarios() {
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('name')

      if (error) throw error
      setScenarios(data || [])
    } catch (error) {
      console.error('Error loading scenarios:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-lg text-[#98989d] font-light">Loading scenarios...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-8 py-16 max-w-5xl">
        <div className="mb-12">
          <Link
            href="/"
            className="text-[#007aff] hover:text-[#0051d5] transition-colors inline-flex items-center gap-2 mb-8 text-[15px] font-medium"
          >
            <span>←</span> Back
          </Link>
          <h1 className="text-6xl font-bold mb-4 tracking-tight">Choose a Scenario</h1>
          <p className="text-xl text-[#98989d] font-light">
            Select a scenario to begin your trading simulation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {scenarios.map((scenario) => (
            <Link
              key={scenario.id}
              href={`/simulation/${scenario.id}`}
              className="card p-10 hover:bg-[#1c1c1e]/80 transition-all duration-300 group"
            >
              <h2 className="text-3xl font-semibold mb-4 text-white group-hover:text-[#007aff] transition-colors tracking-tight">
                {scenario.name}
              </h2>
              <p className="text-[#98989d] mb-8 leading-relaxed text-[15px] font-light">
                {scenario.description}
              </p>
              <div className="flex justify-between items-center text-sm text-[#98989d] pt-6 border-t border-[#38383a]">
                <span className="font-medium">{scenario.duration_days} days</span>
                <span className="text-[#007aff] font-semibold text-base">
                  ${scenario.starting_balance.toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {scenarios.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[#98989d] text-lg font-light">
              No scenarios available. Please run the database seed script.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
