import prisma from '@/lib/prisma'
import { ApiResponse } from '@/app/api/responses/api-response'
import { checkAuth } from '@/lib/next-auth'

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            messages: true,
            members: true
          }
        }
      }
    })

    return ApiResponse.success(rooms)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return ApiResponse.apiError('Failed to fetch rooms')
  }
}

export async function PUT(req: Request) {
  try {
    const user = await checkAuth()

    const roomId = await req.json()

    if (!roomId) {
      return ApiResponse.badRequest('Room ID is required')
    }

    const room = await prisma.room.update({
      where: {
        id: roomId
      },
      data: {
        members: {
          connect: {
            id: user?.id as string
          }
        }
      }
    })

    return ApiResponse.success(room)
  } catch (error) {
    console.error('Error joining room:', error)
    return ApiResponse.apiError('Failed to join room')
  }
}

export async function POST(req: Request) {
  try {
    const user = await checkAuth()

    const { name, description } = await req.json()
    if (!name?.trim()) {
      return ApiResponse.badRequest('Room name is required')
    }

    const room = await prisma.room.create({
      data: {
        name,
        description,
        members: {
          connect: {
            id: user?.id as string
          }
        }
      }
    })

    return ApiResponse.success(room)
  } catch (error) {
    console.error('Error creating room:', error)
    return ApiResponse.apiError('Failed to create room')
  }
}
