import prisma from '@/lib/prisma'
import { ApiResponse } from '@/app/api/responses/api-response'
import { checkAuth } from '../auth/check'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const roomId = searchParams.get('roomId')

    if (!roomId) {
      return ApiResponse.badRequest('Room ID is required')
    }

    const messages = await prisma.message.findMany({
      where: {
        roomId
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: 100,
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    return ApiResponse.success(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return ApiResponse.apiError('Failed to fetch messages')
  }
}

export async function POST(req: Request) {
  try {
    const user = await checkAuth()

    const { content, roomId } = await req.json()

    if (!content?.trim()) {
      return ApiResponse.badRequest('Message content is required')
    }

    if (!roomId) {
      return ApiResponse.badRequest('Room ID is required')
    }

    // Check if user is a member of the room
    const isMember = await prisma.room.findFirst({
      where: {
        id: roomId,
        members: {
          some: {
            id: user?.id as string
          }
        }
      }
    })

    if (!isMember) {
      return ApiResponse.forbidden('You are not a member of this room')
    }

    const message = await prisma.message.create({
      data: {
        content,
        roomId,
        userId: user?.id as string,
        userName: user?.name || 'Anonymous'
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    return ApiResponse.success(message)
  } catch (error) {
    console.error('Error creating message:', error)
    return ApiResponse.apiError('Failed to create message')
  }
}
