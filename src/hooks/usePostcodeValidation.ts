import { useState, useCallback } from 'react';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

export interface PostcodeValidationResult {
  isValid: boolean;
  status: '0' | '1';
  data: any;
  message: string;
  isLoading: boolean;
  error: string | null;
}

export const usePostcodeValidation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validatePostcode = useCallback(async (postcode: string): Promise<PostcodeValidationResult> => {
    if (!postcode || postcode.trim() === '') {
      return {
        isValid: false,
        status: '0',
        data: null,
        message: 'Postcode is required',
        isLoading: false,
        error: 'Postcode is required'
      };
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = buildApiUrl(`${API_ENDPOINTS.POSTCODES}?search=${encodeURIComponent(postcode.trim())}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      const result: PostcodeValidationResult = {
        isValid: data?.status === '1',
        status: data?.status || '0',
        data: data?.data || null,
        message: data?.message || 'Postcode validation failed',
        isLoading: false,
        error: null
      };

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate postcode';
      setError(errorMessage);
      
      return {
        isValid: false,
        status: '0',
        data: null,
        message: 'Postcode validation failed',
        isLoading: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    validatePostcode,
    isLoading,
    error
  };
};
