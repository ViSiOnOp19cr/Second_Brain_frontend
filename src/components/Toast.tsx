import { useEffect, useState } from 'react';
import type { ErrorMessage, ErrorSeverity } from '../hooks/useErrorHandler';

interface ToastProps {
  error: ErrorMessage;
  onClose: (id: string) => void;
}

export const Toast = ({ error, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { id, message, severity } = error;

  useEffect(() => {
    // Animate out before removing
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4700); // Slightly before the 5s timeout in ErrorProvider

    return () => clearTimeout(timer);
  }, [id]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300); // Wait for animation to finish
  };

  const getBgColor = (severity: ErrorSeverity): string => {
    switch (severity) {
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-700';
    }
  };

  return (
    <div
      className={`${
        getBgColor(severity)
      } text-white p-4 rounded-lg shadow-lg flex justify-between items-center mb-2 transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <p>{message}</p>
      <button
        onClick={handleClose}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        aria-label="Close notification"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export const ToastContainer = ({
  errors,
  onClose,
}: {
  errors: ErrorMessage[];
  onClose: (id: string) => void;
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-md">
      {errors.map((error) => (
        <Toast key={error.id} error={error} onClose={onClose} />
      ))}
    </div>
  );
};
