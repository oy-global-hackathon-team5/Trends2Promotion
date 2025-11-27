This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Supabase MCP 설정

이 프로젝트는 Supabase MCP(Model Context Protocol)를 사용합니다.

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Supabase Configuration
# Supabase 프로젝트 URL (Supabase 대시보드에서 확인 가능)
SUPABASE_URL=your-supabase-project-url

# Supabase Access Token (Supabase 대시보드 > Settings > Access Tokens에서 생성)
SUPABASE_ACCESS_TOKEN=your-supabase-access-token

# Supabase Anon Key (클라이언트에서 사용)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Supabase 프로젝트 설정

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. Settings > API에서 Project URL과 anon key 확인
4. Settings > Access Tokens에서 새 토큰 생성

### MCP 서버 사용

MCP 설정은 `.cursor/mcp.json`에 구성되어 있습니다. Cursor를 재시작하면 Supabase MCP 서버가 자동으로 연결됩니다.

### Supabase 클라이언트 사용

프로젝트에서 Supabase 클라이언트를 사용하려면:

```typescript
import { supabase } from '@/lib/supabase'
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
