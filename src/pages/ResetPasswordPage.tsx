import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, AlertCircle, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { exchangeCodeForSession, resetPassword } from "../services/passwordResetService";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    console.log('[ResetPasswordPage] URL params and hash:', {
      searchParams: Object.fromEntries(searchParams.entries()),
      hash: window.location.hash,
      fullUrl: window.location.href,
      pathname: window.location.pathname
    });

    // Handle different Supabase reset URL formats:
    // 1. /auth/v1/verify?token=... (from email)
    // 2. /reset-password#access_token=... (hash format)
    // 3. /reset-password?token=... (query format)
    let urlToken = null;
    
    // Try to get token from query parameters first (email links)
    urlToken = searchParams.get("token");
    console.log('[ResetPasswordPage] Token from query params:', urlToken);
    
    // Try to get token from hash (fallback format)
    if (!urlToken && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      urlToken = hashParams.get('access_token');
      console.log('[ResetPasswordPage] Token from hash:', urlToken);
    }
    
    // Try refresh_token as fallback
    if (!urlToken && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      urlToken = hashParams.get('refresh_token');
      console.log('[ResetPasswordPage] Refresh token from hash:', urlToken);
    }
    
    if (urlToken) {
      setToken(urlToken);
      verifyToken(urlToken);
    } else {
      console.error('[ResetPasswordPage] No token found in URL');
      setError("Invalid reset link - no token found");
      setVerifying(false);
    }
  }, [searchParams]);

  const verifyToken = async (resetToken: string) => {
    try {
      const result = await exchangeCodeForSession(resetToken);
      if (result.valid) {
        setTokenValid(true);
      } else {
        setError(result.error || "Invalid or expired reset link");
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify reset link");
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await resetPassword(token, newPassword);
      
      if (result.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setError(result.error || "Failed to reset password");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-900/40" />
          <div className="relative z-10 flex flex-col justify-center px-12 py-16">
            <div className="mb-8">
              <img
                src="/images/DQ Logo White.svg"
                alt="DigitalQatalyst"
                className="h-12 mb-8"
              />
              <h1 className="text-4xl font-bold text-white mb-4">
                Invalid Reset{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                  Link
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                This password reset link is invalid or has expired.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Link Expired</h3>
                  <p className="text-gray-400">Password reset links expire after 24 hours for security</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Request New Link</h3>
                  <p className="text-gray-400">You can request a new password reset link anytime</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
        </div>

        {/* Right side - Error Message */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Link to="/" className="inline-block lg:hidden mb-8">
                <img
                  src="/images/DQ Logo White.svg"
                  alt="DigitalQatalyst"
                  className="h-10 mx-auto"
                />
              </Link>
              
              <div className="mx-auto h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Invalid Reset Link
              </h2>
              <p className="text-gray-400 mb-8">
                {error || "This password reset link is invalid or has expired."}
              </p>
            </div>

            <div className="space-y-4">
              <Link
                to="/forgot-password"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Request New Reset Link
              </Link>
              
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 text-sm font-medium rounded-lg text-gray-300 bg-secondary-800/50 hover:bg-secondary-800/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-900/40" />
          <div className="relative z-10 flex flex-col justify-center px-12 py-16">
            <div className="mb-8">
              <img
                src="/images/DQ Logo White.svg"
                alt="DigitalQatalyst"
                className="h-12 mb-8"
              />
              <h1 className="text-4xl font-bold text-white mb-4">
                Password Reset{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                  Successful
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Your password has been reset successfully.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Password Updated</h3>
                  <p className="text-gray-400">Your password has been changed successfully</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Secure Access</h3>
                  <p className="text-gray-400">You can now login with your new password</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
        </div>

        {/* Right side - Success Message */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Link to="/" className="inline-block lg:hidden mb-8">
                <img
                  src="/images/DQ Logo White.svg"
                  alt="DigitalQatalyst"
                  className="h-10 mx-auto"
                />
              </Link>
              
              <div className="mx-auto h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Password Reset Successful
              </h2>
              <p className="text-gray-400 mb-8">
                Your password has been reset successfully. You will be redirected to the login page in a few seconds.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-900/40" />
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="mb-8">
            <img
              src="/images/DQ Logo White.svg"
              alt="DigitalQatalyst"
              className="h-12 mb-8"
            />
            <h1 className="text-4xl font-bold text-white mb-4">
              Reset Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                Password
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Enter your new password below to secure your account.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure Password</h3>
                <p className="text-gray-400">Choose a strong password with at least 8 characters</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Instant Update</h3>
                <p className="text-gray-400">Your password will be updated immediately</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">One-Time Link</h3>
                <p className="text-gray-400">This reset link can only be used once for security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
      </div>

      {/* Right side - Reset Password Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block lg:hidden mb-8">
              <img
                src="/images/DQ Logo White.svg"
                alt="DigitalQatalyst"
                className="h-10 mx-auto"
              />
            </Link>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              Reset Your Password
            </h2>
            <p className="text-gray-400">
              Enter your new password below.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-200 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-600 placeholder-gray-400 text-white bg-secondary-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm backdrop-blur-sm"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-secondary-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm backdrop-blur-sm"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>

            <div className="flex items-center justify-center">
              <Link
                to="/login"
                className="flex items-center text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
