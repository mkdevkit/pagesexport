'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'

interface Category {
  id: number
  name_en: string
  name_zh: string
}

interface Tag {
  id: number
  name_en: string
  name_zh: string
}

interface Article {
  id: number
  directory: string
  title_en: string
  title_zh: string
  address: string
  thumbnail: string
  preview?: string
  description_en?: string
  description_zh?: string
  content?: string
  flag: 'draft' | 'published'
  categories?: Category[]
  tags?: Tag[]
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const id = parseInt(params.id as string)

  const [article, setArticle] = useState<Article | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    directory: '',
    title_en: '',
    title_zh: '',
    address: '',
    thumbnail: '',
    preview: '',
    description_en: '',
    description_zh: '',
    content: '',
    flag: 'draft' as 'draft' | 'published',
  })
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])

  useEffect(() => {
    fetchArticle()
    fetchCategories()
    fetchTags()
  }, [id])

  const fetchArticle = async () => {
    const response = await fetch(`/api/articles/${id}`)
    const result = await response.json()
    if (result.success) {
      setArticle(result.data)
      setFormData({
        directory: result.data.directory,
        title_en: result.data.title_en,
        title_zh: result.data.title_zh,
        address: result.data.address,
        thumbnail: result.data.thumbnail,
        preview: result.data.preview || '',
        description_en: result.data.description_en || '',
        description_zh: result.data.description_zh || '',
        content: result.data.content || '',
        flag: result.data.flag,
      })
      setSelectedCategories(result.data.categories?.map((c: Category) => c.id) || [])
      setSelectedTags(result.data.tags?.map((t: Tag) => t.id) || [])
    }
  }

  const fetchCategories = async () => {
    const response = await fetch('/api/categories')
    const result = await response.json()
    if (result.success) {
      setCategories(result.data)
    }
  }

  const fetchTags = async () => {
    const response = await fetch('/api/tags')
    const result = await response.json()
    if (result.success) {
      setTags(result.data)
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    if (!formData.directory) {
      throw new Error('请先填写目录名称')
    }

    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('directory', formData.directory)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formDataUpload,
    })
    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || '上传失败')
    }

    return result.data.url
  }

  const handleMdEditorImageUpload = async (): Promise<void> => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setUploading(true)
      try {
        const url = await handleImageUpload(file)
        const markdown = `
![${file.name}](${url})
`
        setFormData({ ...formData, content: formData.content + markdown })
      } catch (error) {
        alert(error instanceof Error ? error.message : '上传失败')
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }

  const handleFileUpload = async (field: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      setUploading(true)
      try {
        const url = await handleImageUpload(file)
        setFormData({ ...formData, [field]: url })
      } catch (error) {
        alert(error instanceof Error ? error.message : '上传失败')
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.directory || !formData.title_en || !formData.title_zh || !formData.address || !formData.thumbnail) {
      alert('请填写所有必填项')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          categories: selectedCategories,
          tags: selectedTags,
        }),
      })
      const result = await response.json()
      if (result.success) {
        router.push('/articles')
      } else {
        alert(result.error || '保存失败')
      }
    } catch (error) {
      alert('保存失败')
    } finally {
      setLoading(false)
    }
  }

  if (!article) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">编辑文章</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  目录 (必填) *
                </label>
                <input
                  type="text"
                  value={formData.directory}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">文章的英文目录名,用于存放文件（创建后不可修改）</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HTTP地址 (必填) *
                </label>
                <input
                  type="url"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题 (英文) *
                </label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题 (中文) *
                </label>
                <input
                  type="text"
                  value={formData.title_zh}
                  onChange={(e) => setFormData({ ...formData, title_zh: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                缩略图 (必填) *
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleFileUpload('thumbnail')}
                  disabled={uploading}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  {uploading ? '上传中...' : '上传图片'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                预览图
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={formData.preview}
                  onChange={(e) => setFormData({ ...formData, preview: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => handleFileUpload('preview')}
                  disabled={uploading}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  {uploading ? '上传中...' : '上传图片'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  简介 (英文)
                </label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  简介 (中文)
                </label>
                <textarea
                  value={formData.description_zh}
                  onChange={(e) => setFormData({ ...formData, description_zh: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                文章内容 (Markdown)
              </label>
              <div data-color-mode="light" className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Markdown 编辑器</label>
                  <button
                    type="button"
                    onClick={handleMdEditorImageUpload}
                    disabled={uploading}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                    <span>{uploading ? '上传中...' : '插入图片'}</span>
                  </button>
                </div>
                <MDEditor
                  value={formData.content}
                  onChange={(val) => setFormData({ ...formData, content: val || '' })}
                  height={400}
                  preview="edit"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类 (可多选)
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.id])
                        } else {
                          setSelectedCategories(selectedCategories.filter((catId) => catId !== category.id))
                        }
                      }}
                    />
                    <span>{category.name_zh} ({category.name_en})</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签 (可多选)
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags([...selectedTags, tag.id])
                        } else {
                          setSelectedTags(selectedTags.filter((tagId) => tagId !== tag.id))
                        }
                      }}
                    />
                    <span>{tag.name_zh} ({tag.name_en})</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                状态
              </label>
              <select
                value={formData.flag}
                onChange={(e) => setFormData({ ...formData, flag: e.target.value as 'draft' | 'published' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/articles')}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
