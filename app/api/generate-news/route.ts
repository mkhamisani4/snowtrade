import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateNewsHeadline, generateNewsContent } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    const { scenarioId, day, eventType, stockId } = await request.json()

    if (!scenarioId || !day || !eventType || !stockId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Get stock info
    const { data: stock, error: stockError } = await supabase
      .from('stocks')
      .select('*')
      .eq('id', stockId)
      .single()

    if (stockError || !stock) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
    }

    // Generate headline and content
    const headline = await generateNewsHeadline(eventType, stock.name, stock.ticker)
    const content = await generateNewsContent(headline, eventType, stock.name)

    // Save to database
    const { data: newsItem, error: insertError } = await supabase
      .from('news_items')
      .insert({
        scenario_id: scenarioId,
        day,
        headline,
        content,
        type: eventType,
        affected_stocks: [stockId],
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json(newsItem)
  } catch (error: any) {
    console.error('Error generating news:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

