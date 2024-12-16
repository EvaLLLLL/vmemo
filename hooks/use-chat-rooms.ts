import { RoomServices } from '@/lib/services'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useChatRooms = (id?: string) => {
  const {
    data: rooms,
    isLoading,
    refetch
  } = useQuery({
    queryKey: [RoomServices.getRooms.key],
    queryFn: RoomServices.getRooms.fn,
    select: (data) => data.data
  })

  const room = useMemo(
    () => (id ? rooms?.find((room) => room.id === id) : null),
    [id, rooms]
  )

  const { mutate: createRoom } = useMutation({
    mutationKey: [RoomServices.createRoom.key],
    mutationFn: RoomServices.createRoom.fn,
    onSuccess: () => refetch()
  })

  const { mutate: joinRoom } = useMutation({
    mutationKey: [RoomServices.joinRoom.key],
    mutationFn: RoomServices.joinRoom.fn,
    onSuccess: () => refetch()
  })

  return { rooms, isLoading, createRoom, joinRoom, room }
}
