'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, useChatStore } from '@/store'
import { api, createWebSocket, Message, Room } from '@/lib/api'
import Sidebar from './Sidebar'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import CreateRoomModal from './CreateRoomModal'

export default function ChatPage() {
  const router = useRouter()
  const { token, user, isAuthenticated, logout } = useAuthStore()
  const { rooms, currentRoom, messages, setRooms, setCurrentRoom, setMessages, addMessage, addRoom } = useChatStore()
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [loading, setLoading] = useState(true)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }

    const fetchData = async () => {
      try {
        const roomsData = await api.chat.getRooms(token!)
        setRooms(roomsData)
        if (roomsData.length > 0) {
          setCurrentRoom(roomsData[0])
        }
      } catch (err) {
        console.error('获取房间失败:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, token, router, setRooms, setCurrentRoom])

  useEffect(() => {
    if (!currentRoom || !token) return

    const fetchMessages = async () => {
      try {
        const messagesData = await api.chat.getMessages(token, currentRoom.id)
        setMessages(messagesData)
      } catch (err) {
        console.error('获取消息失败:', err)
      }
    }

    fetchMessages()

    if (wsRef.current) {
      wsRef.current.close()
    }

    const ws = createWebSocket(currentRoom.id, token)
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'message') {
        addMessage({
          id: data.id,
          content: data.content,
          user_id: data.user_id,
          room_id: data.room_id,
          username: data.username,
          created_at: data.created_at,
        })
      }
    }
    wsRef.current = ws

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [currentRoom, token, setMessages, addMessage])

  const handleSendMessage = (content: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'message',
        content,
      }))
    }
  }

  const handleCreateRoom = async (name: string, description: string, isPrivate: boolean) => {
    try {
      const newRoom = await api.chat.createRoom(token!, name, description, isPrivate)
      addRoom(newRoom)
      setCurrentRoom(newRoom)
      setShowCreateRoom(false)
    } catch (err) {
      console.error('创建房间失败:', err)
    }
  }

  const handleJoinRoom = async (roomId: number) => {
    try {
      await api.chat.joinRoom(token!, roomId)
      const roomsData = await api.chat.getRooms(token!)
      setRooms(roomsData)
      const joinedRoom = roomsData.find(r => r.id === roomId)
      if (joinedRoom) {
        setCurrentRoom(joinedRoom)
      }
    } catch (err) {
      console.error('加入房间失败:', err)
    }
  }

  const handleLogout = () => {
    if (wsRef.current) {
      wsRef.current.close()
    }
    logout()
    router.push('/')
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      <Sidebar
        rooms={rooms}
        currentRoom={currentRoom}
        user={user}
        onSelectRoom={setCurrentRoom}
        onCreateRoom={() => setShowCreateRoom(true)}
        onJoinRoom={handleJoinRoom}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            <ChatHeader room={currentRoom} />
            <MessageList messages={messages} currentUserId={user?.id} />
            <MessageInput onSend={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">欢迎使用 Chat App</p>
              <p className="text-sm">选择一个房间开始聊天，或创建新房间</p>
            </div>
          </div>
        )}
      </div>

      {showCreateRoom && (
        <CreateRoomModal
          onClose={() => setShowCreateRoom(false)}
          onCreate={handleCreateRoom}
        />
      )}
    </div>
  )
}
