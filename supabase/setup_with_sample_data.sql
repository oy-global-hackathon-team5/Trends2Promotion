-- ============================================
-- Supabase 테이블 생성 및 USA 샘플 데이터 삽입
-- ============================================
-- 이 파일을 Supabase 대시보드 > SQL Editor에서 실행하세요
-- ============================================

-- 1. 테이블 생성
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

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_promotions_country_code ON promotions(country_code);
CREATE INDEX IF NOT EXISTS idx_promotions_plndp_no ON promotions(plndp_no);

-- 3. updated_at 자동 업데이트 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. 트리거 생성
DROP TRIGGER IF EXISTS update_promotions_updated_at ON promotions;
CREATE TRIGGER update_promotions_updated_at
BEFORE UPDATE ON promotions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 5. RLS (Row Level Security) 활성화
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- 6. RLS 정책 생성 (모든 사용자가 읽기 가능)
DROP POLICY IF EXISTS "Enable read access for all users" ON promotions;
CREATE POLICY "Enable read access for all users" ON promotions
  FOR SELECT USING (true);

-- 7. USA 기준 임시 데이터 삽입
INSERT INTO promotions (
  plndp_no,
  country_code,
  title,
  description,
  theme,
  hero_banner_image_url,
  detail_image_urls,
  products,
  trend_keywords
) VALUES (
  '1958',
  'USA',
  'BLACK FRIDAY MEGA SALE',
  'Our biggest sale of the year is here! Get up to 50% off on your favorite beauty and skincare products.',
  'Black Friday',
  'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop',
  ARRAY[
    'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=2000&fit=crop',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=2000&fit=crop',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=2000&fit=crop'
  ],
  '{
    "items": [
      {
        "id": "P001",
        "name": "Premium Hydrating Serum",
        "price": 49.99,
        "discount_price": 24.99,
        "image_url": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
        "brand": "Beauty Co",
        "category": "Skincare"
      },
      {
        "id": "P002",
        "name": "Anti-Aging Night Cream",
        "price": 79.99,
        "discount_price": 39.99,
        "image_url": "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop",
        "brand": "Glow Lab",
        "category": "Skincare"
      },
      {
        "id": "P003",
        "name": "Vitamin C Brightening Essence",
        "price": 59.99,
        "discount_price": 29.99,
        "image_url": "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop",
        "brand": "Radiant Skin",
        "category": "Skincare"
      },
      {
        "id": "P004",
        "name": "Gentle Cleansing Foam",
        "price": 32.99,
        "discount_price": 16.49,
        "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
        "brand": "Pure Beauty",
        "category": "Skincare"
      },
      {
        "id": "P005",
        "name": "Intensive Eye Cream",
        "price": 45.99,
        "discount_price": 22.99,
        "image_url": "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop",
        "brand": "Youthful Glow",
        "category": "Skincare"
      },
      {
        "id": "P006",
        "name": "SPF 50 Sunscreen",
        "price": 38.99,
        "discount_price": 19.49,
        "image_url": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
        "brand": "Sun Shield",
        "category": "Skincare"
      },
      {
        "id": "P007",
        "name": "Sheet Mask 5-Pack",
        "price": 24.99,
        "discount_price": 12.49,
        "image_url": "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop",
        "brand": "Hydration Plus",
        "category": "Skincare"
      },
      {
        "id": "P008",
        "name": "Overnight Repair Mask",
        "price": 54.99,
        "discount_price": 27.49,
        "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
        "brand": "Restore Beauty",
        "category": "Skincare"
      }
    ]
  }'::jsonb,
  ARRAY['black friday', 'sale', 'beauty', 'skincare', 'discount']
)
ON CONFLICT DO NOTHING;

-- 8. 데이터 확인
SELECT * FROM promotions WHERE country_code = 'USA';

