export const dynamic = 'force-dynamic'

import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()

        if (!data?.name || !data?.email || !data?.password) {
            return new NextResponse(JSON.stringify({ message: "invalid fields" }))
        }

        const user = await prisma.user.findFirst({
            where: { name: data?.name }
        })

        if (user?.id) {
            return new NextResponse(JSON.stringify({ message: "user already exists" }), { status: 500 })
        }

        const hashedPassword = await hashPassword(data.password)

        await prisma.user.create({
            data: {
                name: data.name,
                password: hashedPassword,
                email: data.email
            }
        })
        return new NextResponse(JSON.stringify({ message: JSON.stringify({ message: "successfully register" }) }))
    } catch (e) {
        return new NextResponse(JSON.stringify({ message: JSON.stringify(e) }))
    }
}
