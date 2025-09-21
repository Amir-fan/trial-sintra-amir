import React from 'react';
import { Product } from '../types';
import { useFormValidation } from '../hooks/useFormValidation';

interface ProductFormProps {
  product: Product;
  setProduct: (product: Product) => void;
  errors: Record<string, string>;
  clearError: (field: string) => void;
  isLoading: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  setProduct,
  errors,
  clearError,
  isLoading,
}) => {
  const handleFieldChange = (field: keyof Product, value: string | number) => {
    setProduct({ ...product, [field]: value });
    if (errors[field]) {
      clearError(field);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Information</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">Tell us about your product and we'll create compelling social media content that resonates with your audience</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                errors.name 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-100'
              } focus:outline-none focus:ring-4`}
              value={product.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="EcoBottle Pro"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                errors.price 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-100'
              } focus:outline-none focus:ring-4`}
              value={product.price || ''}
              onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
              placeholder="49.99"
              disabled={isLoading}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.price}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Category (optional)
            </label>
            <input
              type="text"
              className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                errors.category 
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-100'
              } focus:outline-none focus:ring-4`}
              value={product.category || ""}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              placeholder="Health & Wellness"
              disabled={isLoading}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.category}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full h-full px-4 py-4 rounded-xl border-2 transition-all duration-200 resize-none text-gray-900 placeholder-gray-500 ${
              errors.description 
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-100' 
                : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-100'
            } focus:outline-none focus:ring-4`}
            rows={8}
            value={product.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            placeholder="Revolutionary reusable water bottle with built-in UV purification technology. Made from sustainable materials, keeps water fresh for 24 hours, and helps reduce plastic waste. Perfect for eco-conscious consumers who want to stay hydrated while protecting the planet."
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-2 flex items-center">
              <span className="mr-1">⚠️</span>
              {errors.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
