'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfigPage() {
  const router = useRouter()
  const [config, setConfig] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      // 检测是否在 Electron 环境中
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        // Electron 环境
        const result = await (window as any).electronAPI.readConfig()
        if (result.success) {
          setConfig(result.content)
        } else {
          setMessage({ type: 'error', text: '加载配置失败: ' + result.error })
        }
      } else {
        // 浏览器环境
        const response = await fetch('/api/config')
        const result = await response.json()
        if (result.success) {
          setConfig(result.content)
        } else {
          setMessage({ type: 'error', text: '加载配置失败: ' + result.error })
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: '加载配置失败: ' + error })
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      // 检测是否在 Electron 环境中
      if (typeof window !== 'undefined' && (window as any).electronAPI) {
        // Electron 环境
        const result = await (window as any).electronAPI.saveConfig(config)
        if (result.success) {
          setMessage({ type: 'success', text: '配置保存成功' })
          setTimeout(() => setMessage({ type: '', text: '' }), 2000)
        } else {
          setMessage({ type: 'error', text: '保存配置失败: ' + result.error })
        }
      } else {
        // 浏览器环境
        const response = await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: config }),
        })
        const result = await response.json()
        if (result.success) {
          setMessage({ type: 'success', text: '配置保存成功' })
          setTimeout(() => setMessage({ type: '', text: '' }), 2000)
        } else {
          setMessage({ type: 'error', text: '保存配置失败: ' + result.error })
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: '保存配置失败: ' + error })
    } finally {
      setSaving(false)
    }
  }

  const openConfigFolder = async () => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      await (window as any).electronAPI.openConfigFolder()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">配置管理</h1>
          <div className="flex space-x-3">
            {typeof window !== 'undefined' && (window as any).electronAPI && (
              <button
                onClick={openConfigFolder}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                打开配置文件夹
              </button>
            )}
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">config.ini</h2>
            <p className="text-sm text-gray-600">编辑配置文件，修改后点击保存按钮生效。</p>
          </div>

          <div className="mb-4">
            <textarea
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              className="w-full h-96 border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
              spellCheck={false}
            />
          </div>

          {message.text && (
            <div
              className={`mb-4 p-3 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={saveConfig}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存配置'}
            </button>
            <button
              onClick={loadConfig}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              重新加载
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">配置说明</h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
{`[config]
astro_export_dir = ./astro_export  # Astro 文件导出目录
sqlite_db_dir = ./data           # SQLite 数据库目录
draft_root_dir = ./drafts         # 草稿根目录
image_url_prefix =               # 图片 URL 前缀（可选）`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
