import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = cookies()
    cookieStore.delete('token')

    return NextResponse.json(
      { message: 'logout successfully' },
      { status: 200 }
    )
  } catch (_) {
    return new NextResponse(JSON.stringify({ message: 'Failed to logout' }), {
      status: 500
    })
  }
}
