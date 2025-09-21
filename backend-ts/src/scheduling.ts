import { addDays, addHours, format, parseISO } from 'date-fns';
import { ScheduledPost, SocialMediaPost, Platform } from './types';

/**
 * Post Scheduling Service
 * Provides intelligent scheduling for social media posts
 * with optimal timing recommendations for each platform
 */
export class SchedulingService {
  private readonly timezone: string;

  constructor(timezone: string = 'UTC') {
    this.timezone = timezone;
  }

  /**
   * Creates scheduled posts with optimal timing for each platform
   * @param posts - Array of social media posts to schedule
   * @param startDate - When to start scheduling (ISO string)
   * @returns Array of scheduled posts
   */
  createSchedule(posts: SocialMediaPost[], startDate?: string): ScheduledPost[] {
    const start = startDate ? parseISO(startDate) : new Date();
    const scheduledPosts: ScheduledPost[] = [];
    
    // Platform-specific optimal times (in hours from midnight)
    const optimalTimes = {
      twitter: [9, 12, 15, 18], // Multiple posts per day
      instagram: [11, 14, 17], // Visual content performs better in afternoon
      linkedin: [8, 12, 17] // Professional content during business hours
    };

    let currentDate = new Date(start);
    let timeIndex = 0;

    posts.forEach((post, index) => {
      const platformTimes = optimalTimes[post.platform];
      const timeIndexForPlatform = timeIndex % platformTimes.length;
      const hour = platformTimes[timeIndexForPlatform];
      
      // Create scheduled time
      const scheduledTime = new Date(currentDate);
      scheduledTime.setHours(hour, 0, 0, 0);
      
      // If we've used all times for this platform, move to next day
      if (timeIndexForPlatform === platformTimes.length - 1) {
        currentDate = addDays(currentDate, 1);
        timeIndex = 0;
      } else {
        timeIndex++;
      }

      const scheduledPost: ScheduledPost = {
        id: this.generateId(),
        platform: post.platform,
        content: post.content,
        scheduledTime: scheduledTime.toISOString(),
        timezone: this.timezone,
        status: 'pending'
      };

      scheduledPosts.push(scheduledPost);
    });

    return scheduledPosts;
  }

  /**
   * Gets optimal posting times for a specific platform
   * @param platform - Social media platform
   * @returns Array of optimal hours
   */
  getOptimalTimes(platform: Platform): number[] {
    const optimalTimes = {
      twitter: [9, 12, 15, 18],
      instagram: [11, 14, 17],
      linkedin: [8, 12, 17]
    };

    return optimalTimes[platform];
  }

  /**
   * Generates a 7-day content calendar
   * @param posts - Array of posts to distribute
   * @param startDate - Start date for the calendar
   * @returns 7-day calendar with posts distributed
   */
  generateContentCalendar(posts: SocialMediaPost[], startDate?: string) {
    const start = startDate ? parseISO(startDate) : new Date();
    const calendar = [];

    for (let day = 0; day < 7; day++) {
      const currentDate = addDays(start, day);
      const dayPosts = this.getPostsForDay(posts, day);
      
      calendar.push({
        day: day + 1,
        date: format(currentDate, 'yyyy-MM-dd'),
        dayName: format(currentDate, 'EEEE'),
        posts: dayPosts,
        recommendedTimes: this.getRecommendedTimesForDay(dayPosts)
      });
    }

    return calendar;
  }

  /**
   * Distributes posts across 7 days
   * @param posts - All posts to distribute
   * @param day - Day number (0-6)
   * @returns Posts for the specific day
   */
  private getPostsForDay(posts: SocialMediaPost[], day: number): SocialMediaPost[] {
    const postsPerDay = Math.ceil(posts.length / 7);
    const startIndex = day * postsPerDay;
    const endIndex = Math.min(startIndex + postsPerDay, posts.length);
    
    return posts.slice(startIndex, endIndex);
  }

  /**
   * Gets recommended posting times for a day's posts
   * @param dayPosts - Posts for the day
   * @returns Recommended times
   */
  private getRecommendedTimesForDay(dayPosts: SocialMediaPost[]) {
    const times = new Set<number>();
    
    dayPosts.forEach(post => {
      const optimalTimes = this.getOptimalTimes(post.platform);
      optimalTimes.forEach(time => times.add(time));
    });

    return Array.from(times).sort((a, b) => a - b);
  }

  /**
   * Generates a unique ID for scheduled posts
   * @returns Unique ID string
   */
  private generateId(): string {
    return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validates if a scheduled time is in the future
   * @param scheduledTime - ISO string of scheduled time
   * @returns Boolean indicating if time is valid
   */
  validateScheduledTime(scheduledTime: string): boolean {
    const scheduled = parseISO(scheduledTime);
    const now = new Date();
    return scheduled > now;
  }

  /**
   * Gets timezone-aware formatted time
   * @param scheduledTime - ISO string of scheduled time
   * @returns Formatted time string
   */
  formatScheduledTime(scheduledTime: string): string {
    const scheduled = parseISO(scheduledTime);
    return format(scheduled, 'MMM dd, yyyy - h:mm a');
  }
}
