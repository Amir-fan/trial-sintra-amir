import React from 'react';
import { CalendarDay } from '../types';
import { PLATFORM_ICONS, PLATFORM_NAMES, PLATFORM_COLORS } from '../constants/platforms';
import { copyToClipboard } from '../utils/clipboard';

interface ContentCalendarProps {
  calendar: CalendarDay[];
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({ calendar }) => {
  if (calendar.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Content Calendar</h2>
        <p className="text-gray-600 text-lg">Your 7-day posting schedule with optimal timing</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {calendar.map((day, index) => (
          <CalendarDayCard key={index} day={day} />
        ))}
      </div>
    </div>
  );
};

interface CalendarDayCardProps {
  day: CalendarDay;
}

const CalendarDayCard: React.FC<CalendarDayCardProps> = ({ day }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
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
            <PostPreview key={postIndex} post={post} />
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
  );
};

interface PostPreviewProps {
  post: { platform: string; content: string };
}

const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
  const handleCopy = async () => {
    await copyToClipboard(post.content);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded ${PLATFORM_COLORS[post.platform as keyof typeof PLATFORM_COLORS]}`}>
            {PLATFORM_ICONS[post.platform as keyof typeof PLATFORM_ICONS]}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {PLATFORM_NAMES[post.platform as keyof typeof PLATFORM_NAMES]}
          </span>
        </div>
        <button
          onClick={handleCopy}
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
  );
};
