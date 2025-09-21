"use client";

import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Header } from '../components/Header';
import { ProductForm } from '../components/ProductForm';
import { EnhancedFeatures } from '../components/EnhancedFeatures';
import { ActionButtons } from '../components/ActionButtons';
import { PostsDisplay } from '../components/PostsDisplay';
import { ContentCalendar } from '../components/ContentCalendar';
import { ScheduledPosts } from '../components/ScheduledPosts';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAppState } from '../hooks/useAppState';
import { useFormValidation } from '../hooks/useFormValidation';
import { fileToBase64, validateImageFile } from '../utils/fileUtils';
import { copyAllPosts } from '../utils/clipboard';
import { PLATFORM_NAMES } from '../constants/platforms';
import { 
  generatePosts, 
  uploadImage, 
  performWebResearch, 
  generateContentCalendar 
} from '../api';

export default function Home() {
  const {
    product,
    setProduct,
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
    fileInputRef,
    resetGeneratedContent,
  } = useAppState();

  const { errors, validateProduct, clearError, clearAllErrors } = useFormValidation();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid image file');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setSelectedImage(file);
      
      const base64 = await fileToBase64(file);
      const insights = await uploadImage(file);
      setImageInsights(insights);
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleWebResearch = async () => {
    if (!researchQuery.trim()) return;

    try {
      setIsResearching(true);
      setError(null);
      
      const response = await performWebResearch(researchQuery);
      setResearchInsights({ bullets: response.data.insights });
    } catch (err) {
      console.error('Web research error:', err);
      setError('Web research failed. Please try again.');
    } finally {
      setIsResearching(false);
    }
  };

  const handleGeneratePosts = async () => {
    if (!validateProduct(product)) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      clearAllErrors();
      resetGeneratedContent();

      const options = {
        imageBase64: selectedImage ? await fileToBase64(selectedImage) : undefined,
        imageMimeType: selectedImage?.type,
        researchQuery: researchQuery || undefined,
        voice: brandVoice,
        schedulePosts: true,
        timezone,
      };

      const response = await generatePosts(product, options);
      
      setPosts(response.posts);
      if (response.imageInsights) setImageInsights(response.imageInsights);
      if (response.researchInsights) setResearchInsights(response.researchInsights);
      if (response.scheduledPosts) setScheduledPosts(response.scheduledPosts);

      // Generate content calendar
      if (response.posts.length > 0) {
        try {
          const calendarResponse = await generateContentCalendar(response.posts, undefined, timezone);
          setContentCalendar(calendarResponse.calendar);
        } catch (calendarError) {
          console.warn('Calendar generation failed:', calendarError);
        }
      }
    } catch (err) {
      console.error('Generate posts error:', err);
      setError('Failed to generate posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAllPosts = async () => {
    if (posts.length === 0) return;
    
    const allPostsText = copyAllPosts(posts, PLATFORM_NAMES);
    await navigator.clipboard.writeText(allPostsText);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">⚠️</span>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          <ProductForm
            product={product}
            setProduct={setProduct}
            errors={errors}
            clearError={clearError}
            isLoading={isLoading}
          />

          <EnhancedFeatures
            selectedImage={selectedImage}
            imageInsights={imageInsights}
            researchQuery={researchQuery}
            setResearchQuery={setResearchQuery}
            researchInsights={researchInsights}
            brandVoice={brandVoice}
            setBrandVoice={setBrandVoice}
            timezone={timezone}
            setTimezone={setTimezone}
            isUploading={isUploading}
            isResearching={isResearching}
            onImageUpload={handleImageUpload}
            onWebResearch={handleWebResearch}
            fileInputRef={fileInputRef}
          />

          <ActionButtons
            isLoading={isLoading}
            posts={posts}
            onGeneratePosts={handleGeneratePosts}
            onCopyAllPosts={handleCopyAllPosts}
          />

          {isLoading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner message="Generating your social media content..." size="lg" />
            </div>
          )}

          <PostsDisplay posts={posts} />
          <ContentCalendar calendar={contentCalendar} />
          <ScheduledPosts scheduledPosts={scheduledPosts} />
        </main>
      </div>
    </ErrorBoundary>
  );
}
