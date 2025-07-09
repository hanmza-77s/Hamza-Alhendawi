import React, { useState, useEffect } from 'react'
import { TrendingUp, Eye, Heart, MessageCircle, Share, Users, Calendar } from 'lucide-react'
import { schedulerAPI, engagementAPI } from '../services/api'

export default function Analytics() {
  const [account, setAccount] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [commentAnalytics, setCommentAnalytics] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentAccount = localStorage.getItem('currentAccount')
    if (currentAccount) {
      const accountData = JSON.parse(currentAccount)
      setAccount(accountData)
      loadAnalytics(accountData.id, selectedPeriod)
    }
  }, [selectedPeriod])

  const loadAnalytics = async (accountId, days) => {
    try {
      const [postingAnalytics, commentData] = await Promise.all([
        schedulerAPI.getAnalytics(accountId, days),
        engagementAPI.getAnalytics(accountId, days)
      ])

      setAnalytics(postingAnalytics.data)
      setCommentAnalytics(commentData.data)
    } catch (error) {
      console.error('Error loading analytics:', error)
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

  const mockGrowthData = [
    { name: 'Week 1', followers: 1200, engagement: 4.2 },
    { name: 'Week 2', followers: 1350, engagement: 4.8 },
    { name: 'Week 3', followers: 1580, engagement: 5.1 },
    { name: 'Week 4', followers: 1820, engagement: 5.7 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your AI-powered growth</p>
        </div>
        <div className="flex space-x-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setSelectedPeriod(days)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedPeriod === days
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.total_posts || 0}</p>
              <p className="text-sm text-green-600">+12% from last period</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.total_likes + analytics?.total_comments || 0}</p>
              <p className="text-sm text-green-600">+18% from last period</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-lg">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900">{commentAnalytics?.response_rate || 0}%</p>
              <p className="text-sm text-green-600">+5% from last period</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{analytics?.average_engagement || 0}</p>
              <p className="text-sm text-green-600">+22% from last period</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trend</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Growth chart visualization</p>
              <p className="text-sm text-gray-400">Would integrate with Chart.js/Recharts</p>
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h3>
          <div className="space-y-4">
            {analytics?.content_type_performance && Object.entries(analytics.content_type_performance).map(([type, stats]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    {type === 'image' && <Eye className="h-4 w-4 text-primary-600" />}
                    {type === 'video' && <Calendar className="h-4 w-4 text-primary-600" />}
                    {type === 'carousel' && <Users className="h-4 w-4 text-primary-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{type}</p>
                    <p className="text-sm text-gray-500">{stats.count} posts</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{stats.likes + stats.comments}</p>
                  <p className="text-sm text-gray-500">total engagement</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posting Schedule */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Posting Schedule</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Posts per day</span>
              <span className="font-medium">{analytics?.posts_per_day || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Best time</span>
              <span className="font-medium">2:00 PM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Peak day</span>
              <span className="font-medium">Tuesday</span>
            </div>
          </div>
        </div>

        {/* Comment Insights */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment Insights</h3>
          <div className="space-y-3">
            {commentAnalytics?.sentiment_breakdown && Object.entries(commentAnalytics.sentiment_breakdown).map(([sentiment, count]) => (
              <div key={sentiment} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    sentiment === 'positive' ? 'bg-green-400' :
                    sentiment === 'negative' ? 'bg-red-400' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-600 capitalize">{sentiment}</span>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Performance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Content accuracy</span>
              <span className="font-medium text-green-600">94%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-reply rate</span>
              <span className="font-medium text-blue-600">87%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Engagement boost</span>
              <span className="font-medium text-purple-600">+23%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Post published', time: '2 hours ago', status: 'success' },
            { action: 'Comment auto-replied', time: '4 hours ago', status: 'success' },
            { action: 'Content generated', time: '6 hours ago', status: 'success' },
            { action: 'Schedule optimized', time: '1 day ago', status: 'info' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-400' : 'bg-blue-400'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}