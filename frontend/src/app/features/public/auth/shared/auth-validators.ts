export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | null {
  if (!value.trim())               return 'Email is required';
  if (!EMAIL_REGEX.test(value))    return 'Please enter a valid email address';
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value)             return 'Password is required';
  if (value.length < 8)  return 'Password must be at least 8 characters';
  return null;
}

export function validatePasswordConfirm(password: string, confirm: string): string | null {
  if (!confirm)                    return 'Please confirm your password';
  if (password !== confirm)        return 'Passwords do not match';
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required`;
  return null;
}

export function validateMinLength(value: string, min: number, label: string): string | null {
  if (value.trim().length < min) return `${label} must be at least ${min} characters`;
  return null;
}
