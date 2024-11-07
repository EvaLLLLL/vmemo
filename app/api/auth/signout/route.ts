import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const cookieStore = cookies()
        cookieStore.delete('token')

        return NextResponse.json(
            { message: 'Signed out successfully' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to logout' },
            { status: 500 }
        )
    }
}