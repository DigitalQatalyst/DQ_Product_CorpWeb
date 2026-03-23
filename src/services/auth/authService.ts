// services/authService.ts

import { supabase } from "@/lib/supabase";


export async function sendPasswordResetEmail(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password reset link sent. Check your email (including spam).',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Failed to send reset email',
    };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password updated successfully. You can now log in.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Failed to update password',
    };
  }
}