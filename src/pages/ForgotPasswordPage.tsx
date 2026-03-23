// pages/ForgotPassword.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { requestPasswordReset } from "../services/passwordResetService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await requestPasswordReset(email);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Failed to send password reset email");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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
                  Sent
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Check your email for the password reset link.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Email Sent</h3>
                  <p className="text-gray-400">Password reset instructions have been sent to your email</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Check Your Inbox</h3>
                  <p className="text-gray-400">Look for the reset link in your email (check spam folder too)</p>
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
                Reset Link Sent
              </h2>
              <p className="text-gray-400 mb-8">
                We've sent a password reset link to <span className="text-primary-400 font-medium">{email}</span>. 
                Please check your email and follow the instructions.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Didn't receive the email?{' '}
                  <button
                    onClick={() => setSuccess(false)}
                    className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Try again
                  </button>
                </p>
              </div>
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
              Reset{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                Password
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure Reset</h3>
                <p className="text-gray-400">Password reset links are secure and expire after 24 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Quick Process</h3>
                <p className="text-gray-400">Receive reset instructions instantly in your email</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Email Verified</h3>
                <p className="text-gray-400">Only verified email addresses can reset passwords</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
      </div>

      {/* Right side - Forgot Password Form */}
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
              Forgot your password?
            </h2>
            <p className="text-gray-400">
              No worries, we'll send you reset instructions.
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-secondary-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm backdrop-blur-sm"
                    placeholder="Enter your email"
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
                    Sending reset link...
                  </>
                ) : (
                  'Send reset link'
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