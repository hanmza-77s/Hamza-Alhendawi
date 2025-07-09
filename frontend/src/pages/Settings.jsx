import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Bot, Bell, Shield, Zap, Save } from 'lucide-react'
import { generalAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Settings() {
  const [account, setAccount] = useState(null)
  const [aiStatus, setAiStatus] = useState(null)
  const [settings, setSettings] = useState({
    autoReply: true,
    replyStrategy: 'positive_only',
    postFrequency: 'daily',
    optimalTiming: true,
    notifications: true,
    engagementLevel: 'moderate'
  })

  useEffect(() => {
    const currentAccount = localStorage.getItem('currentAccount')
    if (currentAccount) {
      setAccount(JSON.parse(currentAccount))
    }
    loadAIStatus()
  }, [])

  const loadAIStatus = async () => {
    try {
      const response = await generalAPI.getAIStatus()
      setAiStatus(response.data)
    } catch (error) {
      console.error('Error loading AI status:', error)
    }
  }

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your AI automation preferences</p>
      </div>

      {/* AI Status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">AI Services Status</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-green-600">All systems operational</span>
          </div>
        </div>

        {aiStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(aiStatus.services).map(([service, status]) => (
              <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {service.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {service === 'content_generation' && 'GPT-4 powered'}
                    {service === 'image_generation' && 'DALL-E 3'}
                    {service === 'sentiment_analysis' && 'Natural language processing'}
                    {service === 'video_generation' && 'Mock service'}
                    {service === 'music_generation' && 'Mock service'}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${status ? 'bg-green-400' : 'bg-red-400'}`}></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Settings */}
      {account && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={account.username}
                readOnly
                className="input bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <input
                type="text"
                value={account.platform}
                readOnly
                className="input bg-gray-50 capitalize"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <input
                type="text"
                value={account.theme}
                readOnly
                className="input bg-gray-50 capitalize"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account ID</label>
              <input
                type="text"
                value={account.id}
                readOnly
                className="input bg-gray-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Automation Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Automation Settings</h2>
        
        <div className="space-y-6">
          {/* Auto Reply */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">Auto-Reply to Comments</h3>
                <p className="text-sm text-gray-500">Automatically respond to comments using AI</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoReply}
                onChange={(e) => setSettings({...settings, autoReply: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Reply Strategy */}
          {settings.autoReply && (
            <div className="ml-8 space-y-2">
              <label className="block text-sm font-medium text-gray-700">Reply Strategy</label>
              <select
                value={settings.replyStrategy}
                onChange={(e) => setSettings({...settings, replyStrategy: e.target.value})}
                className="input max-w-xs"
              >
                <option value="positive_only">Positive comments only</option>
                <option value="positive_neutral">Positive & neutral</option>
                <option value="all">All comments</option>
              </select>
            </div>
          )}

          {/* Post Frequency */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">Posting Frequency</h3>
                <p className="text-sm text-gray-500">How often to automatically post content</p>
              </div>
            </div>
            <select
              value={settings.postFrequency}
              onChange={(e) => setSettings({...settings, postFrequency: e.target.value})}
              className="input max-w-xs"
            >
              <option value="twice_daily">Twice daily</option>
              <option value="daily">Daily</option>
              <option value="every_other_day">Every other day</option>
              <option value="manual">Manual only</option>
            </select>
          </div>

          {/* Optimal Timing */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SettingsIcon className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">AI Optimal Timing</h3>
                <p className="text-sm text-gray-500">Use AI to determine best posting times</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.optimalTiming}
                onChange={(e) => setSettings({...settings, optimalTiming: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Engagement Level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">Engagement Level</h3>
                <p className="text-sm text-gray-500">How actively to engage with other accounts</p>
              </div>
            </div>
            <select
              value={settings.engagementLevel}
              onChange={(e) => setSettings({...settings, engagementLevel: e.target.value})}
              className="input max-w-xs"
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-500">Get notified about important events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={saveSettings} className="btn btn-primary">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </button>
      </div>

      {/* Security Notice */}
      <div className="card bg-amber-50 border-amber-200">
        <div className="flex items-start space-x-3">
          <Shield className="h-6 w-6 text-amber-600 mt-1" />
          <div>
            <h3 className="font-medium text-amber-900 mb-2">Security & Privacy</h3>
            <p className="text-sm text-amber-800">
              This is a demonstration application. In a production environment, implement proper security measures including:
            </p>
            <ul className="text-sm text-amber-800 mt-2 list-disc list-inside space-y-1">
              <li>End-to-end encryption for credentials</li>
              <li>Secure API key management</li>
              <li>OAuth integration for social platforms</li>
              <li>Regular security audits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}