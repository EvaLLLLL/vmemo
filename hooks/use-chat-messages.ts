import { MessageServices } from '@/lib/services'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useChatMessages = (roomId?: string) => {
  const {
    data: messages,
    isLoading,
    refetch
  } = useQuery({
    queryKey: [MessageServices.getMessages.key, roomId],
    queryFn: () => MessageServices.getMessages.fn(roomId!),
    select: (data) => data.data,
    enabled: !!roomId,
    refetchInterval: 10000
  })

  const { mutate: sendMessage } = useMutation({
    mutationKey: [MessageServices.sendMessage.key],
    mutationFn: MessageServices.sendMessage.fn,
    onSuccess: () => refetch()
  })

  return { messages, isLoading, sendMessage }
}
