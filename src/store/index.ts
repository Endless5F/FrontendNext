import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  username: string
  email: string
  avatar?: string
  created_at: string
}

interface Room {
  id: number
  name: string
  description?: string
  is_private: boolean
  created_by: number
  created_at: string
}

interface Message {
  id: number
  content: string
  user_id: number
  room_id: number
  username: string
  created_at: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  logout: () => void
}

interface ChatState {
  rooms: Room[]
  currentRoom: Room | null
  messages: Message[]
  setRooms: (rooms: Room[]) => void
  setCurrentRoom: (room: Room | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  addRoom: (room: Room) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export const useChatStore = create<ChatState>((set) => ({
  rooms: [],
  currentRoom: null,
  messages: [],
  setRooms: (rooms) => set({ rooms }),
  setCurrentRoom: (room) => set({ currentRoom: room, messages: [] }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
}))
