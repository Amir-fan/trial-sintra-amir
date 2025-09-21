import React from 'react';
import { CalendarDay } from '../types';
import { PLATFORM_NAMES, PLATFORM_COLORS } from '../constants/platforms';

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
import { copyToClipboard } from '../utils/clipboard';

interface ContentCalendarProps {
  calendar: CalendarDay[];
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({ calendar }) => {
  if (calendar.length === 0) return null;

  return (
    <div className="space-y-8 mt-16">
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
