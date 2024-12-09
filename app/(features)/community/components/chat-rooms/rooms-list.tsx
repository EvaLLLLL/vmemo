import { useAuth } from '@/hooks/use-auth'
import { useChatRooms } from '@/hooks/use-chat-rooms'
import { cn } from '@/lib/utils'
import { RoomWithMembersAndMessages } from '../../type'
export const RoomsList: React.FC<{
  selectedRoom: RoomWithMembersAndMessages
  setSelectedRoom: (room: RoomWithMembersAndMessages) => void
}> = ({ selectedRoom, setSelectedRoom }) => {
  const { user } = useAuth()
  const { rooms, joinRoom } = useChatRooms()

  return (
    <div className="flex-1 space-y-2 overflow-y-auto rounded-lg bg-white p-2">
      {rooms?.map((room) => (
        <div
          key={room.id}
          onClick={() => setSelectedRoom(room)}
          className={cn(
            'w-full rounded-lg p-2 cursor-pointer text-left transition-colors hover:bg-gray-100',
            selectedRoom?.id === room.id &&
              'bg-primary/70 hover:bg-primary/60 text-white'
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
              <button className="cursor-not-allowed rounded-lg bg-gray-300 px-2 py-1 text-xs text-gray-700">
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
