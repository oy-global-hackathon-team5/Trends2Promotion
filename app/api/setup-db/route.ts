import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // 테이블 생성 SQL
    const createTableSQL = `
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

      CREATE INDEX IF NOT EXISTS idx_promotions_country_code ON promotions(country_code);
      CREATE INDEX IF NOT EXISTS idx_promotions_plndp_no ON promotions(plndp_no);

      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS update_promotions_updated_at ON promotions;
      CREATE TRIGGER update_promotions_updated_at
      BEFORE UPDATE ON promotions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

      ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Enable read access for all users" ON promotions;
      CREATE POLICY "Enable read access for all users" ON promotions
        FOR SELECT USING (true);
    `

    // Supabase는 직접 SQL 실행을 지원하지 않으므로, RPC를 사용하거나
    // Supabase 관리자 API를 사용해야 합니다.
    // 대신 테이블이 이미 존재한다고 가정하고 데이터만 삽입합니다.

    // 기존 데이터 확인
    const { data: existingData } = await supabase
      .from('promotions')
      .select('id')
      .eq('plndp_no', '1958')
      .eq('country_code', 'USA')
      .limit(1)

    if (existingData && existingData.length > 0) {
      return NextResponse.json({
        success: false,
        message: '이미 plndp_no=1958, country_code=USA 데이터가 존재합니다.',
        data: existingData[0]
      })
    }

    // USA 기준 임시 데이터 삽입
    const { data, error } = await supabase
      .from('promotions')
      .insert({
        plndp_no: '1958',
        country_code: 'USA',
        title: 'BLACK FRIDAY MEGA SALE',
        description:
          'Our biggest sale of the year is here! Get up to 50% off on your favorite beauty and skincare products.',
        theme: 'Black Friday',
        hero_banner_image_url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop',
        detail_image_urls: [
          'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=2000&fit=crop',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=2000&fit=crop',
          'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=2000&fit=crop',
        ],
        products: {
          items: [
            {
              id: 'P001',
              name: 'Premium Hydrating Serum',
              price: 49.99,
              discount_price: 24.99,
              image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
              brand: 'Beauty Co',
              category: 'Skincare',
            },
            {
              id: 'P002',
              name: 'Anti-Aging Night Cream',
              price: 79.99,
              discount_price: 39.99,
              image_url: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
              brand: 'Glow Lab',
              category: 'Skincare',
            },
            {
              id: 'P003',
              name: 'Vitamin C Brightening Essence',
              price: 59.99,
              discount_price: 29.99,
              image_url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop',
              brand: 'Radiant Skin',
              category: 'Skincare',
            },
            {
              id: 'P004',
              name: 'Gentle Cleansing Foam',
              price: 32.99,
              discount_price: 16.49,
              image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
              brand: 'Pure Beauty',
              category: 'Skincare',
            },
            {
              id: 'P005',
              name: 'Intensive Eye Cream',
              price: 45.99,
              discount_price: 22.99,
              image_url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop',
              brand: 'Youthful Glow',
              category: 'Skincare',
            },
            {
              id: 'P006',
              name: 'SPF 50 Sunscreen',
              price: 38.99,
              discount_price: 19.49,
              image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
              brand: 'Sun Shield',
              category: 'Skincare',
            },
            {
              id: 'P007',
              name: 'Sheet Mask 5-Pack',
              price: 24.99,
              discount_price: 12.49,
              image_url: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
              brand: 'Hydration Plus',
              category: 'Skincare',
            },
            {
              id: 'P008',
              name: 'Overnight Repair Mask',
              price: 54.99,
              discount_price: 27.49,
              image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
              brand: 'Restore Beauty',
              category: 'Skincare',
            },
          ],
        },
        trend_keywords: ['black friday', 'sale', 'beauty', 'skincare', 'discount'],
      })
      .select()
      .single()

    if (error) {
      // 테이블이 없을 수 있으므로 에러 메시지 반환
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return NextResponse.json(
          {
            success: false,
            message:
              '테이블이 존재하지 않습니다. Supabase 대시보드의 SQL Editor에서 supabase/migrations/001_create_promotions_table.sql 파일의 내용을 실행해주세요.',
            error: error.message,
            code: error.code,
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          message: '데이터 삽입 실패',
          error: error.message,
          code: error.code,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'USA 기준 임시 데이터가 성공적으로 생성되었습니다!',
      data: data,
    })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류'
    return NextResponse.json(
      {
        success: false,
        message: '데이터베이스 설정 실패',
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}

