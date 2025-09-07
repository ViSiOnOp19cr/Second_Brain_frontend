// Form validation utility functions

/**
 * Validates an email address
 * @param email Email address to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};

/**
 * Validates a password meets minimum requirements
 * @param password Password to validate
 * @param minLength Minimum password length (default: 8)
 * @returns Boolean indicating if password is valid
 */
export const isValidPassword = (password: string, minLength = 8): boolean => {
  return password.length >= minLength;
};

/**
 * Validates a URL
 * @param url URL to validate
 * @returns Boolean indicating if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    // Check if it starts with http:// or https://
    if (!url.match(/^https?:\/\//)) {
      return false;
    }
    
    // Try to create a URL object (will throw if invalid)
    new URL(url);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

/**
 * Validates if a string is not empty
 * @param value String to validate
 * @returns Boolean indicating if string is not empty
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};
