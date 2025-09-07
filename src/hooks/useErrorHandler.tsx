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
export function useErrorHandler() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorProvider');
  }
  return context;
}


interface ApiError {
  response?: {
    data?: {
      message?: string;
    } & Record<string, unknown>;
    status?: number;
  };
  request?: unknown;
  message?: string;
}

export function handleApiError(error: ApiError, addError: (message: string, severity: ErrorSeverity) => void) {
  let errorMessage = 'An unknown error occurred';
  
  if ('response' in error && error.response) {
    const data = error.response?.data;
    
    if (data?.message) {
      errorMessage = data.message;
    } else if (typeof data === 'string') {
      errorMessage = data;
    } else {
      errorMessage = `Request failed with status ${error.response?.status}`;
    }
  } else if ('request' in error && error.request) {
    errorMessage = 'No response received from server';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  console.error('API Error:', error);
  
  addError(errorMessage, 'error');
  
  return errorMessage;
}

