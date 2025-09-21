import React from 'react';
import { SocialMediaPost } from '../types';
import { PLATFORM_ICONS, PLATFORM_NAMES, PLATFORM_COLORS } from '../constants/platforms';
import { copyToClipboard } from '../utils/clipboard';

interface PostsDisplayProps {
  posts: SocialMediaPost[];
}

export const PostsDisplay: React.FC<PostsDisplayProps> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Your AI-Generated Posts</h2>
        <p className="text-gray-600 text-lg">Ready to share across your social media platforms</p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

interface PostCardProps {
  post: SocialMediaPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const handleCopy = async () => {
    await copyToClipboard(post.content);
  };

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
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
            onClick={handleCopy}
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
  );
};
