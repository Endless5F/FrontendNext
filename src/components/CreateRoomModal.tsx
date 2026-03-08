'use client'

import { useState } from 'react'

interface CreateRoomModalProps {
  onClose: () => void
  onCreate: (name: string, description: string, isPrivate: boolean) => void
}

export default function CreateRoomModal({ onClose, onCreate }: CreateRoomModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onCreate(name.trim(), description.trim(), isPrivate)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">创建新房间</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              房间名称 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="输入房间名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              房间描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="输入房间描述（可选）"
              rows={3}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="private" className="ml-2 text-sm text-gray-700">
              私密房间（仅邀请可加入）
            </label>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
