import { useRef, useState, useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/use-auth'
import { RoomWithMembersAndMessages } from '../../type'
import { useChatMessages } from '@/hooks/use-chat-messages'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const MessagesList: React.FC<{
  selectedRoom: RoomWithMembersAndMessages
}> = ({ selectedRoom }) => {
  const { user } = useAuth()

  const { messages, isLoading, sendMessage } = useChatMessages(selectedRoom?.id)

  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = async () => {
    if (!selectedRoom?.id) return

    await sendMessage({
      content: newMessage,
      roomId: selectedRoom?.id
    })

    setNewMessage('')
  }

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const shouldScrollRef = useRef(true)

  const scrollToBottom = (force = false) => {
    const messagesContainer = messagesEndRef.current?.parentElement
    if (!messagesContainer) return

    const { scrollHeight, scrollTop, clientHeight } = messagesContainer
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

    if (force || isNearBottom) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }

  useEffect(() => {
    if (messages?.length) {
      scrollToBottom(true)
    }
  }, [messages])

  useEffect(() => {
    if (selectedRoom) {
      shouldScrollRef.current = true
      scrollToBottom(true)
    }
  }, [selectedRoom])

  useEffect(() => {
    const messagesContainer = messagesEndRef.current?.parentElement
    if (!messagesContainer) return

    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = messagesContainer
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      shouldScrollRef.current = isNearBottom
    }

    messagesContainer.addEventListener('scroll', handleScroll)
    return () => messagesContainer.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-white">
      {selectedRoom ? (
        <>
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">{selectedRoom.name}</h2>
            {selectedRoom.description && (
              <p className="text-sm text-gray-600">
                {selectedRoom.description}
              </p>
            )}
          </div>

          <div
            ref={messagesEndRef}
            className="flex-1 space-y-4 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : messages?.length === 0 ? (
              <div className="flex items-center justify-center">
                <p className="text-gray-500">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              <>
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.userId === user?.id
                        ? 'justify-end'
                        : 'justify-start'
                    }`}>
                    {message.userId !== user?.id && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Avatar className="flex !size-8 cursor-pointer items-center justify-center rounded-full bg-primary/20">
                            {message.user.image && (
                              <AvatarImage
                                src={message.user.image}
                                alt={message.userName}
                              />
                            )}
                            <AvatarFallback>
                              {message.userName?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          align="center"
                          sideOffset={-8}
                          className="w-max rounded bg-gray-800 p-1 text-xs text-white">
                          {message.userName}
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <div
                      className={cn(
                        'max-w-[70%] rounded-lg p-3 break-words',
                        message.userId === user?.id
                          ? 'mr-2 bg-primary/80 text-white'
                          : 'ml-2 bg-gray-100 text-gray-800'
                      )}>
                      <div className="flex-wrap break-words">
                        {message.content}
                      </div>
                      <div className="mt-1 break-words text-xs opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    {message.userId === user?.id && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Avatar className="flex !size-8 cursor-pointer items-center justify-center rounded-full bg-primary/20">
                            {message.user.image && (
                              <AvatarImage
                                src={message.user.image}
                                alt={message.userName}
                              />
                            )}
                            <AvatarFallback>
                              {message.userName?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          align="center"
                          sideOffset={-8}
                          className="w-max rounded bg-gray-800 p-1 text-xs text-white">
                          {message.userName}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={newMessage}
                disabled={
                  !selectedRoom ||
                  !selectedRoom.members.find((member) => member.id === user?.id)
                }
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  !selectedRoom.members.find((member) => member.id === user?.id)
                    ? 'Join the room to chat'
                    : 'Type your message...'
                }
                className="flex-1 rounded-lg border border-gray-300 bg-white p-2 focus:border-primary focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">Select a room to start chatting</p>
        </div>
      )}
    </div>
  )
}
