# Supabase 테이블 설정 가이드

## 빠른 시작 (테이블 생성 + USA 샘플 데이터)

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. `supabase/setup_with_sample_data.sql` 파일의 **전체 내용**을 복사하여 SQL Editor에 붙여넣기
5. **Run** 버튼 클릭하여 실행

이 스크립트는 테이블 생성과 USA 기준 샘플 데이터 삽입을 한 번에 수행합니다.

## 수동 설정 (단계별)

### 1. Supabase 대시보드에서 테이블 생성

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. `supabase/migrations/001_create_promotions_table.sql` 파일의 내용을 복사하여 SQL Editor에 붙여넣기
5. **Run** 버튼 클릭하여 실행

또는 **Table Editor**에서 수동으로 테이블을 생성할 수도 있습니다.

### 2. 테스트 데이터 삽입 (선택사항)

테스트를 위해 샘플 데이터를 삽입할 수 있습니다:

```sql
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
  'https://example.com/black-friday-banner.jpg',
  ARRAY['https://example.com/detail1.jpg', 'https://example.com/detail2.jpg'],
  '{
    "items": [
      {
        "id": "P001",
        "name": "Hydrating Serum",
        "price": 49.99,
        "discount_price": 24.99,
        "image_url": "https://example.com/product1.jpg",
        "brand": "Beauty Co",
        "category": "Skincare"
      },
      {
        "id": "P002",
        "name": "Anti-Aging Cream",
        "price": 79.99,
        "discount_price": 39.99,
        "image_url": "https://example.com/product2.jpg",
        "brand": "Glow Lab",
        "category": "Skincare"
      }
    ]
  }'::jsonb,
  ARRAY['black friday', 'sale', 'beauty']
);
```

## 3. 확인

테이블이 정상적으로 생성되었는지 확인:

```sql
SELECT * FROM promotions;
```

## 4. RLS (Row Level Security) 확인

테이블이 생성되면 RLS가 활성화되어 있고, 모든 사용자가 읽기 접근이 가능합니다.

## 5. 프론트엔드 연동

테이블 생성 후 다음 페이지에서 데이터를 확인할 수 있습니다:

- **홈 페이지** (`/`): 국가별 최신 프로모션 히어로 배너 표시
- **디테일 페이지** (`/event/[plndpNo]`): 기획전 상세 이미지 및 상품 목록 표시

