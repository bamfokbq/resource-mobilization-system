import crypto from 'crypto';

/**
 * Generates a secure temporary password for new users
 * Password requirements:
 * - At least 12 characters long
 * - Contains uppercase letters
 * - Contains lowercase letters  
 * - Contains numbers
 * - Contains special characters
 * - Cryptographically secure
 */
export function generateSecureTemporaryPassword(): string {
  const length = 16;
  const charset = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  // Ensure at least one character from each category
  let password = '';
  password += charset.lowercase[crypto.randomInt(0, charset.lowercase.length)];
  password += charset.uppercase[crypto.randomInt(0, charset.uppercase.length)];
  password += charset.numbers[crypto.randomInt(0, charset.numbers.length)];
  password += charset.symbols[crypto.randomInt(0, charset.symbols.length)];

  // Fill the rest with random characters from all categories
  const allChars = charset.lowercase + charset.uppercase + charset.numbers + charset.symbols;
  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(0, allChars.length)];
  }

  // Shuffle the password to avoid predictable patterns
  return password.split('').sort(() => crypto.randomInt(-1, 2)).join('');
}

/**
 * Validates password strength according to security requirements
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common weak patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain more than 2 consecutive identical characters');
  }

  if (/123|abc|qwe|asd|zxc/i.test(password)) {
    errors.push('Password cannot contain common sequences');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generates a secure random token for password reset or verification
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
