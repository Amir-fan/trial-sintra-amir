import { Platform } from '../types';

export const PLATFORM_NAMES: Record<Platform, string> = {
  twitter: "Twitter/X",
  instagram: "Instagram", 
  linkedin: "LinkedIn",
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  twitter: "bg-gradient-to-r from-slate-800 to-slate-900 text-white",
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  linkedin: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
};

// Platform icons will be defined in components that use them
// This avoids JSX in .ts files

export const BRAND_VOICES = [
  { value: 'friendly', label: 'Friendly & Approachable' },
  { value: 'luxury', label: 'Luxury & Premium' },
  { value: 'playful', label: 'Playful & Fun' },
  { value: 'clinical', label: 'Clinical & Professional' },
  { value: 'casual', label: 'Casual & Relaxed' },
] as const;

export const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
] as const;
