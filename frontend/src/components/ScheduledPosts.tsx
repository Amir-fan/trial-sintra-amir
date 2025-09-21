import React from 'react';
import { ScheduledPost } from '../types';
import { PLATFORM_ICONS, PLATFORM_NAMES, PLATFORM_COLORS } from '../constants/platforms';
import { copyToClipboard, formatScheduledTime } from '../utils/clipboard';

interface ScheduledPostsProps {
  scheduledPosts: ScheduledPost[];
}

export const ScheduledPosts: React.FC<ScheduledPostsProps> = ({ scheduledPosts }) => {
  if (scheduledPosts.length === 0) return null;

  return (
    <div className="space-y-8">
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
