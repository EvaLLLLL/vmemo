import { useChatRooms } from '@/hooks/use-chat-rooms'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export const NewRoom = () => {
  const [showNewRoomModal, setShowNewRoomModal] = useState(false)

  const { createRoom } = useChatRooms()
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomDescription, setNewRoomDescription] = useState('')

  const handleCreateRoom = async () => {
    await createRoom({
      name: newRoomName,
      description: newRoomDescription
    })

    setNewRoomName('')
    setNewRoomDescription('')
    setShowNewRoomModal(false)
  }

  return (
    <>
      <button
        onClick={() => setShowNewRoomModal(true)}
        className="rounded-full p-1 hover:bg-primary/10">
        <Plus className="size-5" />
      </button>

      {/* New room modal */}
      {showNewRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Create New Room</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none"
                  placeholder="Enter room name"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description (optional)
                </label>
                <textarea
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-primary focus:outline-none"
                  placeholder="Enter room description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewRoomModal(false)}
                  className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">
                  Cancel
                </button>
                <button
                  onClick={handleCreateRoom}
                  disabled={!newRoomName.trim()}
                  className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
                  Create Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
