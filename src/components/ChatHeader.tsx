'use client'

import { Room } from '@/lib/api'

interface ChatHeaderProps {
  room: Room
}

export default function ChatHeader({ room }: ChatHeaderProps) {
  return (
    <div className="h-14 border-b border-gray-200 flex items-center px-4 bg-white">
      <div>
        <h2 className="font-semibold text-gray-800">{room.name}</h2>
        {room.description && (
          <p className="text-sm text-gray-500">{room.description}</p>
        )}
      </div>
    </div>
  )
}
