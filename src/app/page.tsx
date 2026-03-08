'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import AuthForm from '@/components/AuthForm'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/chat')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Chat App</h1>
          <p className="text-gray-600">实时聊天应用</p>
        </div>
        <AuthForm />
      </div>
    </main>
  )
}
