"use client";

import { useState } from "react";
import { generatePosts } from "../api";

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

const PLATFORM_ICONS = {
  twitter: "𝕏",
  instagram: "📷",
  linkedin: "💼",
};

const PLATFORM_NAMES = {
  twitter: "Twitter/X",
  instagram: "Instagram", 
  linkedin: "LinkedIn",
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
    
    try {
      const result = await generatePosts(product);
      setPosts(result.posts);
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

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Social Media Post Generator</h1>
        <p className="text-gray-600">Transform your product description into engaging social media posts for Twitter/X, Instagram, and LinkedIn.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Product Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${
                validationErrors.name ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`w-full px-3 py-2 border rounded-md ${
                validationErrors.description ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              rows={4}
              value={product.description}
              onChange={(e) => {
                setProduct({ ...product, description: e.target.value });
                if (validationErrors.description) {
                  setValidationErrors({ ...validationErrors, description: '' });
                }
              }}
              placeholder="Revolutionary reusable water bottle with built-in UV purification..."
              disabled={isLoading}
            />
            {validationErrors.description && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md ${
                validationErrors.price ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Category (optional)
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md ${
                validationErrors.category ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={handleGeneratePosts}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generating Posts...
            </>
          ) : (
            'Generate Posts'
          )}
        </button>
        
        {posts.length > 0 && (
          <button
            onClick={() => {
              const allContent = posts.map(post => `${PLATFORM_NAMES[post.platform]}:\n${post.content}\n`).join('\n');
              copyToClipboard(allContent);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Copy All Posts
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Generated Posts</h2>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {PLATFORM_ICONS[post.platform]}
                      </span>
                      <span className="font-medium text-sm text-gray-700">
                        {PLATFORM_NAMES[post.platform]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {post.content.length} chars
                      </span>
                      <button
                        onClick={() => copyToClipboard(post.content)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
