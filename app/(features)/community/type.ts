import { Room } from '@prisma/client'

export type RoomWithMembersAndMessages =
  | (Room & {
      members: { id: string; name: string; image: string }[]
      _count: { messages: number; members: number }
    })
  | null
