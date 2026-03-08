const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface LoginResponse {
  access_token: string
  token_type: string
}

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

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: '请求失败' }))
    throw new Error(error.detail || '请求失败')
  }

  return response.json()
}

export const api = {
  auth: {
    register: (username: string, email: string, password: string) =>
      fetchAPI<User>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      }),

    login: async (username: string, password: string): Promise<LoginResponse> => {
      const formData = new URLSearchParams()
      formData.append('username', username)
      formData.append('password', password)

      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: '登录失败' }))
        throw new Error(error.detail || '登录失败')
      }

      return response.json()
    },

    getMe: (token: string) =>
      fetchAPI<User>('/api/auth/me', {}, token),
  },

  chat: {
    getRooms: (token: string) =>
      fetchAPI<Room[]>('/api/chat/rooms', {}, token),

    getPublicRooms: (token: string) =>
      fetchAPI<Room[]>('/api/chat/public-rooms', {}, token),

    createRoom: (token: string, name: string, description?: string, isPrivate: boolean = false) =>
      fetchAPI<Room>('/api/chat/rooms', {
        method: 'POST',
        body: JSON.stringify({ name, description, is_private: isPrivate }),
      }, token),

    joinRoom: (token: string, roomId: number) =>
      fetchAPI<{ message: string }>(`/api/chat/rooms/${roomId}/join`, {
        method: 'POST',
      }, token),

    getMessages: (token: string, roomId: number, limit: number = 50) =>
      fetchAPI<Message[]>(`/api/chat/rooms/${roomId}/messages?limit=${limit}`, {}, token),
  },
}

export const createWebSocket = (roomId: number, token: string): WebSocket => {
  const wsUrl = API_BASE.replace('http', 'ws')
  return new WebSocket(`${wsUrl}/ws/${roomId}?token=${token}`)
}

export type { User, Room, Message }
