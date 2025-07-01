-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(20) DEFAULT 'free' NOT NULL CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  api_key VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversions table
CREATE TABLE conversions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_size INTEGER NOT NULL,
  cleaned_size INTEGER NOT NULL,
  processing_time REAL NOT NULL,
  cleanup_level VARCHAR(20) NOT NULL CHECK (cleanup_level IN ('basic', 'moderate', 'aggressive')),
  options JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_api_key ON users(api_key);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_conversions_user_id ON conversions(user_id);
CREATE INDEX idx_conversions_created_at ON conversions(created_at);
CREATE INDEX idx_conversions_user_created ON conversions(user_id, created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;

-- RLS policy for users (users can only see their own data)
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- RLS policy for conversions (users can only see their own conversions)
CREATE POLICY "Users can view their own conversions" ON conversions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own conversions" ON conversions
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Insert some sample data for testing
INSERT INTO users (email, plan, api_key) VALUES 
('demo@example.com', 'free', 'wth_demo_key_for_testing_only'),
('pro@example.com', 'pro', 'wth_pro_key_for_testing_only');

-- Create view for user statistics
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.email,
    u.plan,
    COUNT(c.id) as total_conversions,
    COALESCE(SUM(c.original_size), 0) as total_original_size,
    COALESCE(SUM(c.cleaned_size), 0) as total_cleaned_size,
    COALESCE(AVG(c.processing_time), 0) as avg_processing_time,
    u.created_at
FROM users u
LEFT JOIN conversions c ON u.id = c.user_id
GROUP BY u.id, u.email, u.plan, u.created_at; 