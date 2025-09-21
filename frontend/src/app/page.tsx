"use client";

import { useState, useRef } from "react";
import { generatePosts, uploadImage, performWebResearch, generateContentCalendar, getOptimalTimes } from "../api";

interface Product {
  name: string;
  description: string;
  price: number;
  category?: string;
}

interface SocialMediaPost {
  platform: "twitter" | "instagram" | "linkedin";
  content: string;
}

interface ImageInsights {
  summary: string;
  tags: string[];
  altText: string;
}

interface ResearchInsights {
  bullets: string[];
}

interface ScheduledPost {
  id: string;
  platform: "twitter" | "instagram" | "linkedin";
  content: string;
  scheduledTime: string;
  timezone: string;
  status: 'pending' | 'published' | 'failed';
}

interface CalendarDay {
  day: number;
  date: string;
  dayName: string;
  posts: SocialMediaPost[];
  recommendedTimes: number[];
}

const PLATFORM_ICONS = {
  twitter: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
};

const PLATFORM_NAMES = {
  twitter: "Twitter/X",
  instagram: "Instagram", 
  linkedin: "LinkedIn",
};

const PLATFORM_COLORS = {
  twitter: "bg-black text-white",
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  linkedin: "bg-blue-600 text-white",
};

export default function Home() {
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    category: "",
  });
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // New feature states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageInsights, setImageInsights] = useState<ImageInsights | null>(null);
  const [researchQuery, setResearchQuery] = useState<string>("");
  const [researchInsights, setResearchInsights] = useState<ResearchInsights | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [contentCalendar, setContentCalendar] = useState<CalendarDay[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [brandVoice, setBrandVoice] = useState<'friendly' | 'luxury' | 'playful' | 'clinical' | 'casual'>('friendly');
  const [timezone, setTimezone] = useState<string>('UTC');
  const [isResearching, setIsResearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateInput = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!product.name.trim()) {
      errors.name = "Product name is required";
    } else if (product.name.length > 200) {
      errors.name = "Product name must be 200 characters or less";
    }
    
    if (!product.description.trim()) {
      errors.description = "Product description is required";
    } else if (product.description.length > 2000) {
      errors.description = "Product description must be 2000 characters or less";
    }
    
    if (product.price < 0) {
      errors.price = "Price must be a non-negative number";
    } else if (product.price > 999999) {
      errors.price = "Price must be less than $999,999";
    }
    
    if (product.category && product.category.length > 100) {
      errors.category = "Category must be 100 characters or less";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGeneratePosts = async () => {
    if (!validateInput()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setPosts([]);
    setScheduledPosts([]);
    setContentCalendar([]);
    
    try {
      const options = {
        imageBase64: selectedImage ? await fileToBase64(selectedImage) : undefined,
        imageMimeType: selectedImage?.type,
        researchQuery: researchQuery || undefined,
        voice: brandVoice,
        schedulePosts: true,
        timezone
      };
      
      const result = await generatePosts(product, options);
      setPosts(result.posts);
      setImageInsights(result.imageInsights || null);
      setResearchInsights(result.researchInsights || null);
      setScheduledPosts(result.scheduledPosts || []);
      
      // Generate content calendar
      if (result.posts.length > 0) {
        const calendarResult = await generateContentCalendar(result.posts, undefined, timezone);
        setContentCalendar(calendarResult.calendar);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);
    setIsUploading(true);
    setError(null);

    try {
      const insights = await uploadImage(file);
      setImageInsights(insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleWebResearch = async () => {
    if (!researchQuery.trim()) return;

    setIsResearching(true);
    setError(null);

    try {
      const result = await performWebResearch(researchQuery);
      setResearchInsights({ bullets: result.data.insights });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Web research failed');
    } finally {
      setIsResearching(false);
    }
  };

  const formatScheduledTime = (scheduledTime: string) => {
    const date = new Date(scheduledTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header with Astronaut */}
      <header className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Soshie AI
                  <span className="block text-3xl lg:text-4xl font-light mt-2">
                    Social Media Generator
                  </span>
                </h1>
                <p className="text-xl text-purple-100 leading-relaxed">
                  Transform your products into viral social media content with AI-powered precision. 
                  Create engaging posts for Twitter, Instagram, and LinkedIn in seconds.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Multi-Platform</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Instant Results</span>
                </div>
              </div>
            </div>
            
            {/* Astronaut Images */}
            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="text-center space-y-4">
                  <div className="relative w-48 h-48 mx-auto">
                    <img 
                      src="/images/astronaut-1.png" 
                      alt="Soshie AI Assistant" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg animate-pulse">
                      ✨
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">AI Assistant Ready</h3>
                  <p className="text-purple-100">Your creative companion is here to help!</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Input Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell Us About Your Product</h2>
            <p className="text-gray-600 text-lg">Fill in the details and let our AI create compelling social media content</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    validationErrors.name 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : 'border-gray-200 bg-white focus:border-purple-500 focus:bg-purple-50'
                  } focus:outline-none focus:ring-4 focus:ring-purple-100`}
                  value={product.name}
                  onChange={(e) => {
                    setProduct({ ...product, name: e.target.value });
                    if (validationErrors.name) {
                      setValidationErrors({ ...validationErrors, name: '' });
                    }
                  }}
                  placeholder="EcoBottle Pro"
                  disabled={isLoading}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    validationErrors.price 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : 'border-gray-200 bg-white focus:border-purple-500 focus:bg-purple-50'
                  } focus:outline-none focus:ring-4 focus:ring-purple-100`}
                  value={product.price || ''}
                  onChange={(e) => {
                    setProduct({ ...product, price: parseFloat(e.target.value) || 0 });
                    if (validationErrors.price) {
                      setValidationErrors({ ...validationErrors, price: '' });
                    }
                  }}
                  placeholder="49.99"
                  disabled={isLoading}
                />
                {validationErrors.price && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {validationErrors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category (optional)
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    validationErrors.category 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : 'border-gray-200 bg-white focus:border-purple-500 focus:bg-purple-50'
                  } focus:outline-none focus:ring-4 focus:ring-purple-100`}
                  value={product.category || ""}
                  onChange={(e) => {
                    setProduct({ ...product, category: e.target.value });
                    if (validationErrors.category) {
                      setValidationErrors({ ...validationErrors, category: '' });
                    }
                  }}
                  placeholder="Health & Wellness"
                  disabled={isLoading}
                />
                {validationErrors.category && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {validationErrors.category}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`w-full h-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none ${
                  validationErrors.description 
                    ? 'border-red-300 bg-red-50 focus:border-red-500' 
                    : 'border-gray-200 bg-white focus:border-purple-500 focus:bg-purple-50'
                } focus:outline-none focus:ring-4 focus:ring-purple-100`}
                rows={8}
                value={product.description}
                onChange={(e) => {
                  setProduct({ ...product, description: e.target.value });
                  if (validationErrors.description) {
                    setValidationErrors({ ...validationErrors, description: '' });
                  }
                }}
                placeholder="Revolutionary reusable water bottle with built-in UV purification technology. Made from sustainable materials, keeps water fresh for 24 hours, and helps reduce plastic waste. Perfect for eco-conscious consumers who want to stay hydrated while protecting the planet."
                disabled={isLoading}
              />
              {validationErrors.description && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {validationErrors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
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
                  onChange={handleImageUpload}
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
                    {imageInsights.tags.map((tag, index) => (
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
                  onClick={handleWebResearch}
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
                    {researchInsights.bullets.map((insight, index) => (
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
                onChange={(e) => setBrandVoice(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-100"
              >
                <option value="friendly">Friendly & Approachable</option>
                <option value="luxury">Luxury & Premium</option>
                <option value="playful">Playful & Fun</option>
                <option value="clinical">Clinical & Professional</option>
                <option value="casual">Casual & Relaxed</option>
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
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={handleGeneratePosts}
            disabled={isLoading}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <img 
                  src="/images/astronaut-2.png" 
                  alt="Working..." 
                  className="w-8 h-8 animate-spin"
                />
                <span>Generating Magic...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <span>🚀</span>
                <span>Generate Posts</span>
                <span>✨</span>
              </div>
            )}
          </button>
          
          {posts.length > 0 && (
            <button
              onClick={() => {
                const allContent = posts.map(post => `${PLATFORM_NAMES[post.platform]}:\n${post.content}\n`).join('\n');
                copyToClipboard(allContent);
              }}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>📋</span>
              <span>Copy All Posts</span>
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">Oops! Something went wrong</h3>
                <p className="text-red-700 mt-2">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Generated Posts */}
        {posts.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Your AI-Generated Posts</h2>
              <p className="text-gray-600 text-lg">Ready to share across your social media platforms</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className={`p-4 ${PLATFORM_COLORS[post.platform]} rounded-t-2xl`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          {PLATFORM_ICONS[post.platform]}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{PLATFORM_NAMES[post.platform]}</h3>
                          <p className="text-sm opacity-90">{post.content.length} characters</p>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(post.content)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                        title="Copy to clipboard"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
                      {post.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Calendar Section */}
        {contentCalendar.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Content Calendar</h2>
              <p className="text-gray-600 text-lg">Your 7-day posting schedule with optimal timing</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {contentCalendar.map((day, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{day.dayName}</h3>
                    <p className="text-gray-600">{day.date}</p>
                    <div className="mt-2">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {day.posts.length} posts
                      </span>
                    </div>
                  </div>
                  
                  {day.posts.length > 0 && (
                    <div className="space-y-3">
                      {day.posts.map((post, postIndex) => (
                        <div key={postIndex} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className={`p-1 rounded ${PLATFORM_COLORS[post.platform]}`}>
                                {PLATFORM_ICONS[post.platform]}
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {PLATFORM_NAMES[post.platform]}
                              </span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(post.content)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy to clipboard"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {day.recommendedTimes.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Recommended times:</p>
                      <div className="flex flex-wrap gap-1">
                        {day.recommendedTimes.map((time, timeIndex) => (
                          <span key={timeIndex} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {time}:00
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Posts Section */}
        {scheduledPosts.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Scheduled Posts</h2>
              <p className="text-gray-600 text-lg">Posts ready for publishing with optimal timing</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {scheduledPosts.map((scheduledPost) => (
                <div key={scheduledPost.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${PLATFORM_COLORS[scheduledPost.platform]}`}>
                        {PLATFORM_ICONS[scheduledPost.platform]}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{PLATFORM_NAMES[scheduledPost.platform]}</h3>
                        <p className="text-sm text-gray-600">{formatScheduledTime(scheduledPost.scheduledTime)}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      scheduledPost.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      scheduledPost.status === 'published' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {scheduledPost.status}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
                      {scheduledPost.content}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(scheduledPost.content)}
                      className="flex-1 py-2 px-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                    >
                      Copy Content
                    </button>
                    <button
                      className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      Schedule Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-4">Powered by Soshie AI</h3>
              <p className="text-purple-100 mb-6">Transform your social media presence with intelligent content generation</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Multi-Platform</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Instant Results</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <img 
                  src="/images/astronaut-2.png" 
                  alt="Soshie AI Team" 
                  className="w-32 h-32 object-contain animate-pulse"
                />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-sm animate-bounce">
                  💫
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
