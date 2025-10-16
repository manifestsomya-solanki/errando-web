import React, { useState, useEffect } from 'react';
import Input from './Input';
import { usePostcodeValidation } from '../../hooks/usePostcodeValidation';

interface ValidatedPostcodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, status: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  showValidationMessage?: boolean;
}

const ValidatedPostcodeInput: React.FC<ValidatedPostcodeInputProps> = ({
  value,
  onChange,
  onValidationChange,
  placeholder = "Enter Postcode",
  className = "",
  id = "postcode",
  name = "postcode",
  disabled = false,
  required = true,
  showValidationMessage = true
}) => {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [validationStatus, setValidationStatus] = useState<'0' | '1' | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  
  const { validatePostcode, isLoading } = usePostcodeValidation();

  // Debounced validation
  useEffect(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (value && value.trim() !== '') {
      const timer = setTimeout(async () => {
        const result = await validatePostcode(value);
        setValidationStatus(result.status);
        setShowMessage(true);
        
        if (onValidationChange) {
          onValidationChange(result.isValid, result.status);
        }
      }, 500); // 0.5 second debounce for faster validation

      setDebounceTimer(timer);
    } else {
      setValidationStatus(null);
      setShowMessage(false);
      if (onValidationChange) {
        onValidationChange(false, '0');
      }
    }

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [value, validatePostcode, onValidationChange]);

  const getInputClassName = () => {
    let baseClass = `items-center bg-transparent dark:bg-black w-full text-md text-slate-700 border-slate-500 outline-none font-medium font-poppins border rounded-lg ease-in focus:caret-slate-500 ${className}`;
    
    if (showValidationMessage && validationStatus === '0') {
      baseClass += ' border-red-500 focus:border-red-500';
    } else if (showValidationMessage && validationStatus === '1') {
      baseClass += ' border-green-500 focus:border-green-500';
    }
    
    return baseClass;
  };

  const getValidationMessage = () => {
    if (!showMessage) return null;
    
    if (validationStatus === '1') {
      return (
        <div className="text-green-600 text-sm mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Valid postcode
        </div>
      );
    } else if (validationStatus === '0') {
      return (
        <div className="text-red-600 text-sm mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Invalid postcode
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Input
          id={id}
          name={name}
          className={getInputClassName()}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      {showValidationMessage && getValidationMessage()}
    </div>
  );
};

export default ValidatedPostcodeInput;
