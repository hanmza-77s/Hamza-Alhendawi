import React, { useState } from 'react';
import { Calendar, Clock, Play, Pause, Trash2, Edit, Plus } from 'lucide-react';

const Scheduler = () => {
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      caption: "💪 Every step forward is progress. Don't let setbacks define you!",
      scheduledTime: "2024-01-15T09:00:00",
      status: "scheduled",
      platform: "instagram",
      theme: "motivation"
    },
    {
      id: 2,
      caption: "🥊 Today's training session was intense! Champions are made in practice.",
      scheduledTime: "2024-01-16T12:00:00",
      status: "scheduled",
      platform: "instagram",
      theme: "boxing"
    }
  ]);

  const [automationSettings, setAutomationSettings] = useState({
    autoPosting: true,
    autoEngagement: true,
    autoStories: false,
    postingFrequency: "daily",
    engagementLimit: 50
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scheduler</h1>
        <p className="text-gray-600">Manage your content scheduling and automation settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scheduled Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Scheduled Posts</h2>
            <button className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors duration-200">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 mb-2">{post.caption}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.scheduledTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(post.scheduledTime).toLocaleTimeString()}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {post.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-red-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automation Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Automation Settings</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Auto Posting</h3>
                <p className="text-xs text-gray-500">Automatically post generated content</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={automationSettings.autoPosting}
                  onChange={(e) => setAutomationSettings({...automationSettings, autoPosting: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Auto Engagement</h3>
                <p className="text-xs text-gray-500">Like and comment on relevant posts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={automationSettings.autoEngagement}
                  onChange={(e) => setAutomationSettings({...automationSettings, autoEngagement: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Story Viewing</h3>
                <p className="text-xs text-gray-500">Automatically view stories</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={automationSettings.autoStories}
                  onChange={(e) => setAutomationSettings({...automationSettings, autoStories: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Posting Frequency</label>
              <select
                value={automationSettings.postingFrequency}
                onChange={(e) => setAutomationSettings({...automationSettings, postingFrequency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="daily">Daily</option>
                <option value="twice_daily">Twice Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Engagement Limit</label>
              <input
                type="number"
                value={automationSettings.engagementLimit}
                onChange={(e) => setAutomationSettings({...automationSettings, engagementLimit: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                min="1"
                max="100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Automation Status */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Automation Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Active</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Auto Posting</h3>
            <p className="text-xs text-gray-600">Last post: 2 hours ago</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Active</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Engagement</h3>
            <p className="text-xs text-gray-600">32 actions today</p>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Paused</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Story Viewing</h3>
            <p className="text-xs text-gray-600">Not enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;