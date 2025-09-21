import { useState, useCallback } from 'react';
import { Product } from '../types';

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateProduct = useCallback((product: Product): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!product.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (product.name.length > 200) {
      newErrors.name = "Product name must be 200 characters or less";
    }
    
    if (!product.description.trim()) {
      newErrors.description = "Product description is required";
    } else if (product.description.length > 2000) {
      newErrors.description = "Product description must be 2000 characters or less";
    }
    
    if (product.price < 0) {
      newErrors.price = "Price must be a non-negative number";
    } else if (product.price > 999999) {
      newErrors.price = "Price must be less than $999,999";
    }
    
    if (product.category && product.category.length > 100) {
      newErrors.category = "Category must be 100 characters or less";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateProduct,
    clearError,
    clearAllErrors,
  };
};
