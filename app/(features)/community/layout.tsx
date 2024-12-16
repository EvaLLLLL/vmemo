import { RoomList } from './components/room-list'

export default function CommunityLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full gap-4 overflow-hidden bg-primary/5 p-4">
      <div className="flex w-64 flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Chat Rooms</h2>
        </div>
        <RoomList />
      </div>

      {children}
    </div>
  )
}
