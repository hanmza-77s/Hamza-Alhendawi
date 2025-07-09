import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Calendar,
  Plus,
  Zap,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 24,
    totalFollowers: 1542,
    totalLikes: 8920,
    totalComments: 1240,
    engagementRate: 4.2,
    scheduledPosts: 8
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'post',
      content: 'New post published: "Morning motivation 💪"',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'engagement',
      content: 'Liked 15 posts from similar accounts',
      time: '4 hours ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'schedule',
      content: 'Scheduled post for tomorrow at 9:00 AM',
      time: '6 hours ago',
      status: 'pending'
    },
    {
      id: 4,
      type: 'comment',
      content: 'Replied to comment: "Thanks for the support! 🙏"',
      time: '1 day ago',
      status: 'success'
    }
  ]);

  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      caption: 'New workout routine coming soon! 💪',
      scheduledTime: '2024-01-15T09:00:00',
      status: 'scheduled'
    },
    {
      id: 2,
      caption: 'Healthy breakfast ideas 🥗',
      scheduledTime: '2024-01-16T12:00:00',
      status: 'scheduled'
    }
  ]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your accounts.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Followers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFollowers.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.engagementRate}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Scheduled Posts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200">
                <Plus className="h-5 w-5" />
                <span>Create Content</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200">
                <Calendar className="h-5 w-5" />
                <span>Schedule Post</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Zap className="h-5 w-5" />
                <span>Run Automation</span>
              </button>
            </div>
          </div>

          {/* Scheduled Posts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Scheduled Posts</h2>
              <span className="text-sm text-gray-500">{scheduledPosts.length} posts</span>
            </div>
            
            <div className="space-y-3">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="p-3 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-900 mb-2">{post.caption}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(post.scheduledTime).toLocaleDateString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.status === 'scheduled' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">1,542</div>
            <div className="text-sm text-gray-600">Followers</div>
            <div className="text-xs text-green-600 mt-1">+12% this week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">8,920</div>
            <div className="text-sm text-gray-600">Total Likes</div>
            <div className="text-xs text-green-600 mt-1">+8% this week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">1,240</div>
            <div className="text-sm text-gray-600">Comments</div>
            <div className="text-xs text-green-600 mt-1">+15% this week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">4.2%</div>
            <div className="text-sm text-gray-600">Engagement Rate</div>
            <div className="text-xs text-green-600 mt-1">+2% this week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;