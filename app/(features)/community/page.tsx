'use client'

import { useEffect, useState } from 'react'
import { RoomWithMembersAndMessages } from './type'
import { RoomsList } from './components/chat-rooms/rooms-list'
// import { NewRoom } from './components/chat-rooms/new-room'
import { MessagesList } from './components/chat-rooms/messages-list'
import { useChatRooms } from '@/hooks/use-chat-rooms'

export default function Community() {
  const { rooms } = useChatRooms()
  const [selectedRoom, setSelectedRoom] =
    useState<RoomWithMembersAndMessages>(null)

  useEffect(() => {
    if (!selectedRoom && rooms?.length) {
      setSelectedRoom(rooms[0])
    }
  }, [rooms, selectedRoom])

  return (
    <div className="flex h-full gap-4 overflow-hidden bg-primary/5 p-4">
      <div className="flex w-64 flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Chat Rooms</h2>
          {/* <NewRoom /> */}
        </div>
        <RoomsList
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
        />
      </div>

      <MessagesList selectedRoom={selectedRoom} />
    </div>
  )
}
