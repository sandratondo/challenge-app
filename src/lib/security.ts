// Security constants
export const SECURITY = {
  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
    SALT_ROUNDS: 12,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    REGEX_MESSAGE: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
  },
  
  // JWT configuration
  JWT: {
    EXPIRES_IN: '1d',
    COOKIE_NAME: 'token',
    COOKIE_OPTIONS: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24, // 1 day
    },
  },

  // Rate limiting
  RATE_LIMIT: {
    MAX_REQUESTS: 5,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },

  // Reset token
  RESET_TOKEN: {
    EXPIRY_HOURS: 1,
    BYTES_LENGTH: 32,
  },
};

// Security helper functions
export const security = {
  // Sanitize user input
  sanitizeInput: (input: string): string => {
    return input.replace(/[<>]/g, '');
  },

  // Generate a secure random token
  generateSecureToken: (length: number = SECURITY.RESET_TOKEN.BYTES_LENGTH): string => {
    return require('crypto').randomBytes(length).toString('hex');
  },

  // Validate password strength
  validatePasswordStrength: (password: string): boolean => {
    return SECURITY.PASSWORD.REGEX.test(password);
  },

  // Check if password is in common passwords list
  isCommonPassword: (password: string): boolean => {
    const commonPasswords = [
      'password123',
      '12345678',
      'qwerty123',
      'admin123',
      'letmein123',
    ];
    return commonPasswords.includes(password.toLowerCase());
  },
}; 