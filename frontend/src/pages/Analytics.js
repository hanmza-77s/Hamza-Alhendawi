import React from 'react';
import { TrendingUp, Users, Heart, MessageCircle, BarChart3 } from 'lucide-react';

const Analytics = () => {
  const analyticsData = {
    followers: 1542,
    following: 890,
    totalPosts: 24,
    totalLikes: 8920,
    totalComments: 1240,
    totalShares: 320,
    engagementRate: 4.2,
    reach: 15600,
    impressions: 23400
  };

  const weeklyData = [
    { day: 'Mon', followers: 1500, likes: 120, comments: 15 },
    { day: 'Tue', followers: 1510, likes: 140, comments: 18 },
    { day: 'Wed', followers: 1520, likes: 160, comments: 22 },
    { day: 'Thu', followers: 1530, likes: 180, comments: 25 },
    { day: 'Fri', followers: 1540, likes: 200, comments: 28 },
    { day: 'Sat', followers: 1545, likes: 220, comments: 30 },
    { day: 'Sun', followers: 1542, likes: 240, comments: 32 }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Track your social media performance and engagement metrics.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Followers</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.followers.toLocaleString()}</p>
              <p className="text-xs text-green-600">+12% this week</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalLikes.toLocaleString()}</p>
              <p className="text-xs text-green-600">+8% this week</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Comments</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalComments.toLocaleString()}</p>
              <p className="text-xs text-green-600">+15% this week</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.engagementRate}%</p>
              <p className="text-xs text-green-600">+2% this week</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Performance</h2>
          
          <div className="space-y-4">
            {weeklyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-12">{data.day}</span>
                <div className="flex-1 mx-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Followers</span>
                        <span>{data.followers}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(data.followers - 1500) / 50}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Likes</span>
                        <span>{data.likes}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${(data.likes / 240) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Engagement Breakdown</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Likes</span>
                <span className="text-sm text-gray-500">{analyticsData.totalLikes.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-red-600 h-3 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Comments</span>
                <span className="text-sm text-gray-500">{analyticsData.totalComments.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Shares</span>
                <span className="text-sm text-gray-500">{analyticsData.totalShares.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.reach.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Reach</div>
            <div className="text-xs text-green-600 mt-1">+18% this week</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.impressions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Impressions</div>
            <div className="text-xs text-green-600 mt-1">+22% this week</div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">{analyticsData.totalPosts}</div>
            <div className="text-sm text-gray-600">Total Posts</div>
            <div className="text-xs text-blue-600 mt-1">This month</div>
          </div>
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Posts</h2>
        
        <div className="space-y-4">
          {[
            {
              caption: "💪 Every step forward is progress. Don't let setbacks define you!",
              likes: 245,
              comments: 32,
              shares: 8,
              date: "2 days ago"
            },
            {
              caption: "🥊 Today's training session was intense! Champions are made in practice.",
              likes: 198,
              comments: 28,
              shares: 5,
              date: "4 days ago"
            },
            {
              caption: "✨ Your potential is limitless. Believe in yourself and take action!",
              likes: 156,
              comments: 22,
              shares: 3,
              date: "1 week ago"
            }
          ].map((post, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-900 mb-3">{post.caption}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex space-x-4">
                  <span className="flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    {post.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {post.comments}
                  </span>
                  <span className="flex items-center">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    {post.shares}
                  </span>
                </div>
                <span>{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;