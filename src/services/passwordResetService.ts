import { supabase } from '../lib/supabase';
import { passwordResetClient } from '../lib/passwordResetClient';

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
}

export interface PasswordResetResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Send password reset email to user
 */
export const requestPasswordReset = async (email: string): Promise<PasswordResetResult> => {
  try {
    console.log('[PasswordReset] Requesting password reset for:', email);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('[PasswordReset] Reset request failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to send password reset email'
      };
    }

    console.log('[PasswordReset] Reset email sent successfully');
    return {
      success: true,
      message: 'Password reset link has been sent to your email address'
    };
  } catch (error: any) {
    console.error('[PasswordReset] Unexpected error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
};

/**
 * Reset password with token from URL hash
 */
export const resetPassword = async (token: string, newPassword: string): Promise<PasswordResetResult> => {
  try {
    console.log('[PasswordReset] Resetting password');
    
    // First verify the token is valid
    const verification = await exchangeCodeForSession(token);
    if (!verification.valid) {
      return {
        success: false,
        error: verification.error || 'Invalid reset token'
      };
    }
    
    // Add timeout and retry for password update to handle Navigator LockManager issues
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`[PasswordReset] Password update attempt ${attempts}/${maxAttempts}`);
      
      try {
        // Set a timeout for the password update
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Password update timeout')), 8000);
        });
        
        const updatePromise = passwordResetClient.auth.updateUser({
          password: newPassword
        });
        
        const { error } = await Promise.race([updatePromise, timeoutPromise]);
        
        if (error) {
          // Check if it's a Navigator LockManager timeout
          if (error.message?.includes('lock') || error.message?.includes('LockManager')) {
            console.warn(`[PasswordReset] Lock timeout on attempt ${attempts}, retrying...`);
            if (attempts < maxAttempts) {
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
          }
          
          console.error('[PasswordReset] Password reset failed:', error);
          return {
            success: false,
            error: error.message || 'Failed to reset password'
          };
        }
        
        console.log('[PasswordReset] Password reset successful');
        return {
          success: true,
          message: 'Password has been reset successfully'
        };
        
      } catch (err: any) {
        console.warn(`[PasswordReset] Attempt ${attempts} failed:`, err.message);
        
        // Check if it's a timeout or lock error
        if (err.message?.includes('lock') || err.message?.includes('LockManager') || err.message?.includes('timeout')) {
          if (attempts < maxAttempts) {
            console.log(`[PasswordReset] Retrying after lock/timeout error...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
        }
        
        // If it's not a lock error or we've exhausted attempts, fail
        console.error('[PasswordReset] Password reset failed:', err);
        return {
          success: false,
          error: err.message || 'Failed to reset password'
        };
      }
    }
    
    // If we get here, all attempts failed
    return {
      success: false,
      error: 'Password reset failed after multiple attempts due to lock timeouts'
    };
    
  } catch (error: any) {
    console.error('[PasswordReset] Unexpected error during password reset:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
};

/**
 * Exchange password reset token for session
 */
export const exchangeCodeForSession = async (token: string): Promise<{ valid: boolean; error?: string }> => {
  try {
    console.log('[PasswordReset] Exchanging code for session with token:', token.substring(0, 20) + '...');
    
    // The token from Supabase verify links is a JWT token
    // We need to use the recovery flow, not verifyOtp
    const { data, error } = await passwordResetClient.auth.getUser(token);
    
    if (error) {
      console.error('[PasswordReset] Token verification failed:', error);
      return {
        valid: false,
        error: 'Invalid or expired reset token'
      };
    }

    // If we can get the user with the token, it's valid
    if (data.user) {
      console.log('[PasswordReset] Token verified successfully, user:', data.user.email);
      return { valid: true };
    } else {
      console.error('[PasswordReset] Token verification failed - no user data');
      return {
        valid: false,
        error: 'Invalid or expired reset token'
      };
    }
    
  } catch (error: any) {
    console.error('[PasswordReset] Unexpected error during token verification:', error);
    return {
      valid: false,
      error: 'Failed to verify reset token'
    };
  }
};
