'use client'

interface NewsItem {
  id: string
  headline: string
  source: string
  time: string
  tickers: string[]
  type: 'positive' | 'negative' | 'neutral'
}

export default function NewsTab() {
  const newsItems: NewsItem[] = [
    {
      id: '1',
      headline: 'Glacier Tech Reports Record Q4 Earnings, Beats Expectations',
      source: 'Financial Times',
      time: '2h ago',
      tickers: ['GLCR'],
      type: 'positive'
    },
    {
      id: '2',
      headline: 'AutoDrive Systems Announces New Autonomous Vehicle Partnership, Stock Surges',
      source: 'Bloomberg',
      time: '4h ago',
      tickers: ['AUTO'],
      type: 'positive'
    },
    {
      id: '3',
      headline: 'MedTech Solutions Cloud Revenue Grows 24% Year-Over-Year',
      source: 'Reuters',
      time: '6h ago',
      tickers: ['MEDX'],
      type: 'positive'
    },
    {
      id: '4',
      headline: 'Solar Energy Co Faces Regulatory Scrutiny in European Markets',
      source: 'Wall Street Journal',
      time: '8h ago',
      tickers: ['SOLR'],
      type: 'negative'
    },
    {
      id: '5',
      headline: 'FinTech Innovations Partners with Major Banks for Digital Infrastructure',
      source: 'TechCrunch',
      time: '10h ago',
      tickers: ['FINX', 'GLCR', 'EDU'],
      type: 'positive'
    },
    {
      id: '6',
      headline: 'EduLearn Reports Strong Enrollment Growth Despite Market Challenges',
      source: 'CNBC',
      time: '12h ago',
      tickers: ['EDU'],
      type: 'neutral'
    },
    {
      id: '7',
      headline: 'RetailMax Corp Expands E-Commerce Platform with New Distribution Centers',
      source: 'Business Wire',
      time: '14h ago',
      tickers: ['RETAIL'],
      type: 'positive'
    },
    {
      id: '8',
      headline: 'BioGen Labs Drug Trial Results Disappoint Investors',
      source: 'Reuters',
      time: '16h ago',
      tickers: ['BIO'],
      type: 'negative'
    },
    {
      id: '9',
      headline: 'CloudScale Inc Secures Major Enterprise Cloud Contracts',
      source: 'TechCrunch',
      time: '18h ago',
      tickers: ['CLOUD'],
      type: 'positive'
    },
    {
      id: '10',
      headline: 'GreenPower Energy Receives Government Grant for Renewable Projects',
      source: 'Bloomberg',
      time: '20h ago',
      tickers: ['GREEN'],
      type: 'positive'
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-[#30d158]/15 text-[#30d158] border-[#30d158]/20'
      case 'negative':
        return 'bg-[#ff453a]/15 text-[#ff453a] border-[#ff453a]/20'
      default:
        return 'bg-[#007aff]/15 text-[#007aff] border-[#007aff]/20'
    }
  }

  return (
    <div className="space-y-3">
      {newsItems.map((item) => (
        <div key={item.id} className="card p-5 hover:bg-[#1c1c1e]/80 transition-all duration-200">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2 text-lg leading-snug">{item.headline}</h3>
              <div className="flex items-center gap-3 text-xs text-[#98989d] font-light">
                <span>{item.source}</span>
                <span>•</span>
                <span>{item.time}</span>
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getTypeColor(item.type)}`}>
              {item.type.toUpperCase()}
            </div>
          </div>
          {item.tickers.length > 0 && (
            <div className="flex items-center gap-2 pt-3 border-t border-[#38383a]/50">
              <span className="text-xs text-[#98989d] font-light">Related:</span>
              <div className="flex gap-2">
                {item.tickers.map((ticker) => (
                  <span key={ticker} className="px-2 py-0.5 bg-[#2c2c2e] rounded text-xs text-white font-medium">
                    {ticker}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
