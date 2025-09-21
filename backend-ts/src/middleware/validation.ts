import { Request, Response, NextFunction } from 'express';
import { Product } from '../types';
import { createError } from './errorHandler';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  validatedProduct?: Product;
}

export const validateProduct = (product: any): ValidationResult => {
  const errors: string[] = [];

  if (!product || typeof product !== 'object') {
    return { isValid: false, errors: ['Product data is required'] };
  }

  if (!product.name || typeof product.name !== 'string' || product.name.trim().length === 0) {
    errors.push('Product name is required and must be a non-empty string');
  } else if (product.name.length > 200) {
    errors.push('Product name must be 200 characters or less');
  }

  if (!product.description || typeof product.description !== 'string' || product.description.trim().length === 0) {
    errors.push('Product description is required and must be a non-empty string');
  } else if (product.description.length > 2000) {
    errors.push('Product description must be 2000 characters or less');
  }

  if (typeof product.price !== 'number' || product.price < 0) {
    errors.push('Product price is required and must be a non-negative number');
  } else if (product.price > 999999) {
    errors.push('Product price must be less than $999,999');
  }

  if (product.category && (typeof product.category !== 'string' || product.category.length > 100)) {
    errors.push('Product category must be a string with 100 characters or less');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    validatedProduct: {
      name: product.name.trim(),
      description: product.description.trim(),
      price: product.price,
      category: product.category?.trim() || undefined
    }
  };
};

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const { product } = req.body;
  
  if (!product) {
    return res.status(400).json({
      success: false,
      error: 'Product data is required',
      timestamp: new Date().toISOString()
    });
  }

  const validation = validateProduct(product);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: validation.errors,
      timestamp: new Date().toISOString()
    });
  }

  req.body.validatedProduct = validation.validatedProduct;
  next();
};
