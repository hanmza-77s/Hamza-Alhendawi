import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Instagram, Smartphone, TrendingUp, Users, Sparkles } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    theme: '',
    platform: 'instagram',
    username: '',
    password: ''
  });

  const themes = [
    { id: 'boxing', name: 'Boxing', icon: '🥊', description: 'Fitness and combat sports content' },
    { id: 'health', name: 'Health & Wellness', icon: '💚', description: 'Nutrition and healthy living' },
    { id: 'motivation', name: 'Motivation', icon: '💪', description: 'Inspirational and motivational content' },
    { id: 'fitness', name: 'Fitness', icon: '🏋️', description: 'Workout routines and fitness tips' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '✨', description: 'Daily life and personal development' }
  ];

  const handleThemeSelect = (theme) => {
    setFormData({ ...formData, theme });
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep(3);
    
    // Simulate account creation
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Zap className="h-12 w-12 text-primary-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">AutoSocial</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Automate your social media presence with AI-powered content creation, 
            smart scheduling, and intelligent engagement.
          </p>
        </div>

        {/* Step 1: Theme Selection */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Theme</h2>
              <p className="text-gray-600">Select a theme for your social media account</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-primary-300 group"
                >
                  <div className="text-4xl mb-4">{theme.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{theme.name}</h3>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Account Setup */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Setup</h2>
              <p className="text-gray-600">Enter your social media credentials</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your password"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
                >
                  Start AI Account
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Loading */}
        {step === 3 && (
          <div className="animate-fade-in text-center">
            <div className="mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Setting Up Your Account</h2>
              <p className="text-gray-600">AI is configuring your content strategy...</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Sparkles className="h-5 w-5 text-primary-600" />
                <span>Generating content strategy</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <TrendingUp className="h-5 w-5 text-primary-600" />
                <span>Creating posting schedule</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Users className="h-5 w-5 text-primary-600" />
                <span>Setting up engagement automation</span>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Instagram className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Content Generation</h3>
            <p className="text-sm text-gray-600">Generate engaging captions, hashtags, and media using GPT-4</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Scheduling</h3>
            <p className="text-sm text-gray-600">Automatically schedule posts at optimal times for maximum engagement</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Insights</h3>
            <p className="text-sm text-gray-600">Track performance and optimize your strategy with detailed analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;