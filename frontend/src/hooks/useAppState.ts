import { useState, useRef } from 'react';
import { Product, SocialMediaPost, ImageInsights, ResearchInsights, ScheduledPost, CalendarDay, BrandVoice } from '../types';

export const useAppState = () => {
  // Form state
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    category: "",
  });

  // Generated content state
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [imageInsights, setImageInsights] = useState<ImageInsights | null>(null);
  const [researchInsights, setResearchInsights] = useState<ResearchInsights | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [contentCalendar, setContentCalendar] = useState<CalendarDay[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [researchQuery, setResearchQuery] = useState<string>("");
  const [brandVoice, setBrandVoice] = useState<BrandVoice>('friendly');
  const [timezone, setTimezone] = useState<string>('UTC');
  const [isResearching, setIsResearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset functions
  const resetGeneratedContent = () => {
    setPosts([]);
    setImageInsights(null);
    setResearchInsights(null);
    setScheduledPosts([]);
    setContentCalendar([]);
  };

  const resetForm = () => {
    setProduct({
      name: "",
      description: "",
      price: 0,
      category: "",
    });
    setSelectedImage(null);
    setResearchQuery("");
    setError(null);
  };

  const resetAll = () => {
    resetForm();
    resetGeneratedContent();
  };

  return {
    // Form state
    product,
    setProduct,
    
    // Generated content
    posts,
    setPosts,
    imageInsights,
    setImageInsights,
    researchInsights,
    setResearchInsights,
    scheduledPosts,
    setScheduledPosts,
    contentCalendar,
    setContentCalendar,
    
    // UI state
    isLoading,
    setIsLoading,
    error,
    setError,
    selectedImage,
    setSelectedImage,
    researchQuery,
    setResearchQuery,
    brandVoice,
    setBrandVoice,
    timezone,
    setTimezone,
    isResearching,
    setIsResearching,
    isUploading,
    setIsUploading,
    
    // Refs
    fileInputRef,
    
    // Reset functions
    resetGeneratedContent,
    resetForm,
    resetAll,
  };
};
