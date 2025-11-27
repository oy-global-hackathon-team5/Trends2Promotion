import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ error: 'SQL query is required' }, { status: 400 })
    }

    // Supabase Management API를 사용하여 SQL 실행
    // 참고: 이 방법은 서비스 키가 필요하며, 프로덕션에서는 사용하지 않는 것이 좋습니다.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceKey) {
      return NextResponse.json(
        {
          error:
            'SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. Supabase Management API를 사용하려면 서비스 키가 필요합니다.',
          message:
            '대신 Supabase 대시보드의 SQL Editor에서 직접 실행하거나, Supabase CLI를 사용하세요.',
        },
        { status: 500 }
      )
    }

    // Supabase Management API를 통한 SQL 실행
    // 참고: 이 API는 프로젝트 설정에 따라 다를 수 있습니다.
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseServiceKey,
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({ query: sql }),
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error: 'SQL execution failed', details: error }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to execute SQL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

