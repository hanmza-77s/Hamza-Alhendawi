import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Calendar, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Eye,
  Zap,
  Clock,
  CheckCircle
} from 'lucide-react'
import { contentAPI, schedulerAPI, engagementAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [account, setAccount] = useState(null)
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduledPosts: 0,
    totalComments: 0,
    responseRate: 0
  })
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentAccount = localStorage.getItem('currentAccount')
    if (currentAccount) {
      const accountData = JSON.parse(currentAccount)
      setAccount(accountData)
      loadDashboardData(accountData.id)
    } else {
      setLoading(false)
    }
  }, [])

  const loadDashboardData = async (accountId) => {
    try {
      const [postsResponse, scheduledResponse, commentsResponse] = await Promise.all([
        contentAPI.getPosts(accountId),
        schedulerAPI.getScheduled(accountId),
        engagementAPI.getAnalytics(accountId, 7)
      ])

      setStats({
        totalPosts: postsResponse.data.posts.length,
        scheduledPosts: scheduledResponse.data.scheduled_posts.length,
        totalComments: commentsResponse.data.total_comments,
        responseRate: commentsResponse.data.response_rate
      })

      setRecentPosts(postsResponse.data.posts.slice(0, 5))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Account Found</h2>
        <p className="text-gray-600 mb-8">Create your first AI-powered social media account to get started.</p>
        <Link to="/app/create-account" className="btn btn-primary">
          Create Account
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
            <p className="text-primary-100 mt-2">
              Managing @{account.username} • {account.theme} • {account.platform}
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="text-right">
              <p className="text-primary-100 text-sm">AI Automation Status</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/app/content"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Generate Content</p>
              <p className="text-sm text-gray-500">Create AI posts</p>
            </div>
          </div>
        </Link>

        <Link
          to="/app/scheduler"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Schedule Posts</p>
              <p className="text-sm text-gray-500">Auto-schedule content</p>
            </div>
          </div>
        </Link>

        <Link
          to="/app/analytics"
          className="card hover:shadow-lg transition-shadow cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-500">Track performance</p>
            </div>
          </div>
        </Link>

        <button className="card hover:shadow-lg transition-shadow cursor-pointer group text-left">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
              <MessageCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Auto-Reply</p>
              <p className="text-sm text-gray-500">Engage comments</p>
            </div>
          </div>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
              <p className="text-sm text-gray-500">Total Posts</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.scheduledPosts}</p>
              <p className="text-sm text-gray-500">Scheduled</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalComments}</p>
              <p className="text-sm text-gray-500">Comments (7d)</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
              <p className="text-sm text-gray-500">Response Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
          <Link to="/app/content" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-4">Create your first AI-generated content to get started.</p>
            <Link to="/app/content" className="btn btn-primary">
              Generate Content
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {post.media_urls && post.media_urls.length > 0 ? (
                    <img
                      src={post.media_urls[0]}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {post.title || 'Untitled Post'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {post.caption}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="capitalize">{post.content_type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.status === 'posted' ? 'bg-green-100 text-green-800' :
                      post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                    {post.status === 'posted' && post.engagement_stats && (
                      <span>
                        {post.engagement_stats.likes || 0} likes, {post.engagement_stats.comments || 0} comments
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
          <div>
            <h3 className="font-medium text-gray-900 mb-2">AI Tip of the Day</h3>
            <p className="text-gray-600 text-sm">
              Post consistently at optimal times to maximize engagement. Your AI has analyzed the best posting times for your {account.theme} audience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}