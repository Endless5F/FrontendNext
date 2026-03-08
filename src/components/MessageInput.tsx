'use client'

import { useState, KeyboardEvent } from 'react'

interface MessageInputProps {
  onSend: (content: string) => void
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    const trimmed = message.trim()
    if (trimmed) {
      onSend(trimmed)
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </div>
    </div>
  )
}
