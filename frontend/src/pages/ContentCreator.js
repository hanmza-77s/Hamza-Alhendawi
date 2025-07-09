import React, { useState } from 'react';
import { 
  Sparkles, 
  Image, 
  Video, 
  Hash, 
  MessageSquare, 
  Download,
  Play,
  RefreshCw
} from 'lucide-react';

const ContentCreator = () => {
  const [selectedTheme, setSelectedTheme] = useState('motivation');
  const [contentType, setContentType] = useState('image');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const themes = [
    { id: 'boxing', name: 'Boxing', icon: '🥊' },
    { id: 'health', name: 'Health & Wellness', icon: '💚' },
    { id: 'motivation', name: 'Motivation', icon: '💪' },
    { id: 'fitness', name: 'Fitness', icon: '🏋️' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '✨' }
  ];

  const contentTypes = [
    { id: 'image', name: 'Image Post', icon: Image },
    { id: 'video', name: 'Video Post', icon: Video },
    { id: 'carousel', name: 'Carousel', icon: Image }
  ];

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setGeneratedContent({
        caption: "💪 Every step forward is progress. Don't let setbacks define you - let them refine you. Keep pushing, keep growing, keep believing in yourself! #motivation #growth #mindset #success #determination #nevergiveup #believe #progress #strength #resilience",
        hashtags: ["#motivation", "#growth", "#mindset", "#success", "#determination", "#nevergiveup", "#believe", "#progress", "#strength", "#resilience"],
        mediaUrl: "https://via.placeholder.com/1080x1080/FF6B6B/FFFFFF?text=AI+Generated+Image",
        contentType: contentType,
        theme: selectedTheme
      });
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Creator</h1>
        <p className="text-gray-600">Generate AI-powered content for your social media accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Generation Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate Content</h2>
          
          {/* Theme Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedTheme === theme.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{theme.icon}</div>
                  <div className="text-sm font-medium">{theme.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
            <div className="grid grid-cols-3 gap-3">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    contentType === type.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <type.icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-xs font-medium">{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateContent}
            disabled={isGenerating}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate Content</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Content Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview</h2>
          
          {generatedContent ? (
            <div className="space-y-6">
              {/* Media Preview */}
              <div className="relative">
                {contentType === 'video' ? (
                  <div className="relative">
                    <img 
                      src={generatedContent.mediaUrl} 
                      alt="Generated content" 
                      className="w-full rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={generatedContent.mediaUrl} 
                    alt="Generated content" 
                    className="w-full rounded-lg"
                  />
                )}
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900">
                  {generatedContent.caption}
                </div>
              </div>

              {/* Hashtags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((hashtag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Schedule Post</span>
                </button>
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Generate content to see preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Strategy */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Content Pillars</h3>
            <p className="text-sm text-gray-600">3-5 main themes for consistent content</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">⏰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Posting Schedule</h3>
            <p className="text-sm text-gray-600">Optimal times for maximum engagement</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Target Audience</h3>
            <p className="text-sm text-gray-600">Tailored content for your followers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCreator;