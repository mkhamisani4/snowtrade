-- Insert fictional stocks
INSERT INTO stocks (ticker, name, sector, volatility, storyline, base_price) VALUES
('GLCR', 'Glacier Tech', 'Technology', 0.35, 'AI-focused company with strong fundamentals but facing regulatory scrutiny', 125.50),
('SNOW', 'Snowflake Analytics', 'Technology', 0.28, 'Cloud data platform with growing enterprise adoption', 180.00),
('EDU', 'EduLearn Inc', 'Education', 0.22, 'Online education platform with strong enrollment trends', 45.75),
('SOLR', 'Solar Energy Co', 'Energy', 0.40, 'Renewable energy leader with overseas expansion risks', 32.25),
('MEDX', 'MedTech Solutions', 'Healthcare', 0.30, 'Medical device company with pending FDA approval', 78.90),
('FINX', 'FinTech Innovations', 'Financial', 0.33, 'Digital banking platform facing competition', 95.40),
('AUTO', 'AutoDrive Systems', 'Automotive', 0.38, 'Autonomous vehicle tech with partnership potential', 112.00),
('RETAIL', 'RetailMax Corp', 'Consumer', 0.25, 'E-commerce platform with supply chain challenges', 28.50),
('BIO', 'BioGen Labs', 'Healthcare', 0.45, 'Biotech firm with breakthrough drug trials', 156.75),
('CLOUD', 'CloudScale Inc', 'Technology', 0.27, 'Enterprise cloud infrastructure provider', 203.20),
('GREEN', 'GreenPower Energy', 'Energy', 0.42, 'Clean energy startup with government contracts', 19.80),
('GAME', 'GameVerse Studios', 'Entertainment', 0.50, 'Gaming company with viral hit potential', 67.30);

-- Insert scenarios
INSERT INTO scenarios (name, description, duration_days, starting_balance, stock_ids) VALUES
(
  'AI Bubble Week',
  'A week of intense AI hype and volatility. Tech stocks surge on AI announcements, but some may be overvalued.',
  10,
  10000.00,
  ARRAY[
    (SELECT id FROM stocks WHERE ticker = 'GLCR'),
    (SELECT id FROM stocks WHERE ticker = 'SNOW'),
    (SELECT id FROM stocks WHERE ticker = 'CLOUD'),
    (SELECT id FROM stocks WHERE ticker = 'FINX')
  ]::UUID[]
),
(
  'Interest Rate Hike',
  'The Fed announces unexpected rate hikes. Financial and tech stocks react differently. Can you navigate the volatility?',
  12,
  10000.00,
  ARRAY[
    (SELECT id FROM stocks WHERE ticker = 'FINX'),
    (SELECT id FROM stocks WHERE ticker = 'SNOW'),
    (SELECT id FROM stocks WHERE ticker = 'RETAIL'),
    (SELECT id FROM stocks WHERE ticker = 'AUTO')
  ]::UUID[]
),
(
  'Earnings Miss & Panic',
  'Several companies miss earnings expectations. Market panic ensues. Some stocks may be oversold opportunities.',
  10,
  10000.00,
  ARRAY[
    (SELECT id FROM stocks WHERE ticker = 'EDU'),
    (SELECT id FROM stocks WHERE ticker = 'RETAIL'),
    (SELECT id FROM stocks WHERE ticker = 'MEDX'),
    (SELECT id FROM stocks WHERE ticker = 'GAME')
  ]::UUID[]
),
(
  'Meme Stock Pump',
  'Social media rumors drive wild price swings. Some stocks pump on viral tweets, others crash on FUD.',
  8,
  10000.00,
  ARRAY[
    (SELECT id FROM stocks WHERE ticker = 'GAME'),
    (SELECT id FROM stocks WHERE ticker = 'SOLR'),
    (SELECT id FROM stocks WHERE ticker = 'GREEN'),
    (SELECT id FROM stocks WHERE ticker = 'BIO')
  ]::UUID[]
);

-- Note: Price data and news items will be generated programmatically
-- based on scenario logic and AI generation


