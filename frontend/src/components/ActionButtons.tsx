import React from 'react';
import { SocialMediaPost } from '../types';
import { PLATFORM_NAMES } from '../constants/platforms';
import { copyAllPosts } from '../utils/clipboard';

interface ActionButtonsProps {
  isLoading: boolean;
  posts: SocialMediaPost[];
  onGeneratePosts: () => void;
  onCopyAllPosts: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isLoading,
  posts,
  onGeneratePosts,
  onCopyAllPosts,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
      <button
        onClick={onGeneratePosts}
        disabled={isLoading}
        className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100 border border-blue-500/20"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-3">
            <img 
              src="/images/astronaut-2.png" 
              alt="Working..." 
              className="w-8 h-8 animate-spin"
            />
            <span>Generating Content...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Generate Posts</span>
          </div>
        )}
      </button>
      
      {posts.length > 0 && (
        <button
          onClick={onCopyAllPosts}
          className="px-8 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 border border-emerald-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Copy All Posts</span>
        </button>
      )}
    </div>
  );
};
