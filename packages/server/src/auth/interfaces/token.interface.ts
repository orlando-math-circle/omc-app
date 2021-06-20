export interface Token {
  iat: number;
  exp?: number;
}

/**
 * Authentication token payload.
 */
export interface AuthPayload extends Token {
  aid?: number;
  uid?: number;
}

/**
 * Email verification token payload.
 */
export interface VerifyPayload extends Token {
  email: string;
}

/**
 * Password reset token payload.
 */
export interface ResetPayload extends Token {
  uid: number;
}

/**
 * Change of email token payload.
 */
export interface ChangeEmailPayload extends Token {
  uid: number;
  email: string;
}
