-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stocks table
CREATE TABLE stocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  sector VARCHAR(50) NOT NULL,
  volatility DECIMAL(5,2) NOT NULL,
  storyline TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenarios table
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  starting_balance DECIMAL(10,2) NOT NULL,
  stock_ids UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price data table (pre-computed prices for each scenario)
CREATE TABLE price_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  stock_id UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  UNIQUE(scenario_id, stock_id, day)
);

-- News items table
CREATE TABLE news_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  headline VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('good', 'bad', 'rumor', 'macro', 'sector')),
  affected_stocks UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading sessions table
CREATE TABLE trading_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  scenario_id UUID NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  current_day INTEGER NOT NULL DEFAULT 1,
  cash_balance DECIMAL(10,2) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  final_balance DECIMAL(10,2),
  ai_feedback TEXT
);

-- Trades table
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES trading_sessions(id) ON DELETE CASCADE,
  stock_id UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('buy', 'sell', 'short', 'cover')),
  shares INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  day INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_price_data_scenario_stock ON price_data(scenario_id, stock_id, day);
CREATE INDEX idx_news_scenario_day ON news_items(scenario_id, day);
CREATE INDEX idx_trades_session ON trades(session_id);
CREATE INDEX idx_trading_sessions_user ON trading_sessions(user_id);
CREATE INDEX idx_trading_sessions_scenario ON trading_sessions(scenario_id);

