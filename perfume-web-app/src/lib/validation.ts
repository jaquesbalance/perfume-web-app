/**
 * Input validation utilities for security and data quality
 */

/**
 * Validates and sanitizes search query input
 * @param input Raw search query from user
 * @returns Sanitized search query safe for API use
 */
export function validateSearchInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Limit length to prevent DoS
  let sanitized = input.substring(0, 100);

  // Remove potentially dangerous characters
  // Keep: letters, numbers, spaces, hyphens, apostrophes, periods
  sanitized = sanitized.replace(/[<>{}[\]\\\/=;`"]/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Collapse multiple spaces
  sanitized = sanitized.replace(/\s+/g, ' ');

  return sanitized;
}

/**
 * Validates perfume ID format
 * @param id Perfume ID to validate
 * @returns True if valid format
 */
export function validatePerfumeId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  // Allow alphanumeric and hyphens, 1-50 characters
  return /^[a-zA-Z0-9-]{1,50}$/.test(id);
}

/**
 * Validates category selection
 * @param category Category name to validate
 * @returns True if valid category
 */
export function validateCategory(category: string): boolean {
  const validCategories = [
    'all',
    'floral',
    'woody',
    'fresh',
    'oriental',
    'fruity',
    'gourmand',
  ];

  return validCategories.includes(category.toLowerCase());
}

/**
 * Sanitizes error message for display to user
 * Removes sensitive information like stack traces, internal paths, etc.
 * @param error Error object or message
 * @returns Safe error message for user display
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (!error) {
    return 'An unexpected error occurred';
  }

  if (error instanceof Error) {
    const message = error.message;

    // Remove stack traces
    const cleanMessage = message.split('\n')[0];

    // Remove internal paths
    const noPath = cleanMessage.replace(/\/[^\s]+/g, '[path]');

    // Remove localhost references
    const noLocalhost = noPath.replace(/localhost:\d+/g, '[server]');

    // Generic fallback for common HTTP errors
    if (message.includes('HTTP 404')) {
      return 'The requested resource was not found';
    }
    if (message.includes('HTTP 500')) {
      return 'Server error occurred. Please try again later';
    }
    if (message.includes('HTTP 403')) {
      return 'Access denied';
    }
    if (message.includes('Network') || message.includes('fetch')) {
      return 'Network error. Please check your connection';
    }

    return noLocalhost || 'An error occurred';
  }

  return 'An unexpected error occurred';
}
