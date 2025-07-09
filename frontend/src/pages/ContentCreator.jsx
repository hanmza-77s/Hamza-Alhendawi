import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { 
  Zap, 
  Plus, 
  Image, 
  Video, 
  Layers, 
  Edit3, 
  Calendar,
  Trash2,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'
import { contentAPI, schedulerAPI } from '../services/api'

const contentTypes = [
  { id: 'image', name: 'Image Post', icon: Image, description: 'Single image with caption' },
  { id: 'carousel', name: 'Carousel', icon: Layers, description: 'Multiple images slideshow' },
  { id: 'video', name: 'Video', icon: Video, description: 'Short video with music' },
]

export default function ContentCreator() {
  const [account, setAccount] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [selectedType, setSelectedType] = useState('image')
  const [showCustomForm, setShowCustomForm] = useState(false)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    const currentAccount = localStorage.getItem('currentAccount')
    if (currentAccount) {
      const accountData = JSON.parse(currentAccount)
      setAccount(accountData)
      loadPosts(accountData.id)
    }
  }, [])

  const loadPosts = async (accountId) => {
    setLoading(true)
    try {
      const response = await contentAPI.getPosts(accountId)
      setPosts(response.data.posts)
    } catch (error) {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const generateContent = async () => {
    if (!account) return
    
    setGenerating(true)
    try {
      const response = await contentAPI.generate({
        account_id: account.id,
        content_type: selectedType
      })
      
      if (response.data.success) {
        toast.success('Content generated successfully!')
        loadPosts(account.id)
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to generate content')
    } finally {
      setGenerating(false)
    }
  }

  const generateBatch = async () => {
    if (!account) return
    
    setGenerating(true)
    try {
      const response = await contentAPI.generateBatch({
        account_id: account.id,
        count: 7
      })
      
      if (response.data.success) {
        toast.success(`Generated ${response.data.posts_generated} posts for the week!`)
        loadPosts(account.id)
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to generate batch content')
    } finally {
      setGenerating(false)
    }
  }

  const createCustomContent = async (data) => {
    if (!account) return
    
    setGenerating(true)
    try {
      const response = await contentAPI.createCustom({
        account_id: account.id,
        caption: data.caption,
        content_type: data.content_type,
        custom_prompt: data.custom_prompt
      })
      
      if (response.data.success) {
        toast.success('Custom content created successfully!')
        loadPosts(account.id)
        setShowCustomForm(false)
        reset()
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create custom content')
    } finally {
      setGenerating(false)
    }
  }

  const schedulePost = async (postId) => {
    try {
      // Schedule for tomorrow at optimal time
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(12, 0, 0, 0) // Default to noon
      
      const response = await schedulerAPI.schedulePost({
        post_id: postId,
        scheduled_time: tomorrow.toISOString()
      })
      
      if (response.data.success) {
        toast.success('Post scheduled successfully!')
        loadPosts(account.id)
      }
    } catch (error) {
      toast.error('Failed to schedule post')
    }
  }

  const deletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      await contentAPI.deletePost(postId)
      toast.success('Post deleted successfully!')
      loadPosts(account.id)
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  if (!account) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Account Found</h2>
        <p className="text-gray-600">Please create an account first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Creator</h1>
          <p className="text-gray-600 mt-1">Generate AI-powered content for @{account.username}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCustomForm(true)}
            className="btn btn-outline"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Custom Post
          </button>
          <button
            onClick={generateBatch}
            disabled={generating}
            className="btn btn-secondary"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            Generate Week
          </button>
        </div>
      </div>

      {/* Quick Generate */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Generate</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedType === type.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <type.icon className={`h-6 w-6 ${
                  selectedType === type.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <div>
                  <h3 className="font-medium text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={generateContent}
          disabled={generating}
          className="btn btn-primary w-full py-3"
        >
          <Zap className={`h-5 w-5 mr-2 ${generating ? 'animate-pulse' : ''}`} />
          {generating ? 'Generating Content...' : `Generate ${contentTypes.find(t => t.id === selectedType)?.name}`}
        </button>
      </div>

      {/* Custom Content Form */}
      {showCustomForm && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Create Custom Content</h2>
            <button
              onClick={() => setShowCustomForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit(createCustomContent)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <select {...register('content_type', { required: true })} className="input">
                {contentTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <textarea
                {...register('caption', { required: 'Caption is required' })}
                className="input h-24"
                placeholder="Write your caption here..."
              />
              {errors.caption && (
                <p className="mt-1 text-sm text-red-600">{errors.caption.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Image Prompt (Optional)
              </label>
              <input
                type="text"
                {...register('custom_prompt')}
                className="input"
                placeholder="Describe the image you want to generate..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={generating}
                className="btn btn-primary flex-1"
              >
                {generating ? 'Creating...' : 'Create Content'}
              </button>
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Grid */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Content</h2>
          <div className="text-sm text-gray-500">
            {posts.length} posts total
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
            <p className="text-gray-500 mb-6">Generate your first AI-powered post to get started.</p>
            <button onClick={generateContent} className="btn btn-primary">
              Generate First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-50 rounded-lg p-4">
                {/* Media Preview */}
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  {post.media_urls && post.media_urls.length > 0 ? (
                    <img
                      src={post.media_urls[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Eye className="h-8 w-8 text-gray-400" />
                  )}
                </div>

                {/* Content Info */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {post.content_type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.status === 'posted' ? 'bg-green-100 text-green-800' :
                        post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 line-clamp-3">
                      {post.caption}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {post.status === 'draft' && (
                      <button
                        onClick={() => schedulePost(post.id)}
                        className="btn-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule
                      </button>
                    )}
                    <button className="btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="btn-sm bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}