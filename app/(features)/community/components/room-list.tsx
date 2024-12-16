'use client'

import { useAuth } from '@/hooks/use-auth'
import { useChatRooms } from '@/hooks/use-chat-rooms'
import { cn } from '@/lib/utils'
import { useRouter, useParams } from 'next/navigation'

export const RoomList: React.FC = () => {
  const { user } = useAuth()
  const { rooms, joinRoom } = useChatRooms()
  const router = useRouter()
  const params = useParams()
  const roomId = params.roomId

  return (
    <div className="flex-1 space-y-2 overflow-y-auto rounded-lg bg-card p-2">
      {rooms?.map((room) => (
        <div
          key={room.id}
          onClick={() => router.push(`/community/${room.id}`)}
          className={cn(
            'w-full rounded-lg p-2 cursor-pointer text-left transition-colors hover:bg-primary/30 dark:text-gray-100',
            room.id === roomId && 'bg-primary/70 hover:bg-primary/60 text-white'
          )}>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{room.name}</div>
              {room.description && (
                <div className="text-sm opacity-80">{room.description}</div>
              )}
              <div className="mt-1 text-xs">
                {room._count.members} members · {room._count.messages} messages
              </div>
            </div>
            {room.members.some((member) => member.id === user?.id) ? (
              <button className="cursor-not-allowed rounded-lg bg-card px-2 py-1 text-xs text-gray-700 dark:text-gray-300">
                Joined
              </button>
            ) : (
              <button
                onClick={() => joinRoom(room.id)}
                className="rounded-lg bg-primary px-2 py-1 text-xs text-white hover:bg-primary/90">
                Join
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
