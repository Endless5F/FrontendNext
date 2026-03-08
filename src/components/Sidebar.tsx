'use client'

import { useState, useEffect } from 'react'
import { Room, User, api } from '@/lib/api'

interface SidebarProps {
  rooms: Room[]
  currentRoom: Room | null
  user: User | null
  onSelectRoom: (room: Room) => void
  onCreateRoom: () => void
  onJoinRoom: (roomId: number) => void
  onLogout: () => void
}

export default function Sidebar({ rooms, currentRoom, user, onSelectRoom, onCreateRoom, onJoinRoom, onLogout }: SidebarProps) {
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [publicRooms, setPublicRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPublicRooms = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('auth-storage')
      const parsed = token ? JSON.parse(token) : null
      if (parsed?.state?.token) {
        const rooms = await api.chat.getPublicRooms(parsed.state.token)
        setPublicRooms(rooms.filter(r => !rooms.some(ur => ur.id === r.id)))
      }
    } catch (err) {
      console.error('获取公开房间失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (showJoinModal) {
      fetchPublicRooms()
    }
  }, [showJoinModal])

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Chat App</h2>
        <p className="text-sm text-gray-400 mt-1">{user?.username}</p>
      </div>

      <div className="p-3 border-b border-gray-700">
        <button
          onClick={onCreateRoom}
          className="w-full bg-primary-600 text-white py-2 px-3 rounded-md hover:bg-primary-700 transition-colors text-sm"
        >
          + 创建房间
        </button>
        <button
          onClick={() => setShowJoinModal(true)}
          className="w-full mt-2 bg-gray-700 text-white py-2 px-3 rounded-md hover:bg-gray-600 transition-colors text-sm"
        >
          加入房间
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-2">
          <h3 className="text-xs font-semibold text-gray-400 px-2 mb-2">我的房间</h3>
          {rooms.length === 0 ? (
            <p className="text-sm text-gray-500 px-2">暂无房间</p>
          ) : (
            <div className="space-y-1">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    currentRoom?.id === room.id
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium text-sm">{room.name}</div>
                  {room.description && (
                    <div className="text-xs text-gray-400 truncate">{room.description}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors text-sm"
        >
          退出登录
        </button>
      </div>

      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">加入公开房间</h3>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <p className="text-gray-500 text-center">加载中...</p>
              ) : publicRooms.length === 0 ? (
                <p className="text-gray-500 text-center">暂无可加入的公开房间</p>
              ) : (
                <div className="space-y-2">
                  {publicRooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-3 border border-gray-200 rounded-md hover:border-primary-500 cursor-pointer"
                      onClick={() => {
                        onJoinRoom(room.id)
                        setShowJoinModal(false)
                      }}
                    >
                      <div className="font-medium text-gray-800">{room.name}</div>
                      {room.description && (
                        <div className="text-sm text-gray-500">{room.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowJoinModal(false)}
              className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
