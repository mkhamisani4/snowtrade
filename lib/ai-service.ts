import { openai } from './openai'
import { NewsItem, Trade, Stock, PerformanceMetrics } from './types'

export async function generateNewsHeadline(
  eventType: 'good' | 'bad' | 'rumor' | 'macro' | 'sector',
  stockName: string,
  ticker: string,
  context?: string
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
          content: context ? `${prompts[eventType]} Context: ${context}` : prompts[eventType],
        },
      ],
      max_tokens: 100,
      temperature: 0.8,
    })

    return response.choices[0]?.message?.content?.trim() || `${stockName} news update`
  } catch (error) {
    console.error('Error generating news headline:', error)
    // Fallback headlines
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

export async function generateNewsContent(
  headline: string,
  eventType: string,
  stockName: string
): Promise<string> {
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

export async function generateTradingFeedback(
  trades: Trade[],
  stocks: Stock[],
  metrics: PerformanceMetrics,
  scenarioName: string
): Promise<string> {
  const stockMap = new Map(stocks.map(s => [s.id, s]))
  
  const tradeSummary = trades.map(t => {
    const stock = stockMap.get(t.stock_id)
    return `${t.type} ${t.shares} shares of ${stock?.ticker || 'unknown'} at $${t.price.toFixed(2)} on day ${t.day}`
  }).join('\n')

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a professional trading coach providing constructive feedback. Analyze trading behavior and provide:
1. Trading style assessment (Aggressive/Moderate/Conservative)
2. 2-3 strengths
3. 3-4 areas for improvement
4. 3 practical tips
Be specific, educational, and encouraging.`,
        },
        {
          role: 'user',
          content: `Scenario: ${scenarioName}
Performance: ${metrics.total_return > 0 ? '+' : ''}${(metrics.total_return * 100).toFixed(1)}% return
Max Drawdown: ${(metrics.max_drawdown * 100).toFixed(1)}%
Trades: ${metrics.trades_count}
Portfolio Concentration: ${(metrics.portfolio_concentration * 100).toFixed(1)}%

Trades made:
${tradeSummary}

Provide detailed feedback on this trading performance.`,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content?.trim() || 'Thank you for completing the scenario!'
  } catch (error) {
    console.error('Error generating feedback:', error)
    return `You completed the ${scenarioName} scenario with a ${metrics.total_return > 0 ? '+' : ''}${(metrics.total_return * 100).toFixed(1)}% return. Keep practicing to improve your trading skills!`
  }
}


