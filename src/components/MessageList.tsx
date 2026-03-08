'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/lib/api'

interface MessageListProps {
  messages: Message[]
  currentUserId?: number
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          暂无消息，开始聊天吧！
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwn = message.user_id === currentUserId
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {!isOwn && (
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      {message.username}
                    </div>
                  )}
                  <div className="text-sm">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-primary-200' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(message.created_at)}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}
