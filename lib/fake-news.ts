// Generate fake news items that don't affect stock prices
import { mockStocks } from './mock-stocks'

export interface NewsItem {
  id: string
  headline: string
  source: string
  time: string
  tickers: string[]
  type: 'positive' | 'negative' | 'neutral'
  isReal: boolean // Whether this actually affects prices
}

const newsSources = [
  'Bloomberg',
  'Reuters',
  'Wall Street Journal',
  'Financial Times',
  'CNBC',
  'MarketWatch',
  'TechCrunch',
  'Business Wire',
  'PR Newswire',
  'Yahoo Finance',
  'Seeking Alpha',
  'The Street'
]

const fakeHeadlines = [
  // Technology
  (ticker: string, name: string) => [
    `${name} Announces Minor Product Update`,
    `${ticker} Stock Sees Normal Trading Volume`,
    `Analyst Maintains Neutral Rating on ${ticker}`,
    `${name} CEO Attends Industry Conference`,
    `Routine Quarterly Report Filed by ${ticker}`,
    `${name} Expands Office Space in Secondary Market`,
    `Standard Market Activity for ${ticker} Today`,
    `${name} Announces Board Meeting Scheduled`,
  ],
  // Healthcare
  (ticker: string, name: string) => [
    `${name} Files Routine Regulatory Documentation`,
    `${ticker} Maintains Standard Operations`,
    `Normal Trading Patterns for ${name} Stock`,
    `${name} Announces Standard Quarterly Meeting`,
    `No Significant Changes Reported for ${ticker}`,
    `${name} Continues Standard Business Operations`,
  ],
  // Energy
  (ticker: string, name: string) => [
    `${name} Reports Standard Operational Metrics`,
    `Normal Market Activity for ${ticker} Today`,
    `${name} Maintains Regular Production Levels`,
    `Routine Market Update from ${ticker}`,
    `${name} Continues Standard Operations`,
  ],
  // Financial
  (ticker: string, name: string) => [
    `${name} Files Standard Regulatory Report`,
    `Normal Trading Volume for ${ticker}`,
    `${name} Announces Routine Board Meeting`,
    `Standard Market Activity for ${ticker}`,
    `${name} Maintains Normal Operations`,
  ],
  // Consumer/Retail
  (ticker: string, name: string) => [
    `${name} Reports Standard Sales Metrics`,
    `Normal Trading Activity for ${ticker}`,
    `${name} Announces Routine Store Operations`,
    `Standard Market Update from ${ticker}`,
    `${name} Continues Regular Business Activities`,
  ],
  // Automotive
  (ticker: string, name: string) => [
    `${name} Reports Standard Production Numbers`,
    `Normal Market Activity for ${ticker}`,
    `${name} Maintains Regular Operations`,
    `Routine Update from ${ticker}`,
    `${name} Continues Standard Manufacturing`,
  ],
  // Education
  (ticker: string, name: string) => [
    `${name} Reports Standard Enrollment Metrics`,
    `Normal Trading for ${ticker} Today`,
    `${name} Announces Routine Academic Calendar`,
    `Standard Operations Update from ${ticker}`,
    `${name} Maintains Regular Educational Services`,
  ],
]

export function generateFakeNews(hour: number, realScenarios: any[]): NewsItem[] {
  const allNews: NewsItem[] = []
  const numFakeNews = 10 - realScenarios.length // Fill to 10 total
  
  // Add real scenarios as news items - HIDE SENTIMENT from users
  realScenarios.forEach((scenario, index) => {
    allNews.push({
      id: `real-${scenario.id}`,
      headline: scenario.title,
      source: newsSources[Math.floor(Math.random() * newsSources.length)],
      time: `${hour}:00`,
      tickers: scenario.affectedStocks || [],
      // Don't reveal sentiment - users must decide
      type: 'neutral', // Always show as neutral so users can't tell
      isReal: true,
    })
  })
  
  // Generate fake news items
  for (let i = 0; i < numFakeNews; i++) {
    const randomStock = mockStocks[Math.floor(Math.random() * mockStocks.length)]
    const sectorIndex = Math.floor(Math.random() * fakeHeadlines.length)
    const headlines = fakeHeadlines[sectorIndex](randomStock.ticker, randomStock.name)
    const headline = headlines[Math.floor(Math.random() * headlines.length)]
    const source = newsSources[Math.floor(Math.random() * newsSources.length)]
    const type = Math.random() < 0.4 ? 'neutral' : Math.random() < 0.5 ? 'positive' : 'negative'
    
    // Sometimes include random tickers, sometimes none
    const tickers = Math.random() < 0.6 ? [randomStock.ticker] : []
    
    allNews.push({
      id: `fake-${hour}-${i}`,
      headline,
      source,
      time: `${hour}:00`,
      tickers,
      type,
      isReal: false,
    })
  }
  
  // Shuffle the news items so real ones aren't always first
  return allNews.sort(() => Math.random() - 0.5)
}

