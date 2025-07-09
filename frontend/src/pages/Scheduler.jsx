import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Play, X, CheckCircle } from 'lucide-react'
import { schedulerAPI, contentAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Scheduler() {
  const [account, setAccount] = useState(null)
  const [scheduledPosts, setScheduledPosts] = useState([])
  const [draftPosts, setDraftPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentAccount = localStorage.getItem('currentAccount')
    if (currentAccount) {
      const accountData = JSON.parse(currentAccount)
      setAccount(accountData)
      loadData(accountData.id)
    }
  }, [])

  const loadData = async (accountId) => {
    try {
      const [scheduledResponse, postsResponse] = await Promise.all([
        schedulerAPI.getScheduled(accountId),
        contentAPI.getPosts(accountId, 'draft')
      ])

      setScheduledPosts(scheduledResponse.data.scheduled_posts)
      setDraftPosts(postsResponse.data.posts)
    } catch (error) {
      console.error('Error loading scheduler data:', error)
      toast.error('Failed to load scheduler data')
    } finally {
      setLoading(false)
    }
  }

  const scheduleOptimalTimes = async () => {
    if (!account || draftPosts.length === 0) return

    try {
      const response = await schedulerAPI.scheduleOptimal({
        account_id: account.id,
        post_ids: draftPosts.map(post => post.id)
      })

      if (response.data.success) {
        toast.success(`Scheduled ${response.data.scheduled_posts.length} posts at optimal times!`)
        loadData(account.id)
      }
    } catch (error) {
      toast.error('Failed to schedule posts')
    }
  }

  const publishScheduled = async () => {
    try {
      const response = await schedulerAPI.publishScheduled()
      if (response.data.published_posts.length > 0) {
        toast.success(`Published ${response.data.published_posts.length} posts!`)
        loadData(account.id)
      } else {
        toast.info('No posts were ready for publishing')
      }
    } catch (error) {
      toast.error('Failed to publish posts')
    }
  }

  const cancelPost = async (postId) => {
    try {
      await schedulerAPI.cancelPost(postId)
      toast.success('Post cancelled successfully!')
      loadData(account.id)
    } catch (error) {
      toast.error('Failed to cancel post')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Scheduler</h1>
          <p className="text-gray-600 mt-1">AI-powered optimal posting schedule</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={publishScheduled}
            className="btn btn-outline"
          >
            <Play className="h-4 w-4 mr-2" />
            Publish Now
          </button>
          <button
            onClick={scheduleOptimalTimes}
            disabled={draftPosts.length === 0}
            className="btn btn-primary disabled:opacity-50"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Auto-Schedule All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{scheduledPosts.length}</p>
              <p className="text-sm text-gray-500">Scheduled Posts</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{draftPosts.length}</p>
              <p className="text-sm text-gray-500">Draft Posts</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">95%</p>
              <p className="text-sm text-gray-500">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Posts */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Posts</h2>
        
        {scheduledPosts.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled posts</h3>
            <p className="text-gray-500 mb-6">Schedule your draft posts to automate your content.</p>
            {draftPosts.length > 0 && (
              <button onClick={scheduleOptimalTimes} className="btn btn-primary">
                Schedule {draftPosts.length} Draft Posts
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <h3 className="font-medium text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {post.caption?.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(post.scheduled_time).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.scheduled_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => cancelPost(post.id)}
                    className="btn-sm bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Draft Posts */}
      {draftPosts.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ready to Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {draftPosts.map((post) => (
              <div key={post.id} className="bg-gray-50 rounded-lg p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  {post.media_urls && post.media_urls.length > 0 ? (
                    <img
                      src={post.media_urls[0]}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-gray-400">No media</div>
                  )}
                </div>
                <p className="text-sm text-gray-900 line-clamp-2 mb-3">
                  {post.caption}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{post.content_type}</span>
                  <span>Draft</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduling Tips */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900 mb-2">AI Scheduling Tips</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Best posting times for {account?.theme} content: 9 AM, 1 PM, 6 PM</li>
              <li>• Optimal frequency: 1-2 posts per day</li>
              <li>• Video content performs 3x better on weekends</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}