'use client'

import { useRef, useState, useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/use-auth'
import { useChatMessages } from '@/hooks/use-chat-messages'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useChatRooms } from '@/hooks/use-chat-rooms'
import { useParams } from 'next/navigation'

export const RoomMessages: React.FC = () => {
  const { user } = useAuth()

  const params = useParams()
  const roomId = params.roomId as string

  const { room } = useChatRooms(roomId)
  const { messages, isLoading, sendMessage } = useChatMessages(roomId)

  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async () => {
    if (!roomId || isSending) return

    try {
      setIsSending(true)
      await sendMessage({
        content: newMessage,
        roomId
      })

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
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
    if (roomId) {
      shouldScrollRef.current = true
      scrollToBottom(true)
    }
  }, [roomId])

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
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-card">
      {room ? (
        <>
          <div className="border-b border-accent p-4">
            <h2 className="text-lg font-semibold">{room.name}</h2>
            {room.description && (
              <p className="text-sm text-gray-600">{room.description}</p>
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
                          : 'ml-2 bg-accent text-accent-foreground dark:bg-gray-700 dark:text-gray-200'
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

          <div className="border-t border-accent p-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={newMessage}
                disabled={
                  !room ||
                  !room.members.find((member) => member.id === user?.id) ||
                  isSending
                }
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  !room.members.find((member) => member.id === user?.id)
                    ? 'Join the room to chat'
                    : 'Type your message...'
                }
                className="flex-1 rounded-lg border border-accent p-2 focus:border-primary focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
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
