'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store'
import { api } from '@/lib/api'

type Mode = 'login' | 'register'

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { setAuth } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        await api.auth.register(username, email, password)
        const loginRes = await api.auth.login(username, password)
        const user = await api.auth.getMe(loginRes.access_token)
        setAuth(loginRes.access_token, user)
      } else {
        const loginRes = await api.auth.login(username, password)
        const user = await api.auth.getMe(loginRes.access_token)
        setAuth(loginRes.access_token, user)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex mb-6">
        <button
          type="button"
          onClick={() => { setMode('login'); setError('') }}
          className={`flex-1 py-2 text-center font-medium transition-colors ${
            mode === 'login'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          登录
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setError('') }}
          className={`flex-1 py-2 text-center font-medium transition-colors ${
            mode === 'register'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          注册
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            用户名
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="请输入用户名"
          />
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="请输入邮箱"
            />
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            密码
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="请输入密码"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
        </button>
      </form>
    </div>
  )
}
