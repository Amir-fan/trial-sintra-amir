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
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Tell Us About Your Product</h2>
        <p className="text-gray-600 text-lg">Fill in the details and let our AI create compelling social media content</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                errors.name 
                  ? 'border-red-300 bg-red-50 focus:border-red-500' 
                  : 'border-gray-200 bg-white focus:border-purple-500 focus:bg-purple-50'
              } focus:outline-none focus:ring-4 focus:ring-purple-100`}
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
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                errors.price 
                  ? 'border-red-300 bg-red-50 focus:border-red-500' 
                  : 'border-gray-200 bg-white focus:border-purple-500 focus:bg-purple-50'
              } focus:outline-none focus:ring-4 focus:ring-purple-100`}
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
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                errors.category 
                  ? 'border-red-300 bg-red-50 focus:border-red-500' 
                  : 'border-gray-200 bg-white focus:border-purple-500 focus:bg-purple-50'
              } focus:outline-none focus:ring-4 focus:ring-purple-100`}
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
            className={`w-full h-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none ${
              errors.description 
                ? 'border-red-300 bg-red-50 focus:border-red-500' 
                : 'border-gray-200 bg-white focus:border-purple-500 focus:bg-purple-50'
            } focus:outline-none focus:ring-4 focus:ring-purple-100`}
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
