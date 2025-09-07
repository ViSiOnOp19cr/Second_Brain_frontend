import { createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react';

// Error types
export type ErrorSeverity = 'error' | 'warning' | 'info' | 'success';

export interface ErrorMessage {
  id: string;
  message: string;
  severity: ErrorSeverity;
  timestamp: number;
}

// Context type definition
interface ErrorContextType {
  errors: ErrorMessage[];
  addError: (message: string, severity?: ErrorSeverity) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
}

// Create context with default values
const ErrorContext = createContext<ErrorContextType>({
  errors: [],
  addError: () => {},
  removeError: () => {},
  clearErrors: () => {},
});

// Provider component
export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<ErrorMessage[]>([]);

  // Add a new error
  const addError = (message: string, severity: ErrorSeverity = 'error') => {
    const newError: ErrorMessage = {
      id: Date.now().toString(),
      message,
      severity,
      timestamp: Date.now(),
    };
    
    setErrors((prevErrors) => [...prevErrors, newError]);

    // Auto-remove errors after 5 seconds
    setTimeout(() => {
      removeError(newError.id);
    }, 5000);
  };

  // Remove an error by ID
  const removeError = (id: string) => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
  };

  // Clear all errors
  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <ErrorContext.Provider
      value={{
        errors,
        addError,
        removeError,
        clearErrors,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
}

// Custom hook for using the error context
export function useErrorHandler() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorProvider');
  }
  return context;
}

// API error handler utility
export function handleApiError(error: any, addError: (message: string, severity: ErrorSeverity) => void) {
  // Extract error message from different possible formats
  let errorMessage = 'An unknown error occurred';
  
  if (error.response) {
    // The request was made and the server responded with an error status
    const data = error.response.data;
    
    if (data.message) {
      errorMessage = data.message;
    } else if (typeof data === 'string') {
      errorMessage = data;
    } else {
      errorMessage = `Request failed with status ${error.response.status}`;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'No response received from server';
  } else if (error.message) {
    // Something happened in setting up the request
    errorMessage = error.message;
  }

  // Log the full error for debugging
  console.error('API Error:', error);
  
  // Add to error context
  addError(errorMessage, 'error');
  
  return errorMessage;
}
