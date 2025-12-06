// Shared mock stock data - prices are consistent across all components

export interface Stock {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  chartData: number[]
  sector: string
  industry: string
  founded: number
  description: string
  headquarters: string
  employees: string
  keyProducts: string[]
}

export const mockStocks: Stock[] = [
  {
    ticker: 'GLCR',
    name: 'Glacier Tech',
    price: 178.20,
    change: 2.70,
    changePercent: 1.54,
    volume: 45234567,
    sector: 'Technology',
    chartData: [175, 176, 175.5, 177, 178, 178.2],
    industry: 'Artificial Intelligence & Machine Learning',
    founded: 2018,
    description: 'Glacier Tech is a leading AI software company specializing in enterprise machine learning solutions, natural language processing, and computer vision technologies. The company provides AI infrastructure and tools for businesses across various industries.',
    headquarters: 'San Francisco, CA',
    employees: '8,500',
    keyProducts: ['AI Cloud Platform', 'Enterprise ML Tools', 'NLP APIs', 'Computer Vision SDK']
  },
  {
    ticker: 'EDU',
    name: 'EduLearn Inc',
    price: 45.75,
    change: 1.25,
    changePercent: 2.81,
    volume: 12345678,
    sector: 'Education',
    chartData: [44, 44.5, 45, 45.2, 45.5, 45.75],
    industry: 'Online Education & E-Learning',
    founded: 2015,
    description: 'EduLearn Inc operates a comprehensive online learning platform offering courses, certifications, and degree programs. The company serves students, professionals, and enterprises with interactive educational content and learning management systems.',
    headquarters: 'Boston, MA',
    employees: '3,200',
    keyProducts: ['Learning Management System', 'Professional Certifications', 'Corporate Training', 'Student Portal']
  },
  {
    ticker: 'SOLR',
    name: 'Solar Energy Co',
    price: 32.25,
    change: -0.85,
    changePercent: -2.57,
    volume: 23456789,
    sector: 'Energy',
    chartData: [33, 32.8, 32.5, 32.3, 32.2, 32.25],
    industry: 'Renewable Energy - Solar Power',
    founded: 2012,
    description: 'Solar Energy Co designs, manufactures, and installs solar panel systems for residential, commercial, and utility-scale projects. The company also operates solar farms and provides energy storage solutions.',
    headquarters: 'Phoenix, AZ',
    employees: '12,000',
    keyProducts: ['Residential Solar Panels', 'Commercial Solar Systems', 'Solar Farms', 'Energy Storage Solutions']
  },
  {
    ticker: 'MEDX',
    name: 'MedTech Solutions',
    price: 142.50,
    change: 0.75,
    changePercent: 0.53,
    volume: 15678901,
    sector: 'Healthcare',
    chartData: [141, 141.5, 142, 142.2, 142.3, 142.5],
    industry: 'Medical Devices & Diagnostics',
    founded: 2010,
    description: 'MedTech Solutions develops and manufactures advanced medical devices, diagnostic equipment, and surgical instruments. The company focuses on minimally invasive procedures and point-of-care diagnostics.',
    headquarters: 'Minneapolis, MN',
    employees: '6,800',
    keyProducts: ['Surgical Instruments', 'Diagnostic Devices', 'Patient Monitoring Systems', 'Medical Imaging Equipment']
  },
  {
    ticker: 'FINX',
    name: 'FinTech Innovations',
    price: 95.40,
    change: -2.20,
    changePercent: -2.25,
    volume: 34567890,
    sector: 'Financial',
    chartData: [97, 96.5, 96, 95.5, 95.2, 95.4],
    industry: 'Digital Banking & Payment Solutions',
    founded: 2016,
    description: 'FinTech Innovations provides digital banking infrastructure, payment processing, and financial technology solutions for banks, credit unions, and fintech startups. The company offers APIs and white-label banking platforms.',
    headquarters: 'New York, NY',
    employees: '4,500',
    keyProducts: ['Digital Banking Platform', 'Payment Processing', 'Financial APIs', 'Mobile Banking Apps']
  },
  {
    ticker: 'AUTO',
    name: 'AutoDrive Systems',
    price: 112.00,
    change: 3.50,
    changePercent: 3.23,
    volume: 45678901,
    sector: 'Automotive',
    chartData: [108, 109, 110, 111, 111.5, 112],
    industry: 'Autonomous Vehicle Technology',
    founded: 2014,
    description: 'AutoDrive Systems develops autonomous driving software, sensors, and AI systems for self-driving vehicles. The company partners with automakers to integrate autonomous technology into passenger and commercial vehicles.',
    headquarters: 'Palo Alto, CA',
    employees: '9,200',
    keyProducts: ['Autonomous Driving Software', 'LiDAR Sensors', 'Vehicle AI Systems', 'Fleet Management Platform']
  },
  {
    ticker: 'RETAIL',
    name: 'RetailMax Corp',
    price: 28.50,
    change: 0.45,
    changePercent: 1.60,
    volume: 23456789,
    sector: 'Consumer',
    chartData: [28, 28.2, 28.3, 28.4, 28.45, 28.5],
    industry: 'E-Commerce & Retail Technology',
    founded: 2017,
    description: 'RetailMax Corp operates an e-commerce platform and provides retail technology solutions including inventory management, supply chain optimization, and omnichannel retail services for consumer goods companies.',
    headquarters: 'Seattle, WA',
    employees: '5,600',
    keyProducts: ['E-Commerce Platform', 'Inventory Management', 'Supply Chain Software', 'Retail Analytics']
  },
  {
    ticker: 'BIO',
    name: 'BioGen Labs',
    price: 156.75,
    change: -3.25,
    changePercent: -2.03,
    volume: 18765432,
    sector: 'Healthcare',
    chartData: [160, 159, 158, 157, 156.5, 156.75],
    industry: 'Biotechnology & Pharmaceuticals',
    founded: 2008,
    description: 'BioGen Labs is a biopharmaceutical company focused on developing innovative treatments for rare diseases, oncology, and neurological disorders. The company conducts clinical trials and manufactures specialty pharmaceuticals.',
    headquarters: 'Cambridge, MA',
    employees: '11,500',
    keyProducts: ['Oncology Drugs', 'Rare Disease Treatments', 'Neurological Therapies', 'Clinical Research Services']
  },
  {
    ticker: 'CLOUD',
    name: 'CloudScale Inc',
    price: 203.20,
    change: 5.20,
    changePercent: 2.63,
    volume: 32145678,
    sector: 'Technology',
    chartData: [198, 199, 200, 201, 202, 203.2],
    industry: 'Cloud Infrastructure & Services',
    founded: 2011,
    description: 'CloudScale Inc provides enterprise cloud computing infrastructure, data center services, and cloud management platforms. The company offers scalable cloud solutions for businesses of all sizes.',
    headquarters: 'Austin, TX',
    employees: '15,000',
    keyProducts: ['Cloud Infrastructure', 'Data Center Services', 'Cloud Management Platform', 'Enterprise Cloud Solutions']
  },
  {
    ticker: 'GREEN',
    name: 'GreenPower Energy',
    price: 19.80,
    change: 0.30,
    changePercent: 1.54,
    volume: 45678901,
    sector: 'Energy',
    chartData: [19.5, 19.6, 19.7, 19.75, 19.8, 19.8],
    industry: 'Clean Energy & Sustainability',
    founded: 2019,
    description: 'GreenPower Energy develops and operates renewable energy projects including wind farms, solar installations, and energy storage systems. The company focuses on sustainable energy solutions and carbon reduction initiatives.',
    headquarters: 'Denver, CO',
    employees: '2,800',
    keyProducts: ['Wind Energy Projects', 'Solar Installations', 'Energy Storage Systems', 'Carbon Offset Programs']
  },
]

export function getStockByTicker(ticker: string): Stock | undefined {
  return mockStocks.find(stock => stock.ticker === ticker)
}

