import React from 'react';
import { ScheduledPost } from '../types';
import { PLATFORM_NAMES, PLATFORM_COLORS } from '../constants/platforms';

const PLATFORM_ICONS = {
  twitter: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
};
import { copyToClipboard, formatScheduledTime } from '../utils/clipboard';

interface ScheduledPostsProps {
  scheduledPosts: ScheduledPost[];
}

export const ScheduledPosts: React.FC<ScheduledPostsProps> = ({ scheduledPosts }) => {
  if (scheduledPosts.length === 0) return null;

  return (
    <div className="space-y-8 mt-16">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Scheduled Posts</h2>
        <p className="text-gray-600 text-lg">Posts ready for publishing with optimal timing</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scheduledPosts.map((scheduledPost) => (
          <ScheduledPostCard key={scheduledPost.id} scheduledPost={scheduledPost} />
        ))}
      </div>
    </div>
  );
};

interface ScheduledPostCardProps {
  scheduledPost: ScheduledPost;
}

const ScheduledPostCard: React.FC<ScheduledPostCardProps> = ({ scheduledPost }) => {
  const handleCopy = async () => {
    await copyToClipboard(scheduledPost.content);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
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
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(scheduledPost.status)}`}>
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
          onClick={handleCopy}
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
  );
};
