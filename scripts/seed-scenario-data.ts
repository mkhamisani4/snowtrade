/**
 * Script to generate price data and news for scenarios
 * Run this after seeding stocks and scenarios
 * 
 * Usage: npx ts-node scripts/seed-scenario-data.ts
 */

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const openaiApiKey = process.env.OPENAI_API_KEY!

if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey) {
  console.error('Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and OPENAI_API_KEY are set.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const openai = new OpenAI({ apiKey: openaiApiKey })

async function generatePricePath(
  basePrice: number,
  volatility: number,
  days: number,
  shocks: { day: number; impact: number }[] = []
): Promise<number[]> {
  const prices: number[] = [basePrice]

  for (let day = 1; day < days; day++) {
    const randomChange = (Math.random() - 0.5) * volatility * 2
    const drift = -0.001
    const shock = shocks.find(s => s.day === day)
    const shockImpact = shock ? shock.impact : 0
    const newPrice = prices[day - 1] * (1 + randomChange + drift + shockImpact)
    prices.push(Math.max(0.01, newPrice))
  }

  return prices
}

async function generateNewsHeadline(
  eventType: 'good' | 'bad' | 'rumor' | 'macro' | 'sector',
  stockName: string,
  ticker: string
): Promise<string> {
  const prompts: Record<string, string> = {
    good: `Generate a positive news headline about ${stockName} (${ticker}). Make it realistic and market-appropriate.`,
    bad: `Generate a negative news headline about ${stockName} (${ticker}). Make it realistic and market-appropriate.`,
    rumor: `Generate a rumor-style social media post or news headline about ${stockName} (${ticker}). Make it sound like it could be true but unconfirmed.`,
    macro: `Generate a macroeconomic news headline that would affect ${stockName} (${ticker}) and similar stocks.`,
    sector: `Generate a sector-wide news headline that would affect ${stockName} (${ticker}) and its industry.`,
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a financial news headline generator. Generate concise, realistic headlines (max 100 characters).',
        },
        {
          role: 'user',
          content: prompts[eventType],
        },
      ],
      max_tokens: 100,
      temperature: 0.8,
    })

    return response.choices[0]?.message?.content?.trim() || `${stockName} news update`
  } catch (error) {
    console.error('Error generating news headline:', error)
    const fallbacks: Record<string, string> = {
      good: `${stockName} announces positive developments`,
      bad: `${stockName} faces challenges`,
      rumor: `Rumors circulate about ${stockName}`,
      macro: `Market conditions affect ${stockName}`,
      sector: `Sector trends impact ${stockName}`,
    }
    return fallbacks[eventType] || `${stockName} news update`
  }
}

async function generateNewsContent(headline: string, eventType: string, stockName: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a financial news writer. Generate a brief, realistic news article (2-3 sentences) based on the headline.',
        },
        {
          role: 'user',
          content: `Write a news article for this headline: "${headline}". Type: ${eventType}. Stock: ${stockName}.`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content?.trim() || `${headline}. Market participants are watching closely.`
  } catch (error) {
    console.error('Error generating news content:', error)
    return `${headline}. Market participants are watching closely.`
  }
}

async function seedScenarioData() {
  console.log('Loading scenarios...')
  const { data: scenarios, error: scenariosError } = await supabase
    .from('scenarios')
    .select('*')

  if (scenariosError) {
    console.error('Error loading scenarios:', scenariosError)
    return
  }

  if (!scenarios || scenarios.length === 0) {
    console.log('No scenarios found. Please seed scenarios first.')
    return
  }

  for (const scenario of scenarios) {
    console.log(`\nProcessing scenario: ${scenario.name}`)

    // Load stocks for this scenario
    const { data: stocks, error: stocksError } = await supabase
      .from('stocks')
      .select('*')
      .in('id', scenario.stock_ids)

    if (stocksError || !stocks) {
      console.error(`Error loading stocks for ${scenario.name}:`, stocksError)
      continue
    }

    // Generate price data
    console.log('Generating price data...')
    const priceDataToInsert: any[] = []

    for (const stock of stocks) {
      // Determine shocks based on scenario type
      const shocks: { day: number; impact: number }[] = []
      
      if (scenario.name.includes('Bubble')) {
        // Early pump, late dump
        shocks.push({ day: 2, impact: 0.15 })
        shocks.push({ day: 3, impact: 0.10 })
        shocks.push({ day: 7, impact: -0.20 })
      } else if (scenario.name.includes('Interest Rate')) {
        // Negative impact on day 3
        shocks.push({ day: 3, impact: -0.12 })
        shocks.push({ day: 6, impact: 0.05 }) // Recovery
      } else if (scenario.name.includes('Earnings')) {
        // Mixed earnings results
        const missDay = Math.floor(scenario.duration_days / 2)
        shocks.push({ day: missDay, impact: -0.15 })
      } else if (scenario.name.includes('Meme')) {
        // Volatile swings
        shocks.push({ day: 2, impact: 0.25 })
        shocks.push({ day: 4, impact: -0.20 })
        shocks.push({ day: 6, impact: 0.30 })
      }

      const prices = await generatePricePath(
        stock.base_price,
        stock.volatility,
        scenario.duration_days,
        shocks
      )

      prices.forEach((price, dayIndex) => {
        priceDataToInsert.push({
          scenario_id: scenario.id,
          stock_id: stock.id,
          day: dayIndex + 1,
          price: price.toFixed(2),
        })
      })
    }

    // Insert price data (with conflict handling)
    const { error: priceError } = await supabase
      .from('price_data')
      .upsert(priceDataToInsert, { onConflict: 'scenario_id,stock_id,day' })

    if (priceError) {
      console.error(`Error inserting price data:`, priceError)
    } else {
      console.log(`✓ Generated ${priceDataToInsert.length} price points`)
    }

    // Generate news items
    console.log('Generating news items...')
    const newsItemsToInsert: any[] = []

    // Generate 1-2 news items per day
    for (let day = 1; day <= scenario.duration_days; day++) {
      const numNews = Math.random() > 0.5 ? 2 : 1

      for (let i = 0; i < numNews; i++) {
        const randomStock = stocks[Math.floor(Math.random() * stocks.length)]
        const eventTypes: ('good' | 'bad' | 'rumor' | 'macro' | 'sector')[] = ['good', 'bad', 'rumor', 'macro', 'sector']
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

        const headline = await generateNewsHeadline(eventType, randomStock.name, randomStock.ticker)
        const content = await generateNewsContent(headline, eventType, randomStock.name)

        newsItemsToInsert.push({
          scenario_id: scenario.id,
          day,
          headline,
          content,
          type: eventType,
          affected_stocks: [randomStock.id],
        })

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // Insert news items
    const { error: newsError } = await supabase
      .from('news_items')
      .insert(newsItemsToInsert)

    if (newsError) {
      console.error(`Error inserting news items:`, newsError)
    } else {
      console.log(`✓ Generated ${newsItemsToInsert.length} news items`)
    }
  }

  console.log('\n✓ Scenario data seeding complete!')
}

seedScenarioData().catch(console.error)

