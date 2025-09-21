import React from 'react';
import { BrandVoice } from '../types';
import { BRAND_VOICES, TIMEZONES } from '../constants/platforms';

interface EnhancedFeaturesProps {
  selectedImage: File | null;
  imageInsights: any;
  researchQuery: string;
  setResearchQuery: (query: string) => void;
  researchInsights: any;
  brandVoice: BrandVoice;
  setBrandVoice: (voice: BrandVoice) => void;
  timezone: string;
  setTimezone: (timezone: string) => void;
  isUploading: boolean;
  isResearching: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onWebResearch: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const EnhancedFeatures: React.FC<EnhancedFeaturesProps> = ({
  selectedImage,
  imageInsights,
  researchQuery,
  setResearchQuery,
  researchInsights,
  brandVoice,
  setBrandVoice,
  timezone,
  setTimezone,
  isUploading,
  isResearching,
  onImageUpload,
  onWebResearch,
  fileInputRef,
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Enhanced Features</h2>
        <p className="text-gray-600 text-lg">Add images, research, and customize your content</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📸 Product Image Analysis</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
            >
              {isUploading ? 'Analyzing Image...' : 'Upload Product Image'}
            </button>
            <p className="text-sm text-gray-500 mt-2">PNG, JPG, WebP up to 5MB</p>
          </div>
          
          {selectedImage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">✓ {selectedImage.name} uploaded</p>
            </div>
          )}

          {imageInsights && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Image Analysis:</h4>
              <p className="text-blue-800 text-sm mb-2">{imageInsights.summary}</p>
              <div className="flex flex-wrap gap-2">
                {imageInsights.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Web Research Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🔍 Market Research</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={researchQuery}
              onChange={(e) => setResearchQuery(e.target.value)}
              placeholder="e.g., 'sustainable water bottles market trends'"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
              disabled={isResearching}
            />
            <button
              onClick={onWebResearch}
              disabled={isResearching || !researchQuery.trim()}
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
            >
              {isResearching ? 'Researching...' : 'Research Market'}
            </button>
          </div>

          {researchInsights && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Market Insights:</h4>
              <ul className="space-y-1">
                {researchInsights.bullets.map((insight: string, index: number) => (
                  <li key={index} className="text-purple-800 text-sm flex items-start">
                    <span className="mr-2">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Brand Voice and Settings */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Brand Voice
          </label>
          <select
            value={brandVoice}
            onChange={(e) => setBrandVoice(e.target.value as BrandVoice)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
          >
            {BRAND_VOICES.map((voice) => (
              <option key={voice.value} value={voice.value}>
                {voice.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
