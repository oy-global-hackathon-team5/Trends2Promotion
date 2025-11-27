-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id BIGSERIAL PRIMARY KEY,
  plndp_no VARCHAR(50) NOT NULL,
  country_code VARCHAR(10) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  theme TEXT,
  hero_banner_image_url VARCHAR(500) NOT NULL,
  detail_image_urls TEXT[],
  products JSONB,
  trend_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_promotions_country_code ON promotions(country_code);
CREATE INDEX IF NOT EXISTS idx_promotions_plndp_no ON promotions(plndp_no);

-- Create function for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_promotions_updated_at ON promotions;
CREATE TRIGGER update_promotions_updated_at
BEFORE UPDATE ON promotions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security) - Allow read access for all
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON promotions
  FOR SELECT USING (true);

