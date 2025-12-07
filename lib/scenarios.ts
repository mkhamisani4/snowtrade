// 200+ Trading Scenarios for SnowTrade
// Each scenario represents a market event that could affect stock prices

export interface Scenario {
  id: string
  title: string
  description: string
  type: 'earnings' | 'regulatory' | 'partnership' | 'product' | 'macro' | 'rumor' | 'sector' | 'crisis' | 'merger' | 'analyst' | 'technical' | 'pandemic' | 'political' | 'social' | 'environmental' | 'geopolitical' | 'other'
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed'
  affectedStocks: string[]
  impact: 'low' | 'medium' | 'high' | 'extreme'
  duration: 'immediate' | 'short' | 'medium' | 'long'
}

export const scenarios: Scenario[] = [
  // Earnings & Financial Reports (1-15)
  {
    id: '1',
    title: 'Glacier Tech Beats Q4 Earnings Expectations',
    description: 'GLCR reports earnings per share of $2.45, beating analyst estimates of $2.20. Revenue up 18% YoY.',
    type: 'earnings',
    sentiment: 'positive',
    affectedStocks: ['GLCR'],
    impact: 'high',
    duration: 'immediate'
  },
  {
    id: '2',
    title: 'EduLearn Misses Revenue Targets',
    description: 'EDU reports lower-than-expected enrollment numbers, missing revenue guidance by 12%.',
    type: 'earnings',
    sentiment: 'negative',
    affectedStocks: ['EDU'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '3',
    title: 'Solar Energy Co Exceeds Guidance',
    description: 'SOLR announces record quarterly revenue, exceeding guidance by 25% due to strong international expansion.',
    type: 'earnings',
    sentiment: 'positive',
    affectedStocks: ['SOLR'],
    impact: 'high',
    duration: 'immediate'
  },
  {
    id: '4',
    title: 'MedTech Solutions FDA Approval Delayed',
    description: 'MEDX announces FDA delays approval of flagship drug by 6 months, citing additional testing requirements.',
    type: 'earnings',
    sentiment: 'negative',
    affectedStocks: ['MEDX'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '5',
    title: 'FinTech Innovations Strong User Growth',
    description: 'FINX reports 40% increase in active users, with mobile app downloads surging 150%.',
    type: 'earnings',
    sentiment: 'positive',
    affectedStocks: ['FINX'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '6',
    title: 'AutoDrive Systems Production Issues',
    description: 'AUTO reports manufacturing delays, cutting Q4 delivery estimates by 30%.',
    type: 'earnings',
    sentiment: 'negative',
    affectedStocks: ['AUTO'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '7',
    title: 'RetailMax Corp Holiday Sales Surge',
    description: 'RETAIL reports strongest holiday quarter in company history, with e-commerce sales up 45%.',
    type: 'earnings',
    sentiment: 'positive',
    affectedStocks: ['RETAIL'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '8',
    title: 'BioGen Labs Clinical Trial Success',
    description: 'BIO announces Phase 3 trial results exceed all endpoints, drug shows 85% efficacy rate.',
    type: 'earnings',
    sentiment: 'positive',
    affectedStocks: ['BIO'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '9',
    title: 'CloudScale Inc Customer Churn Concerns',
    description: 'CLOUD reports higher-than-expected customer churn rate, raising concerns about competitive pressure.',
    type: 'earnings',
    sentiment: 'negative',
    affectedStocks: ['CLOUD'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '10',
    title: 'GreenPower Energy Cost Overruns',
    description: 'GREEN announces project cost overruns of $200M, delaying profitability timeline.',
    type: 'earnings',
    sentiment: 'negative',
    affectedStocks: ['GREEN'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '11',
    title: 'Sector-Wide Earnings Beat',
    description: 'Technology sector reports strongest earnings season in 5 years, with 80% of companies beating estimates.',
    type: 'earnings',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'CLOUD'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '12',
    title: 'Healthcare Sector Guidance Cuts',
    description: 'Multiple healthcare companies cut full-year guidance citing regulatory uncertainty.',
    type: 'earnings',
    sentiment: 'negative',
    affectedStocks: ['MEDX', 'BIO'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '13',
    title: 'Energy Sector Profit Margins Expand',
    description: 'Renewable energy companies report expanding profit margins due to falling material costs.',
    type: 'earnings',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '14',
    title: 'Consumer Sector Weakness',
    description: 'Consumer discretionary stocks report declining sales as inflation impacts spending.',
    type: 'earnings',
    sentiment: 'negative',
    affectedStocks: ['RETAIL'],
    impact: 'low',
    duration: 'short'
  },
  {
    id: '15',
    title: 'Financial Sector Interest Rate Benefits',
    description: 'Fintech companies report increased revenue from higher interest rates on deposits.',
    type: 'earnings',
    sentiment: 'positive',
    affectedStocks: ['FINX'],
    impact: 'medium',
    duration: 'medium'
  },

  // Regulatory & Legal (16-25)
  {
    id: '16',
    title: 'Tech Sector Antitrust Investigation',
    description: 'Regulators launch broad antitrust investigation into major technology companies.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '17',
    title: 'Data Privacy Regulations Tighten',
    description: 'New data privacy regulations require significant compliance investments from tech companies.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'FINX', 'CLOUD'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '18',
    title: 'FDA Fast-Track Approval Program',
    description: 'FDA announces fast-track approval program for innovative medical devices, speeding time to market.',
    type: 'regulatory',
    sentiment: 'positive',
    affectedStocks: ['MEDX', 'BIO'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '19',
    title: 'Renewable Energy Tax Credits Extended',
    description: 'Government extends renewable energy tax credits for another 10 years.',
    type: 'regulatory',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '20',
    title: 'Autonomous Vehicle Regulations Relaxed',
    description: 'Transportation department relaxes regulations on autonomous vehicle testing and deployment.',
    type: 'regulatory',
    sentiment: 'positive',
    affectedStocks: ['AUTO'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '21',
    title: 'Education Sector Funding Cuts',
    description: 'Federal education funding reduced, impacting online education providers.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['EDU'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '22',
    title: 'Cybersecurity Mandates Announced',
    description: 'New cybersecurity mandates require all financial institutions to upgrade systems.',
    type: 'regulatory',
    sentiment: 'mixed',
    affectedStocks: ['FINX'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '23',
    title: 'Carbon Emission Standards Tightened',
    description: 'Stricter carbon emission standards announced, benefiting renewable energy companies.',
    type: 'regulatory',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '24',
    title: 'International Trade Tariffs Imposed',
    description: 'New tariffs on imported technology components increase costs for tech manufacturers.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'AUTO', 'CLOUD'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '25',
    title: 'Data Localization Requirements',
    description: 'New data localization laws require companies to store data within country borders.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['CLOUD', 'FINX'],
    impact: 'high',
    duration: 'long'
  },

  // Partnerships & Mergers (26-35)
  {
    id: '26',
    title: 'Glacier Tech Strategic Partnership',
    description: 'GLCR announces major partnership with global cloud provider, expanding market reach.',
    type: 'partnership',
    sentiment: 'positive',
    affectedStocks: ['GLCR'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '27',
    title: 'EduLearn University Alliance',
    description: 'EDU partners with 50 major universities to offer accredited online programs.',
    type: 'partnership',
    sentiment: 'positive',
    affectedStocks: ['EDU'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '28',
    title: 'Solar Energy Co Government Contract',
    description: 'SOLR wins $500M government contract to build solar farms across multiple states.',
    type: 'partnership',
    sentiment: 'positive',
    affectedStocks: ['SOLR'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '29',
    title: 'MedTech Solutions Hospital Network Deal',
    description: 'MEDX signs exclusive supply agreement with largest hospital network in the country.',
    type: 'partnership',
    sentiment: 'positive',
    affectedStocks: ['MEDX'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '30',
    title: 'FinTech Innovations Bank Integration',
    description: 'FINX partners with major banks to integrate payment solutions into core banking systems.',
    type: 'partnership',
    sentiment: 'positive',
    affectedStocks: ['FINX'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '31',
    title: 'AutoDrive Systems Auto Manufacturer Deal',
    description: 'AUTO signs deal with major automaker to provide autonomous driving systems for next-gen vehicles.',
    type: 'partnership',
    sentiment: 'positive',
    affectedStocks: ['AUTO'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '32',
    title: 'RetailMax Corp Logistics Partnership',
    description: 'RETAIL partners with logistics giant to offer same-day delivery nationwide.',
    type: 'partnership',
    sentiment: 'positive',
    affectedStocks: ['RETAIL'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '33',
    title: 'BioGen Labs Research Collaboration',
    description: 'BIO announces research collaboration with top medical institutions for drug development.',
    type: 'partnership',
    sentiment: 'positive',
    affectedStocks: ['BIO'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '34',
    title: 'CloudScale Inc Enterprise Deal',
    description: 'CLOUD secures multi-year contract with Fortune 500 company for cloud infrastructure.',
    type: 'partnership',
    sentiment: 'positive',
    affectedStocks: ['CLOUD'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '35',
    title: 'GreenPower Energy Utility Partnership',
    description: 'GREEN partners with major utility company to supply renewable energy to 2M households.',
    type: 'partnership',
    sentiment: 'positive',
    affectedStocks: ['GREEN'],
    impact: 'high',
    duration: 'medium'
  },

  // Product Launches & Innovation (36-45)
  {
    id: '36',
    title: 'Glacier Tech AI Product Launch',
    description: 'GLCR launches revolutionary AI platform, receiving 100K pre-orders in first week.',
    type: 'product',
    sentiment: 'positive',
    affectedStocks: ['GLCR'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '37',
    title: 'EduLearn VR Learning Platform',
    description: 'EDU launches immersive VR learning platform, receiving positive reviews from educators.',
    type: 'product',
    sentiment: 'positive',
    affectedStocks: ['EDU'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '38',
    title: 'Solar Energy Co Efficiency Breakthrough',
    description: 'SOLR announces 30% improvement in solar panel efficiency, reducing costs significantly.',
    type: 'product',
    sentiment: 'positive',
    affectedStocks: ['SOLR'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '39',
    title: 'MedTech Solutions Device Recall',
    description: 'MEDX recalls popular medical device due to safety concerns, affecting 50K units.',
    type: 'product',
    sentiment: 'negative',
    affectedStocks: ['MEDX'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '40',
    title: 'FinTech Innovations Mobile App Update',
    description: 'FINX releases major app update with new features, sees 200% increase in user engagement.',
    type: 'product',
    sentiment: 'positive',
    affectedStocks: ['FINX'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '41',
    title: 'AutoDrive Systems Self-Driving Milestone',
    description: 'AUTO achieves Level 4 autonomy in testing, major step toward fully autonomous vehicles.',
    type: 'product',
    sentiment: 'positive',
    affectedStocks: ['AUTO'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '42',
    title: 'RetailMax Corp Marketplace Launch',
    description: 'RETAIL launches third-party marketplace, attracting 10K sellers in first month.',
    type: 'product',
    sentiment: 'positive',
    affectedStocks: ['RETAIL'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '43',
    title: 'BioGen Labs Drug Approval',
    description: 'BIO receives FDA approval for breakthrough cancer treatment drug.',
    type: 'product',
    sentiment: 'positive',
    affectedStocks: ['BIO'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '44',
    title: 'CloudScale Inc Service Outage',
    description: 'CLOUD experiences major service outage affecting thousands of customers for 8 hours.',
    type: 'product',
    sentiment: 'negative',
    affectedStocks: ['CLOUD'],
    impact: 'high',
    duration: 'immediate'
  },
  {
    id: '45',
    title: 'GreenPower Energy Battery Innovation',
    description: 'GREEN announces new battery technology that doubles energy storage capacity.',
    type: 'product',
    sentiment: 'positive',
    affectedStocks: ['GREEN'],
    impact: 'high',
    duration: 'medium'
  },

  // Macro Economic Events (46-55)
  {
    id: '46',
    title: 'Federal Reserve Interest Rate Hike',
    description: 'Fed raises interest rates by 0.5%, impacting growth stocks and financial sector.',
    type: 'macro',
    sentiment: 'mixed',
    affectedStocks: ['GLCR', 'FINX', 'CLOUD', 'AUTO'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '47',
    title: 'Inflation Data Exceeds Expectations',
    description: 'CPI data shows inflation higher than expected, raising concerns about economic slowdown.',
    type: 'macro',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'EDU', 'AUTO'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '48',
    title: 'GDP Growth Surprises to Upside',
    description: 'Q4 GDP growth exceeds expectations, indicating strong economic momentum.',
    type: 'macro',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'RETAIL', 'FINX', 'CLOUD'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '49',
    title: 'Unemployment Rate Drops',
    description: 'Unemployment rate falls to 3.5%, lowest in decades, boosting consumer confidence.',
    type: 'macro',
    sentiment: 'positive',
    affectedStocks: ['RETAIL', 'EDU', 'FINX'],
    impact: 'low',
    duration: 'short'
  },
  {
    id: '50',
    title: 'Currency Devaluation',
    description: 'Major currency devaluation impacts international companies with overseas operations.',
    type: 'macro',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'SOLR', 'CLOUD', 'GREEN'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '51',
    title: 'Oil Price Shock',
    description: 'Oil prices surge 20% due to supply disruptions, impacting transportation and energy sectors.',
    type: 'macro',
    sentiment: 'mixed',
    affectedStocks: ['AUTO', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '52',
    title: 'Housing Market Correction',
    description: 'Housing prices decline 10%, signaling potential economic slowdown.',
    type: 'macro',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'FINX'],
    impact: 'low',
    duration: 'medium'
  },
  {
    id: '53',
    title: 'Consumer Confidence Index Rises',
    description: 'Consumer confidence reaches 5-year high, indicating strong spending ahead.',
    type: 'macro',
    sentiment: 'positive',
    affectedStocks: ['RETAIL', 'EDU', 'AUTO'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '54',
    title: 'Trade War Escalation',
    description: 'Trade tensions escalate with new tariffs on technology and manufacturing goods.',
    type: 'macro',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'AUTO', 'CLOUD'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '55',
    title: 'Government Stimulus Package',
    description: 'Government announces $500B stimulus package focusing on infrastructure and green energy.',
    type: 'macro',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'AUTO', 'CLOUD'],
    impact: 'high',
    duration: 'medium'
  },

  // Rumors & Speculation (56-65)
  {
    id: '56',
    title: 'Glacier Tech Acquisition Rumors',
    description: 'Rumors circulate that GLCR is in talks to be acquired by tech giant for premium price.',
    type: 'rumor',
    sentiment: 'positive',
    affectedStocks: ['GLCR'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '57',
    title: 'EduLearn Data Breach Allegations',
    description: 'Unconfirmed reports suggest EDU may have experienced significant data breach.',
    type: 'rumor',
    sentiment: 'negative',
    affectedStocks: ['EDU'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '58',
    title: 'Solar Energy Co Merger Speculation',
    description: 'Analysts speculate SOLR may merge with larger energy company to scale operations.',
    type: 'rumor',
    sentiment: 'positive',
    affectedStocks: ['SOLR'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '59',
    title: 'MedTech Solutions Patent Dispute',
    description: 'Unconfirmed reports of patent infringement lawsuit against MEDX from competitor.',
    type: 'rumor',
    sentiment: 'negative',
    affectedStocks: ['MEDX'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '60',
    title: 'FinTech Innovations IPO Rumors',
    description: 'Rumors suggest FINX may be preparing for IPO, valuing company at $10B.',
    type: 'rumor',
    sentiment: 'positive',
    affectedStocks: ['FINX'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '61',
    title: 'AutoDrive Systems Safety Concerns',
    description: 'Social media reports raise questions about safety of AUTO autonomous systems.',
    type: 'rumor',
    sentiment: 'negative',
    affectedStocks: ['AUTO'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '62',
    title: 'RetailMax Corp Expansion Plans',
    description: 'Industry sources suggest RETAIL planning major international expansion.',
    type: 'rumor',
    sentiment: 'positive',
    affectedStocks: ['RETAIL'],
    impact: 'low',
    duration: 'short'
  },
  {
    id: '63',
    title: 'BioGen Labs Breakthrough Leak',
    description: 'Leaked documents suggest BIO has breakthrough drug in late-stage development.',
    type: 'rumor',
    sentiment: 'positive',
    affectedStocks: ['BIO'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '64',
    title: 'CloudScale Inc Customer Loss',
    description: 'Unconfirmed reports that major CLOUD customer is switching to competitor.',
    type: 'rumor',
    sentiment: 'negative',
    affectedStocks: ['CLOUD'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '65',
    title: 'GreenPower Energy Government Contract',
    description: 'Sources indicate GREEN may win major government renewable energy contract.',
    type: 'rumor',
    sentiment: 'positive',
    affectedStocks: ['GREEN'],
    impact: 'high',
    duration: 'short'
  },

  // Sector-Wide Events (66-75)
  {
    id: '66',
    title: 'Technology Sector Sell-Off',
    description: 'Tech stocks experience broad sell-off as investors rotate to value stocks.',
    type: 'sector',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '67',
    title: 'Healthcare Sector Rally',
    description: 'Healthcare stocks rally on positive regulatory developments and strong earnings.',
    type: 'sector',
    sentiment: 'positive',
    affectedStocks: ['MEDX', 'BIO'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '68',
    title: 'Renewable Energy Sector Surge',
    description: 'Renewable energy stocks surge as climate policies gain momentum globally.',
    type: 'sector',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '69',
    title: 'Consumer Discretionary Weakness',
    description: 'Consumer discretionary sector underperforms as inflation impacts spending power.',
    type: 'sector',
    sentiment: 'negative',
    affectedStocks: ['RETAIL'],
    impact: 'low',
    duration: 'short'
  },
  {
    id: '70',
    title: 'Financial Technology Innovation Wave',
    description: 'Fintech sector sees surge in investment and innovation, driving stock prices higher.',
    type: 'sector',
    sentiment: 'positive',
    affectedStocks: ['FINX'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '71',
    title: 'Automotive Sector Supply Chain Issues',
    description: 'Automotive sector faces continued supply chain disruptions affecting production.',
    type: 'sector',
    sentiment: 'negative',
    affectedStocks: ['AUTO'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '72',
    title: 'Education Technology Adoption',
    description: 'EdTech sector sees accelerated adoption as schools invest in digital learning.',
    type: 'sector',
    sentiment: 'positive',
    affectedStocks: ['EDU'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '73',
    title: 'Cloud Computing Growth Acceleration',
    description: 'Cloud computing sector experiences accelerated growth as enterprises migrate to cloud.',
    type: 'sector',
    sentiment: 'positive',
    affectedStocks: ['CLOUD'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '74',
    title: 'Biotechnology Funding Increase',
    description: 'Biotech sector receives record funding, driving innovation and stock valuations.',
    type: 'sector',
    sentiment: 'positive',
    affectedStocks: ['BIO'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '75',
    title: 'Retail Sector E-Commerce Shift',
    description: 'Retail sector continues shift to e-commerce, benefiting online retailers.',
    type: 'sector',
    sentiment: 'positive',
    affectedStocks: ['RETAIL'],
    impact: 'low',
    duration: 'medium'
  },

  // Crisis & Market Events (76-85)
  {
    id: '76',
    title: 'Market Flash Crash',
    description: 'Stock market experiences sudden 5% drop in minutes due to algorithmic trading.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'EDU', 'SOLR', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'BIO', 'CLOUD', 'GREEN'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '77',
    title: 'Cybersecurity Breach Wave',
    description: 'Multiple companies report cybersecurity breaches, raising concerns about data security.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'FINX', 'CLOUD', 'EDU'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '78',
    title: 'Natural Disaster Impact',
    description: 'Major natural disaster disrupts supply chains and operations across multiple sectors.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['SOLR', 'GREEN', 'AUTO', 'RETAIL'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '79',
    title: 'Pandemic Resurgence Concerns',
    description: 'New variant concerns lead to market volatility and sector rotation.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'EDU', 'AUTO'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '80',
    title: 'Banking Sector Stress',
    description: 'Banking sector shows signs of stress, impacting financial technology companies.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['FINX'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '81',
    title: 'Commodity Price Spike',
    description: 'Commodity prices spike unexpectedly, impacting manufacturing and energy costs.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['AUTO', 'SOLR', 'GREEN'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '82',
    title: 'Geopolitical Tensions Escalate',
    description: 'Geopolitical tensions escalate, causing market uncertainty and volatility.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '83',
    title: 'Credit Market Freeze',
    description: 'Credit markets tighten, making it harder for companies to access capital.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['SOLR', 'GREEN', 'BIO', 'AUTO'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '84',
    title: 'Supply Chain Collapse',
    description: 'Major supply chain disruption affects multiple industries simultaneously.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['AUTO', 'RETAIL', 'MEDX'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '85',
    title: 'Market Recovery Rally',
    description: 'Markets stage strong recovery rally after previous sell-off, led by growth stocks.',
    type: 'crisis',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX', 'BIO'],
    impact: 'high',
    duration: 'short'
  },

  // Analyst Actions (86-95)
  {
    id: '86',
    title: 'Major Upgrade for Glacier Tech',
    description: 'Top analyst upgrades GLCR to "Strong Buy" with $250 price target, citing AI leadership.',
    type: 'analyst',
    sentiment: 'positive',
    affectedStocks: ['GLCR'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '87',
    title: 'EduLearn Downgrade',
    description: 'Analyst downgrades EDU to "Hold" citing competitive pressures and margin concerns.',
    type: 'analyst',
    sentiment: 'negative',
    affectedStocks: ['EDU'],
    impact: 'low',
    duration: 'short'
  },
  {
    id: '88',
    title: 'Solar Energy Co Price Target Raised',
    description: 'Multiple analysts raise price targets for SOLR following strong quarterly results.',
    type: 'analyst',
    sentiment: 'positive',
    affectedStocks: ['SOLR'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '89',
    title: 'MedTech Solutions Coverage Initiated',
    description: 'Major investment bank initiates coverage on MEDX with "Buy" rating and bullish outlook.',
    type: 'analyst',
    sentiment: 'positive',
    affectedStocks: ['MEDX'],
    impact: 'low',
    duration: 'short'
  },
  {
    id: '90',
    title: 'FinTech Innovations Sector Leader',
    description: 'Analysts name FINX as sector leader with best-in-class growth prospects.',
    type: 'analyst',
    sentiment: 'positive',
    affectedStocks: ['FINX'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '91',
    title: 'AutoDrive Systems Concerns',
    description: 'Analyst expresses concerns about AUTO execution and competitive positioning.',
    type: 'analyst',
    sentiment: 'negative',
    affectedStocks: ['AUTO'],
    impact: 'low',
    duration: 'short'
  },
  {
    id: '92',
    title: 'RetailMax Corp Turnaround Story',
    description: 'Analysts highlight RETAIL as turnaround story with strong e-commerce growth.',
    type: 'analyst',
    sentiment: 'positive',
    affectedStocks: ['RETAIL'],
    impact: 'low',
    duration: 'short'
  },
  {
    id: '93',
    title: 'BioGen Labs High Risk/High Reward',
    description: 'Analysts note BIO as high-risk, high-reward play with multiple catalysts ahead.',
    type: 'analyst',
    sentiment: 'neutral',
    affectedStocks: ['BIO'],
    impact: 'low',
    duration: 'short'
  },
  {
    id: '94',
    title: 'CloudScale Inc Market Share Gains',
    description: 'Analysts highlight CLOUD market share gains and strong competitive position.',
    type: 'analyst',
    sentiment: 'positive',
    affectedStocks: ['CLOUD'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '95',
    title: 'GreenPower Energy Valuation Concerns',
    description: 'Analysts question GREEN valuation relative to growth prospects and profitability.',
    type: 'analyst',
    sentiment: 'negative',
    affectedStocks: ['GREEN'],
    impact: 'low',
    duration: 'short'
  },

  // Technical & Market Structure (96-100)
  {
    id: '96',
    title: 'Options Expiration Volatility',
    description: 'Quadruple witching day creates unusual volatility as options and futures expire.',
    type: 'technical',
    sentiment: 'neutral',
    affectedStocks: ['GLCR', 'EDU', 'SOLR', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'BIO', 'CLOUD', 'GREEN'],
    impact: 'medium',
    duration: 'immediate'
  },
  {
    id: '97',
    title: 'Short Squeeze Rally',
    description: 'Heavily shorted stocks experience squeeze as short sellers cover positions.',
    type: 'technical',
    sentiment: 'positive',
    affectedStocks: ['BIO', 'GREEN', 'SOLR'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '98',
    title: 'Institutional Rebalancing',
    description: 'Quarter-end rebalancing by large institutions creates unusual trading patterns.',
    type: 'technical',
    sentiment: 'neutral',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX', 'MEDX'],
    impact: 'low',
    duration: 'immediate'
  },
  {
    id: '99',
    title: 'Algorithmic Trading Glitch',
    description: 'Algorithmic trading system glitch causes unusual price movements across multiple stocks.',
    type: 'technical',
    sentiment: 'neutral',
    affectedStocks: ['GLCR', 'EDU', 'SOLR', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'BIO', 'CLOUD', 'GREEN'],
    impact: 'medium',
    duration: 'immediate'
  },
  {
    id: '100',
    title: 'Market Maker Liquidity Event',
    description: 'Major market maker reduces liquidity provision, increasing volatility and spreads.',
    type: 'technical',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'EDU', 'SOLR', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'BIO', 'CLOUD', 'GREEN'],
    impact: 'medium',
    duration: 'short'
  },

  // Pandemic & Health Crises (101-120)
  {
    id: '101',
    title: 'New Pandemic Strain Emerges',
    description: 'New highly contagious virus strain detected, raising concerns about global health crisis and economic disruption.',
    type: 'pandemic',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'AUTO', 'EDU', 'MEDX', 'BIO'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '102',
    title: 'Vaccine Development Breakthrough',
    description: 'Major pharmaceutical breakthrough in vaccine development, offering hope for pandemic control.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['BIO', 'MEDX'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '103',
    title: 'Lockdown Measures Reinstated',
    description: 'Governments reinstate lockdown measures as infection rates surge, impacting retail and travel sectors.',
    type: 'pandemic',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'AUTO', 'EDU'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '104',
    title: 'Remote Work Becomes Permanent',
    description: 'Major shift to permanent remote work arrangements, boosting technology and cloud services.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['CLOUD', 'GLCR', 'EDU', 'FINX'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '105',
    title: 'Healthcare System Overwhelmed',
    description: 'Healthcare systems face overwhelming pressure, highlighting need for medical technology and telemedicine.',
    type: 'pandemic',
    sentiment: 'mixed',
    affectedStocks: ['MEDX', 'BIO', 'EDU'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '106',
    title: 'Supply Chain Disruption from Health Crisis',
    description: 'Pandemic-related supply chain disruptions affect manufacturing and retail operations globally.',
    type: 'pandemic',
    sentiment: 'negative',
    affectedStocks: ['AUTO', 'RETAIL', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '107',
    title: 'Contact Tracing Technology Demand',
    description: 'Surge in demand for contact tracing and health monitoring technology solutions.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'MEDX', 'CLOUD'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '108',
    title: 'E-Learning Adoption Accelerates',
    description: 'Schools and universities accelerate adoption of online learning platforms during health crisis.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['EDU', 'CLOUD'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '109',
    title: 'Mental Health Services Surge',
    description: 'Increased demand for mental health services and digital health platforms during extended crisis.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['MEDX', 'EDU'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '110',
    title: 'Pharmaceutical Stockpiling',
    description: 'Governments increase pharmaceutical stockpiling, boosting demand for medical supplies and drugs.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['BIO', 'MEDX'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '111',
    title: 'Travel Restrictions Extended',
    description: 'International travel restrictions extended indefinitely, severely impacting transportation and tourism.',
    type: 'pandemic',
    sentiment: 'negative',
    affectedStocks: ['AUTO', 'RETAIL'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '112',
    title: 'Digital Health Passport Launch',
    description: 'Global digital health passport system launched, requiring technology infrastructure and verification.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'FINX', 'CLOUD'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '113',
    title: 'Antiviral Drug Approval',
    description: 'FDA fast-tracks approval of new antiviral drug showing high efficacy rates.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['BIO', 'MEDX'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '114',
    title: 'Hospital Capacity Crisis',
    description: 'Hospitals reach capacity limits, driving demand for medical equipment and telemedicine solutions.',
    type: 'pandemic',
    sentiment: 'mixed',
    affectedStocks: ['MEDX', 'BIO'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '115',
    title: 'Workforce Shortages',
    description: 'Widespread workforce shortages due to illness and isolation requirements impact all sectors.',
    type: 'pandemic',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'AUTO', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '116',
    title: 'Contactless Payment Adoption',
    description: 'Accelerated adoption of contactless payment systems to reduce physical contact.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['FINX', 'RETAIL'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '117',
    title: 'Home Delivery Services Boom',
    description: 'Surge in home delivery and e-commerce as consumers avoid physical stores.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['RETAIL', 'AUTO'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '118',
    title: 'Research Funding Increase',
    description: 'Massive increase in government and private funding for medical research and development.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['BIO', 'MEDX'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '119',
    title: 'Public Health Infrastructure Investment',
    description: 'Governments announce major investments in public health infrastructure and technology.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['MEDX', 'CLOUD', 'GLCR'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '120',
    title: 'Pandemic End Declared',
    description: 'World Health Organization declares pandemic officially over, markets celebrate return to normalcy.',
    type: 'pandemic',
    sentiment: 'positive',
    affectedStocks: ['RETAIL', 'AUTO', 'EDU', 'RETAIL'],
    impact: 'extreme',
    duration: 'immediate'
  },

  // Political Events (121-150)
  {
    id: '121',
    title: 'Presidential Election Uncertainty',
    description: 'Contested election results create political uncertainty, causing market volatility.',
    type: 'political',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'EDU', 'SOLR', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'BIO', 'CLOUD', 'GREEN'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '122',
    title: 'New Administration Policy Shift',
    description: 'New administration announces major policy shifts affecting multiple industries.',
    type: 'political',
    sentiment: 'mixed',
    affectedStocks: ['SOLR', 'GREEN', 'EDU', 'MEDX'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '123',
    title: 'Climate Policy Legislation',
    description: 'Major climate policy legislation passed, mandating renewable energy adoption and carbon reduction.',
    type: 'political',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'AUTO'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '124',
    title: 'Tax Policy Changes',
    description: 'Significant corporate tax policy changes announced, affecting profitability across sectors.',
    type: 'political',
    sentiment: 'mixed',
    affectedStocks: ['GLCR', 'EDU', 'SOLR', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'BIO', 'CLOUD', 'GREEN'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '125',
    title: 'Immigration Policy Reform',
    description: 'Major immigration policy reform impacts tech sector talent pool and labor costs.',
    type: 'political',
    sentiment: 'mixed',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '126',
    title: 'Healthcare Reform Bill',
    description: 'Comprehensive healthcare reform bill passed, affecting medical technology and insurance sectors.',
    type: 'political',
    sentiment: 'mixed',
    affectedStocks: ['MEDX', 'BIO'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '127',
    title: 'Education Funding Increase',
    description: 'Government announces major increase in education funding, benefiting edtech companies.',
    type: 'political',
    sentiment: 'positive',
    affectedStocks: ['EDU'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '128',
    title: 'Infrastructure Investment Package',
    description: 'Massive infrastructure investment package approved, focusing on green energy and technology.',
    type: 'political',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'AUTO', 'CLOUD'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '129',
    title: 'Regulatory Agency Leadership Change',
    description: 'New leadership at key regulatory agencies signals potential policy shifts.',
    type: 'political',
    sentiment: 'neutral',
    affectedStocks: ['MEDX', 'BIO', 'FINX', 'GLCR'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '130',
    title: 'Government Shutdown',
    description: 'Federal government shutdown disrupts contracts and regulatory approvals.',
    type: 'political',
    sentiment: 'negative',
    affectedStocks: ['SOLR', 'GREEN', 'MEDX', 'BIO'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '131',
    title: 'Supreme Court Ruling Impact',
    description: 'Major Supreme Court ruling affects business regulations and industry practices.',
    type: 'political',
    sentiment: 'mixed',
    affectedStocks: ['GLCR', 'FINX', 'CLOUD', 'EDU'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '132',
    title: 'Campaign Finance Reform',
    description: 'Campaign finance reform legislation changes corporate political spending rules.',
    type: 'political',
    sentiment: 'neutral',
    affectedStocks: ['GLCR', 'EDU', 'SOLR', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'BIO', 'CLOUD', 'GREEN'],
    impact: 'low',
    duration: 'long'
  },
  {
    id: '133',
    title: 'State-Level Policy Changes',
    description: 'Multiple states implement conflicting policies, creating regulatory uncertainty.',
    type: 'political',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'EDU', 'FINX'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '134',
    title: 'International Trade Agreement',
    description: 'New international trade agreement reduces tariffs and opens new markets.',
    type: 'political',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'AUTO', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '135',
    title: 'Defense Spending Increase',
    description: 'Major increase in defense spending benefits technology and manufacturing sectors.',
    type: 'political',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'CLOUD', 'AUTO'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '136',
    title: 'Social Security Reform',
    description: 'Social Security reform proposals create uncertainty for financial services sector.',
    type: 'political',
    sentiment: 'mixed',
    affectedStocks: ['FINX'],
    impact: 'low',
    duration: 'medium'
  },
  {
    id: '137',
    title: 'Antitrust Enforcement Increase',
    description: 'Government increases antitrust enforcement, targeting large technology companies.',
    type: 'political',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '138',
    title: 'Consumer Protection Legislation',
    description: 'New consumer protection legislation increases compliance costs for financial services.',
    type: 'political',
    sentiment: 'negative',
    affectedStocks: ['FINX', 'RETAIL'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '139',
    title: 'Research & Development Tax Credits',
    description: 'Expanded R&D tax credits encourage innovation and technology investment.',
    type: 'political',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'BIO', 'MEDX', 'AUTO'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '140',
    title: 'Political Instability Abroad',
    description: 'Political instability in key trading partner countries disrupts supply chains.',
    type: 'political',
    sentiment: 'negative',
    affectedStocks: ['AUTO', 'SOLR', 'GREEN', 'CLOUD'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '141',
    title: 'Election Year Spending',
    description: 'Election year government spending increases boost economic activity across sectors.',
    type: 'political',
    sentiment: 'positive',
    affectedStocks: ['RETAIL', 'EDU', 'SOLR', 'GREEN'],
    impact: 'low',
    duration: 'short'
  },
  {
    id: '142',
    title: 'Lobbying Reform Impact',
    description: 'Lobbying reform reduces corporate influence on policy, creating uncertainty.',
    type: 'political',
    sentiment: 'neutral',
    affectedStocks: ['GLCR', 'EDU', 'SOLR', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'BIO', 'CLOUD', 'GREEN'],
    impact: 'low',
    duration: 'long'
  },
  {
    id: '143',
    title: 'Public-Private Partnership Initiative',
    description: 'Government launches major public-private partnership initiative for infrastructure.',
    type: 'political',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'CLOUD', 'AUTO'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '144',
    title: 'Regulatory Rollback',
    description: 'Administration rolls back environmental and financial regulations.',
    type: 'political',
    sentiment: 'mixed',
    affectedStocks: ['SOLR', 'GREEN', 'FINX'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '145',
    title: 'Voting Rights Legislation',
    description: 'Major voting rights legislation passed, increasing civic engagement and education demand.',
    type: 'political',
    sentiment: 'positive',
    affectedStocks: ['EDU'],
    impact: 'low',
    duration: 'long'
  },
  {
    id: '146',
    title: 'Campaign Promises Implementation',
    description: 'New administration begins implementing major campaign promises affecting multiple industries.',
    type: 'political',
    sentiment: 'mixed',
    affectedStocks: ['SOLR', 'GREEN', 'EDU', 'MEDX'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '147',
    title: 'Bipartisan Infrastructure Deal',
    description: 'Rare bipartisan infrastructure deal provides certainty for construction and technology sectors.',
    type: 'political',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'AUTO', 'CLOUD'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '148',
    title: 'Political Scandal Impact',
    description: 'Major political scandal creates uncertainty and potential policy reversals.',
    type: 'political',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'EDU', 'SOLR', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'BIO', 'CLOUD', 'GREEN'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '149',
    title: 'State Secession Threats',
    description: 'Threats of state secession create constitutional and economic uncertainty.',
    type: 'political',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'EDU', 'SOLR', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'BIO', 'CLOUD', 'GREEN'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '150',
    title: 'International Sanctions Imposed',
    description: 'Government imposes new international sanctions, affecting trade and supply chains.',
    type: 'political',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'AUTO', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'long'
  },

  // Social Movements & Cultural Events (151-180)
  {
    id: '151',
    title: 'Climate Activism Movement Surge',
    description: 'Massive climate activism movement pressures companies to adopt sustainable practices.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'AUTO'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '152',
    title: 'Social Media Boycott Campaign',
    description: 'Major social media boycott campaign targets companies over ethical concerns.',
    type: 'social',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'GLCR', 'CLOUD'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '153',
    title: 'Workers Rights Movement',
    description: 'Workers rights movement gains momentum, pushing for better wages and benefits.',
    type: 'social',
    sentiment: 'mixed',
    affectedStocks: ['RETAIL', 'AUTO', 'SOLR', 'GREEN'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '154',
    title: 'Digital Privacy Awareness',
    description: 'Increased public awareness of digital privacy drives demand for secure technology solutions.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '155',
    title: 'Education Equity Movement',
    description: 'Education equity movement drives increased investment in accessible online learning.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['EDU'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '156',
    title: 'Healthcare Access Protests',
    description: 'Massive protests demand universal healthcare access, highlighting need for affordable medical solutions.',
    type: 'social',
    sentiment: 'mixed',
    affectedStocks: ['MEDX', 'BIO'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '157',
    title: 'Racial Justice Movement Impact',
    description: 'Racial justice movement leads companies to invest in diversity and inclusion initiatives.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'EDU', 'FINX', 'CLOUD'],
    impact: 'low',
    duration: 'long'
  },
  {
    id: '158',
    title: 'Gender Pay Gap Awareness',
    description: 'Increased awareness of gender pay gaps leads to corporate policy changes and transparency.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'EDU', 'FINX', 'CLOUD', 'MEDX'],
    impact: 'low',
    duration: 'medium'
  },
  {
    id: '159',
    title: 'Mental Health Awareness Campaign',
    description: 'Major mental health awareness campaign increases demand for digital health and wellness solutions.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['MEDX', 'EDU'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '160',
    title: 'Sustainable Living Movement',
    description: 'Sustainable living movement drives consumer preference for eco-friendly products and services.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'AUTO'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '161',
    title: 'Tech Worker Unionization',
    description: 'Tech workers begin unionizing, potentially impacting labor costs and company culture.',
    type: 'social',
    sentiment: 'mixed',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '162',
    title: 'Student Debt Cancellation Movement',
    description: 'Student debt cancellation movement gains political traction, affecting education sector.',
    type: 'social',
    sentiment: 'mixed',
    affectedStocks: ['EDU', 'FINX'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '163',
    title: 'Remote Work Culture Shift',
    description: 'Cultural shift toward remote work becomes permanent, changing real estate and technology needs.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['CLOUD', 'GLCR', 'EDU'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '164',
    title: 'Cryptocurrency Adoption Wave',
    description: 'Massive cultural shift toward cryptocurrency adoption impacts traditional financial services.',
    type: 'social',
    sentiment: 'mixed',
    affectedStocks: ['FINX'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '165',
    title: 'Minimalism Movement Impact',
    description: 'Minimalism movement reduces consumer spending on non-essential goods.',
    type: 'social',
    sentiment: 'negative',
    affectedStocks: ['RETAIL'],
    impact: 'low',
    duration: 'medium'
  },
  {
    id: '166',
    title: 'Local Shopping Movement',
    description: 'Buy local movement gains momentum, impacting large retail chains.',
    type: 'social',
    sentiment: 'negative',
    affectedStocks: ['RETAIL'],
    impact: 'low',
    duration: 'medium'
  },
  {
    id: '167',
    title: 'Plant-Based Diet Trend',
    description: 'Plant-based diet trend accelerates, though not directly impacting current stock universe.',
    type: 'social',
    sentiment: 'neutral',
    affectedStocks: [],
    impact: 'low',
    duration: 'long'
  },
  {
    id: '168',
    title: 'Social Media Influencer Impact',
    description: 'Social media influencers drive massive shifts in consumer behavior and brand preferences.',
    type: 'social',
    sentiment: 'mixed',
    affectedStocks: ['RETAIL', 'EDU'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '169',
    title: 'Aging Population Demographics',
    description: 'Aging population demographics drive increased demand for healthcare and education services.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['MEDX', 'BIO', 'EDU'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '170',
    title: 'Gen Z Consumer Preferences',
    description: 'Gen Z consumer preferences shift toward sustainable and digital-first brands.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'EDU', 'FINX'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '171',
    title: 'Work-Life Balance Movement',
    description: 'Work-life balance movement leads to reduced work hours and increased demand for efficiency tools.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['CLOUD', 'GLCR', 'EDU'],
    impact: 'low',
    duration: 'medium'
  },
  {
    id: '172',
    title: 'Urbanization Trend Reversal',
    description: 'Reversal of urbanization trend as people move to suburbs and rural areas.',
    type: 'social',
    sentiment: 'mixed',
    affectedStocks: ['AUTO', 'RETAIL', 'CLOUD'],
    impact: 'low',
    duration: 'long'
  },
  {
    id: '173',
    title: 'Social Media Platform Migration',
    description: 'Mass migration from one social media platform to another creates opportunities and challenges.',
    type: 'social',
    sentiment: 'neutral',
    affectedStocks: ['GLCR', 'CLOUD'],
    impact: 'low',
    duration: 'short'
  },
  {
    id: '174',
    title: 'Content Creator Economy Boom',
    description: 'Content creator economy boom drives demand for education and financial services.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['EDU', 'FINX'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '175',
    title: 'Wellness and Self-Care Trend',
    description: 'Wellness and self-care trend increases demand for health and education services.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['MEDX', 'EDU'],
    impact: 'low',
    duration: 'long'
  },
  {
    id: '176',
    title: 'Social Justice Consumer Boycotts',
    description: 'Organized consumer boycotts target companies over social justice issues.',
    type: 'social',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'GLCR'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '177',
    title: 'Community Investment Movement',
    description: 'Community investment movement encourages local economic development and education.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['EDU', 'RETAIL'],
    impact: 'low',
    duration: 'long'
  },
  {
    id: '178',
    title: 'Digital Detox Movement',
    description: 'Digital detox movement gains traction, though technology remains essential for work.',
    type: 'social',
    sentiment: 'neutral',
    affectedStocks: ['GLCR', 'CLOUD'],
    impact: 'low',
    duration: 'short'
  },
  {
    id: '179',
    title: 'Intergenerational Wealth Transfer',
    description: 'Massive intergenerational wealth transfer begins, affecting financial services and education.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['FINX', 'EDU'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '180',
    title: 'Cultural Shift Toward Experiences',
    description: 'Cultural shift from owning goods to experiencing services benefits education and technology.',
    type: 'social',
    sentiment: 'positive',
    affectedStocks: ['EDU', 'CLOUD'],
    impact: 'low',
    duration: 'long'
  },

  // Environmental & Climate Events (181-200)
  {
    id: '181',
    title: 'Extreme Weather Event',
    description: 'Catastrophic extreme weather event disrupts supply chains and operations across multiple states.',
    type: 'environmental',
    sentiment: 'negative',
    affectedStocks: ['SOLR', 'GREEN', 'AUTO', 'RETAIL'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '182',
    title: 'Drought Conditions Worsen',
    description: 'Severe drought conditions impact agriculture and energy production, driving renewable energy demand.',
    type: 'environmental',
    sentiment: 'mixed',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '183',
    title: 'Wildfire Season Intensifies',
    description: 'Intensified wildfire season causes evacuations and disrupts business operations in affected regions.',
    type: 'environmental',
    sentiment: 'negative',
    affectedStocks: ['SOLR', 'GREEN', 'RETAIL'],
    impact: 'medium',
    duration: 'short'
  },
  {
    id: '184',
    title: 'Sea Level Rise Concerns',
    description: 'Accelerating sea level rise prompts massive investment in coastal infrastructure and relocation.',
    type: 'environmental',
    sentiment: 'negative',
    affectedStocks: ['SOLR', 'GREEN', 'CLOUD'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '185',
    title: 'Carbon Credit Market Expansion',
    description: 'Carbon credit market expansion creates new revenue streams for renewable energy companies.',
    type: 'environmental',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '186',
    title: 'Water Scarcity Crisis',
    description: 'Water scarcity crisis affects manufacturing and agriculture, driving efficiency investments.',
    type: 'environmental',
    sentiment: 'negative',
    affectedStocks: ['SOLR', 'GREEN', 'AUTO'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '187',
    title: 'Biodiversity Loss Awareness',
    description: 'Increased awareness of biodiversity loss drives corporate sustainability initiatives.',
    type: 'environmental',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'low',
    duration: 'medium'
  },
  {
    id: '188',
    title: 'Renewable Energy Storage Breakthrough',
    description: 'Major breakthrough in renewable energy storage technology makes solar and wind more viable.',
    type: 'environmental',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '189',
    title: 'Plastic Pollution Regulations',
    description: 'Strict plastic pollution regulations impact manufacturing and retail packaging.',
    type: 'environmental',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'AUTO'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '190',
    title: 'Electric Vehicle Infrastructure Expansion',
    description: 'Massive expansion of electric vehicle charging infrastructure accelerates EV adoption.',
    type: 'environmental',
    sentiment: 'positive',
    affectedStocks: ['AUTO', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '191',
    title: 'Air Quality Regulations Tighten',
    description: 'Tightened air quality regulations require significant investments in clean technology.',
    type: 'environmental',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'AUTO'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '192',
    title: 'Ocean Acidification Impact',
    description: 'Ocean acidification affects marine industries, though impact on current stocks is indirect.',
    type: 'environmental',
    sentiment: 'negative',
    affectedStocks: [],
    impact: 'low',
    duration: 'long'
  },
  {
    id: '193',
    title: 'Circular Economy Movement',
    description: 'Circular economy movement gains momentum, requiring companies to redesign products and services.',
    type: 'environmental',
    sentiment: 'mixed',
    affectedStocks: ['RETAIL', 'AUTO', 'SOLR', 'GREEN'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '194',
    title: 'Green Building Standards Mandate',
    description: 'Mandatory green building standards drive demand for renewable energy and efficiency solutions.',
    type: 'environmental',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'CLOUD'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '195',
    title: 'Climate Migration Begins',
    description: 'Climate migration begins as people relocate from affected areas, impacting local economies.',
    type: 'environmental',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'EDU'],
    impact: 'low',
    duration: 'long'
  },
  {
    id: '196',
    title: 'Renewable Energy Cost Parity',
    description: 'Renewable energy reaches cost parity with fossil fuels, accelerating adoption.',
    type: 'environmental',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '197',
    title: 'Environmental Justice Movement',
    description: 'Environmental justice movement demands equitable distribution of environmental benefits and burdens.',
    type: 'environmental',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'low',
    duration: 'long'
  },
  {
    id: '198',
    title: 'Forest Conservation Initiatives',
    description: 'Major forest conservation initiatives create carbon offset opportunities.',
    type: 'environmental',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'low',
    duration: 'long'
  },
  {
    id: '199',
    title: 'Pollution Monitoring Technology',
    description: 'Advanced pollution monitoring technology enables better environmental compliance and transparency.',
    type: 'environmental',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'CLOUD'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '200',
    title: 'Climate Adaptation Investment',
    description: 'Massive investment in climate adaptation infrastructure creates opportunities for technology and construction.',
    type: 'environmental',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'CLOUD'],
    impact: 'high',
    duration: 'long'
  },

  // Geopolitical Events (201-220)
  {
    id: '201',
    title: 'International Trade War Escalation',
    description: 'Trade war escalates with new tariffs and counter-tariffs affecting global supply chains.',
    type: 'geopolitical',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'AUTO', 'SOLR', 'GREEN'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '202',
    title: 'Diplomatic Crisis',
    description: 'Major diplomatic crisis between key trading partners disrupts international business.',
    type: 'geopolitical',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'AUTO'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '203',
    title: 'International Sanctions Package',
    description: 'Coordinated international sanctions package targets specific countries and industries.',
    type: 'geopolitical',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'AUTO', 'SOLR'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '204',
    title: 'Regional Conflict Escalation',
    description: 'Regional conflict escalates, creating uncertainty and disrupting supply chains.',
    type: 'geopolitical',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'AUTO', 'SOLR', 'GREEN'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '205',
    title: 'Multilateral Trade Agreement',
    description: 'New multilateral trade agreement reduces barriers and opens new markets.',
    type: 'geopolitical',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'AUTO', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '206',
    title: 'Currency War Begins',
    description: 'Currency devaluation competition begins, impacting international trade and investments.',
    type: 'geopolitical',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '207',
    title: 'International Cybersecurity Alliance',
    description: 'International cybersecurity alliance formed to combat cyber threats, benefiting tech companies.',
    type: 'geopolitical',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '208',
    title: 'Resource Nationalization',
    description: 'Key resource-producing countries nationalize industries, disrupting global supply chains.',
    type: 'geopolitical',
    sentiment: 'negative',
    affectedStocks: ['SOLR', 'GREEN', 'AUTO'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '209',
    title: 'International Space Race',
    description: 'Renewed international space race drives investment in technology and innovation.',
    type: 'geopolitical',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'CLOUD'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '210',
    title: 'Refugee Crisis Impact',
    description: 'Major refugee crisis creates humanitarian and economic challenges in affected regions.',
    type: 'geopolitical',
    sentiment: 'negative',
    affectedStocks: ['EDU', 'MEDX'],
    impact: 'low',
    duration: 'medium'
  },
  {
    id: '211',
    title: 'International Aid Package',
    description: 'Massive international aid package supports development and infrastructure projects.',
    type: 'geopolitical',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'EDU'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '212',
    title: 'Border Dispute Escalation',
    description: 'Border dispute escalates between neighboring countries, disrupting regional trade.',
    type: 'geopolitical',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'AUTO'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '213',
    title: 'International Climate Accord',
    description: 'New international climate accord commits countries to aggressive emissions reductions.',
    type: 'geopolitical',
    sentiment: 'positive',
    affectedStocks: ['SOLR', 'GREEN', 'AUTO'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '214',
    title: 'Technology Export Restrictions',
    description: 'Technology export restrictions imposed on sensitive technologies, affecting global supply chains.',
    type: 'geopolitical',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'AUTO'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '215',
    title: 'International Data Sharing Agreement',
    description: 'New international data sharing agreement facilitates cross-border business operations.',
    type: 'geopolitical',
    sentiment: 'positive',
    affectedStocks: ['CLOUD', 'FINX', 'GLCR'],
    impact: 'medium',
    duration: 'long'
  },
  {
    id: '216',
    title: 'Regional Economic Union',
    description: 'New regional economic union formed, reducing trade barriers and harmonizing regulations.',
    type: 'geopolitical',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'AUTO', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '217',
    title: 'International Banking Crisis',
    description: 'International banking crisis spreads, affecting financial services and credit markets.',
    type: 'geopolitical',
    sentiment: 'negative',
    affectedStocks: ['FINX'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '218',
    title: 'Global Supply Chain Restructuring',
    description: 'Companies restructure global supply chains to reduce geopolitical risk.',
    type: 'geopolitical',
    sentiment: 'mixed',
    affectedStocks: ['AUTO', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '219',
    title: 'International Patent Dispute',
    description: 'Major international patent dispute affects technology companies across borders.',
    type: 'geopolitical',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'MEDX'],
    impact: 'medium',
    duration: 'medium'
  },
  {
    id: '220',
    title: 'Peace Agreement Signed',
    description: 'Major peace agreement signed, reducing geopolitical tensions and boosting confidence.',
    type: 'geopolitical',
    sentiment: 'positive',
    affectedStocks: ['GLCR', 'EDU', 'SOLR', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'BIO', 'CLOUD', 'GREEN'],
    impact: 'high',
    duration: 'medium'
  },
  // Additional Negative Scenarios (221-250)
  {
    id: '221',
    title: 'Major Data Breach at Glacier Tech',
    description: 'GLCR announces massive data breach affecting millions of users, triggering regulatory investigations.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '222',
    title: 'Solar Energy Co Factory Fire',
    description: 'SOLR reports major factory fire destroying production facilities, halting manufacturing for months.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['SOLR'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '223',
    title: 'MedTech Solutions Product Recall',
    description: 'MEDX issues urgent recall of flagship medical device after safety concerns, facing potential lawsuits.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['MEDX', 'BIO'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '224',
    title: 'FinTech Innovations Regulatory Fine',
    description: 'FINX hit with $500M regulatory fine for compliance violations, stock plummets on news.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['FINX'],
    impact: 'high',
    duration: 'immediate'
  },
  {
    id: '225',
    title: 'AutoDrive Systems Fatal Accident',
    description: 'AUTO autonomous vehicle involved in fatal accident, raising safety concerns and regulatory scrutiny.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['AUTO'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '226',
    title: 'RetailMax Corp Bankruptcy Rumors',
    description: 'RETAIL faces bankruptcy rumors as major creditors call in loans, supply chain collapses.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['RETAIL'],
    impact: 'extreme',
    duration: 'short'
  },
  {
    id: '227',
    title: 'BioGen Labs Drug Trial Failure',
    description: 'BIO announces Phase 3 trial failure for lead drug candidate, stock crashes 40% in pre-market.',
    type: 'earnings',
    sentiment: 'negative',
    affectedStocks: ['BIO', 'MEDX'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '228',
    title: 'CloudScale Inc Service Outage',
    description: 'CLOUD experiences catastrophic multi-day service outage, losing major enterprise customers.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['CLOUD', 'GLCR'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '229',
    title: 'GreenPower Energy Project Cancellation',
    description: 'GREEN loses $2B government contract, major renewable energy project cancelled indefinitely.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['GREEN', 'SOLR'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '230',
    title: 'EduLearn Inc Accreditation Loss',
    description: 'EDU loses accreditation for key programs, enrollment plummets as students transfer out.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['EDU'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '231',
    title: 'Technology Sector Antitrust Investigation',
    description: 'Government launches broad antitrust investigation into tech sector, targeting major players.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '232',
    title: 'Healthcare Sector Price Controls',
    description: 'New legislation imposes strict price controls on healthcare products, crushing profit margins.',
    type: 'political',
    sentiment: 'negative',
    affectedStocks: ['MEDX', 'BIO'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '233',
    title: 'Energy Sector Tax Hikes',
    description: 'Government announces massive tax increases on energy companies, reducing profitability.',
    type: 'political',
    sentiment: 'negative',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '234',
    title: 'Automotive Industry Trade War',
    description: 'Trade war escalates, imposing 50% tariffs on automotive imports and components.',
    type: 'geopolitical',
    sentiment: 'negative',
    affectedStocks: ['AUTO'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '235',
    title: 'Consumer Spending Collapse',
    description: 'Consumer confidence plummets, retail spending drops 30% as recession fears mount.',
    type: 'macro',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'AUTO', 'EDU'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '236',
    title: 'Major Cyberattack on Financial Sector',
    description: 'Coordinated cyberattack targets financial infrastructure, causing widespread disruption.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['FINX', 'CLOUD'],
    impact: 'extreme',
    duration: 'short'
  },
  {
    id: '237',
    title: 'Supply Chain Catastrophe',
    description: 'Global supply chain breakdown affects manufacturing, causing production halts across industries.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['AUTO', 'RETAIL', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '238',
    title: 'Interest Rate Shock',
    description: 'Central bank raises rates by 2% unexpectedly, crushing growth stocks and tech companies.',
    type: 'macro',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX', 'AUTO'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '239',
    title: 'Market Crash - Flash Crash',
    description: 'Flash crash triggers circuit breakers, panic selling across all sectors.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'EDU', 'SOLR', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'BIO', 'CLOUD', 'GREEN'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '240',
    title: 'CEO Resignation Scandal',
    description: 'Multiple tech CEOs resign amid scandal, creating leadership vacuum and uncertainty.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX'],
    impact: 'high',
    duration: 'short'
  },
  {
    id: '241',
    title: 'Environmental Disaster',
    description: 'Major environmental disaster linked to energy companies, triggering massive lawsuits.',
    type: 'environmental',
    sentiment: 'negative',
    affectedStocks: ['SOLR', 'GREEN'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '242',
    title: 'Education Budget Cuts',
    description: 'Government slashes education funding, devastating online education providers.',
    type: 'political',
    sentiment: 'negative',
    affectedStocks: ['EDU'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '243',
    title: 'Healthcare Reimbursement Cuts',
    description: 'Medicare and insurance companies slash reimbursement rates, crushing healthcare profits.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['MEDX', 'BIO'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '244',
    title: 'Retail Apocalypse',
    description: 'E-commerce disruption accelerates, traditional retail faces existential crisis.',
    type: 'sector',
    sentiment: 'negative',
    affectedStocks: ['RETAIL'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '245',
    title: 'Technology Bubble Burst',
    description: 'AI and tech bubble bursts as valuations collapse, sector-wide selloff.',
    type: 'sector',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '246',
    title: 'Credit Crunch',
    description: 'Credit markets freeze, companies unable to access capital for operations and growth.',
    type: 'macro',
    sentiment: 'negative',
    affectedStocks: ['FINX', 'AUTO', 'RETAIL', 'SOLR', 'GREEN'],
    impact: 'extreme',
    duration: 'short'
  },
  {
    id: '247',
    title: 'Labor Strike',
    description: 'Major labor strike halts production at multiple manufacturing facilities.',
    type: 'social',
    sentiment: 'negative',
    affectedStocks: ['AUTO', 'SOLR', 'GREEN'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '248',
    title: 'Patent Expiration Wave',
    description: 'Key patents expire across healthcare sector, generic competition crushes margins.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['BIO', 'MEDX'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '249',
    title: 'Currency Devaluation',
    description: 'Major currency devaluation triggers inflation, crushing import-dependent companies.',
    type: 'macro',
    sentiment: 'negative',
    affectedStocks: ['AUTO', 'RETAIL', 'SOLR'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '250',
    title: 'Massive Short Selling Attack',
    description: 'Coordinated short selling attack targets multiple stocks, driving prices down rapidly.',
    type: 'technical',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'BIO', 'GREEN'],
    impact: 'extreme',
    duration: 'short'
  },
  // Extreme Negative Scenarios - Price Plummets (251-280)
  {
    id: '251',
    title: 'Bankruptcy Filing Announcement',
    description: 'Major tech company files for Chapter 11 bankruptcy protection, shocking investors and triggering massive sell-offs.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '252',
    title: 'CEO Arrested for Fraud',
    description: 'Company CEO arrested on charges of securities fraud and embezzlement. Trading halted pending investigation.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'BIO', 'MEDX'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '253',
    title: 'Complete Product Recall',
    description: 'Entire product line recalled due to safety concerns. Manufacturing halted indefinitely.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['AUTO', 'BIO', 'MEDX'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '254',
    title: 'Class Action Lawsuit Filed',
    description: 'Massive class action lawsuit filed alleging systematic fraud and misrepresentation to investors.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'BIO'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '255',
    title: 'SEC Investigation Launched',
    description: 'SEC launches formal investigation into accounting irregularities and potential securities violations.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['FINX', 'GLCR', 'CLOUD'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '256',
    title: 'Major Customer Exodus',
    description: 'Top 5 customers representing 60% of revenue terminate contracts simultaneously.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['CLOUD', 'GLCR', 'FINX'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '257',
    title: 'Toxic Chemical Spill',
    description: 'Major environmental disaster: toxic chemical spill contaminates local water supply. Company faces massive fines and shutdown.',
    type: 'environmental',
    sentiment: 'negative',
    affectedStocks: ['GREEN', 'SOLR', 'BIO'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '258',
    title: 'Complete Market Crash',
    description: 'Panic selling triggers circuit breakers. Market-wide crash affects all sectors.',
    type: 'macro',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'EDU', 'SOLR', 'BIO', 'MEDX', 'FINX', 'AUTO', 'RETAIL', 'GREEN'],
    impact: 'extreme',
    duration: 'short'
  },
  {
    id: '259',
    title: 'Hostile Takeover Attempt',
    description: 'Aggressive takeover bid threatens company independence. Management fights back, creating uncertainty.',
    type: 'merger',
    sentiment: 'negative',
    affectedStocks: ['BIO', 'MEDX', 'GREEN'],
    impact: 'high',
    duration: 'medium'
  },
  {
    id: '260',
    title: 'Massive Insider Trading Scandal',
    description: 'Multiple executives implicated in insider trading scheme. Regulatory action expected.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '261',
    title: 'Critical Software Vulnerability',
    description: 'Zero-day exploit discovered in core product. All customer data potentially compromised.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '262',
    title: 'Supply Chain Collapse',
    description: 'Primary supplier goes bankrupt. No alternative suppliers available. Production completely halted.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['AUTO', 'SOLR', 'GREEN'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '263',
    title: 'Government Contract Cancelled',
    description: 'Largest government contract worth billions cancelled due to performance issues.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'BIO'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '264',
    title: 'Competitor Launches Superior Product',
    description: 'Major competitor launches revolutionary product that makes current offerings obsolete.',
    type: 'product',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'AUTO'],
    impact: 'high',
    duration: 'long'
  },
  {
    id: '265',
    title: 'Massive Debt Default',
    description: 'Company defaults on major debt obligations. Credit rating downgraded to junk status.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['FINX', 'RETAIL', 'AUTO'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '266',
    title: 'Key Patent Invalidated',
    description: 'Court rules core patents invalid. Competitors can now copy technology freely.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['BIO', 'MEDX', 'GLCR'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '267',
    title: 'Massive Layoffs Announced',
    description: 'Company announces 50% workforce reduction. Market interprets as desperation move.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'RETAIL'],
    impact: 'high',
    duration: 'immediate'
  },
  {
    id: '268',
    title: 'Foreign Market Ban',
    description: 'Company banned from operating in largest foreign market due to regulatory violations.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'AUTO', 'RETAIL'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '269',
    title: 'Complete Product Failure',
    description: 'Flagship product completely fails in market. Sales drop to zero. No recovery plan.',
    type: 'product',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'AUTO'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '270',
    title: 'Massive Accounting Fraud Revealed',
    description: 'Internal audit reveals years of accounting fraud. Revenue inflated by 40%.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['FINX', 'GLCR', 'RETAIL'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '271',
    title: 'Natural Disaster Destroys Facilities',
    description: 'Hurricane/flood destroys primary manufacturing and data centers. Operations crippled.',
    type: 'environmental',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'AUTO', 'SOLR'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '272',
    title: 'Ransomware Attack Shuts Down Operations',
    description: 'Sophisticated ransomware attack encrypts all systems. Company cannot operate.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '273',
    title: 'Major Partnership Terminated',
    description: 'Strategic partnership worth billions terminated. No replacement available.',
    type: 'partnership',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'AUTO'],
    impact: 'high',
    duration: 'immediate'
  },
  {
    id: '274',
    title: 'Stock Delisting Threat',
    description: 'Exchange threatens delisting due to failure to meet listing requirements.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'GREEN', 'BIO'],
    impact: 'extreme',
    duration: 'medium'
  },
  {
    id: '275',
    title: 'Massive Product Liability Lawsuit',
    description: 'Class action lawsuit seeks billions in damages for product-related injuries.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['AUTO', 'BIO', 'MEDX'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '276',
    title: 'Key Executive Team Resigns',
    description: 'Entire C-suite resigns simultaneously. No succession plan in place.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'BIO'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '277',
    title: 'Complete Market Access Loss',
    description: 'Regulatory action bans company from all major markets. Revenue drops to zero.',
    type: 'regulatory',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '278',
    title: 'Massive Inventory Write-Down',
    description: 'Company writes down billions in inventory as worthless. Massive loss reported.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['RETAIL', 'AUTO', 'SOLR'],
    impact: 'extreme',
    duration: 'immediate'
  },
  {
    id: '279',
    title: 'Competitor Acquires Key Supplier',
    description: 'Major competitor acquires exclusive supplier. Company cut off from critical components.',
    type: 'merger',
    sentiment: 'negative',
    affectedStocks: ['AUTO', 'SOLR', 'GREEN'],
    impact: 'extreme',
    duration: 'long'
  },
  {
    id: '280',
    title: 'Total System Failure',
    description: 'Critical infrastructure failure causes complete operational shutdown. Recovery uncertain.',
    type: 'crisis',
    sentiment: 'negative',
    affectedStocks: ['GLCR', 'CLOUD', 'FINX'],
    impact: 'extreme',
    duration: 'medium'
  },
]

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find(s => s.id === id)
}

export function getScenariosByType(type: Scenario['type']): Scenario[] {
  return scenarios.filter(s => s.type === type)
}

export function getScenariosByStock(ticker: string): Scenario[] {
  return scenarios.filter(s => s.affectedStocks.includes(ticker))
}

