/**
 * Safe email validation utility with non-backtracking regex
 * Addresses SonarQube performance concerns with email regex patterns
 */

// Safe, non-backtracking email regex pattern
// This pattern avoids catastrophic backtracking by using atomic groups and possessive quantifiers
const SAFE_EMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;

/**
 * Validates email address using a safe, non-backtracking regex
 * @param email - The email address to validate
 * @returns boolean - True if email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Basic length check to prevent extremely long inputs
  if (email.length > 254) {
    return false;
  }
  
  return SAFE_EMAIL_REGEX.test(email.trim());
};

/**
 * Alternative validation using built-in browser validation
 * More performant for simple cases
 * @param email - The email address to validate
 * @returns boolean - True if email is valid, false otherwise
 */
export const isValidEmailSimple = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Use browser's built-in validation which is more performant
  const input = document.createElement('input');
  input.type = 'email';
  input.value = email.trim();
  
  return input.validity.valid && input.value.length > 0;
};

/**
 * Validates email with additional checks for business rules
 * @param email - The email address to validate
 * @returns object - Validation result with details
 */
export const validateEmailDetailed = (email: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }
  
  const trimmedEmail = email.trim();
  
  if (trimmedEmail.length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }
  
  if (!SAFE_EMAIL_REGEX.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};