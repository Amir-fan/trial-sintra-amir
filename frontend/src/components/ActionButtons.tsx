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
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
      <button
        onClick={onGeneratePosts}
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
          onClick={onCopyAllPosts}
          className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <span>📋</span>
          <span>Copy All Posts</span>
        </button>
      )}
    </div>
  );
};
