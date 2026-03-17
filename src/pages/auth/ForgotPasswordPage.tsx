import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, ArrowLeft, AlertCircle, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const isReset = searchParams.get('reset') === 'true';
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const validateResetForm = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isReset && token) {
      // Reset password flow
      if (!validateResetForm()) {
        setIsLoading(false);
        return;
      }

      try {
        const { error } = await supabase.auth.updateUser({
          password: formData.password,
        });

        if (error) {
          setError(error.message || 'Failed to reset password');
        } else {
          setSuccess(true);
        }
      } catch (err) {
        setError('An unexpected error occurred');
      }
    } else {
      // Request reset flow
      const { error, success } = await resetPassword(formData.email);

      if (error) {
        setError(error.message || 'Failed to send reset email');
      } else if (success) {
        setSuccess(true);
      }
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-secondary-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              {isReset ? 'Password reset successful' : 'Reset email sent'}
            </h2>
            
            <p className="text-gray-300 mb-6">
              {isReset 
                ? 'Your password has been successfully reset. You can now sign in with your new password.'
                : `We've sent a password reset link to ${formData.email}. Please check your inbox and follow the instructions.`
              }
            </p>
            
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Continue to login
            </Link>
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
              {isReset 
                ? 'Create a new secure password for your DigitalQatalyst account.'
                : 'Enter your email address and we\'ll send you a link to reset your password.'
              }
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure Password Reset</h3>
                <p className="text-gray-400">Password reset links are secure and expire after 24 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Email Delivery</h3>
                <p className="text-gray-400">Reset instructions are sent directly to your registered email</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Account Security</h3>
                <p className="text-gray-400">Choose a strong password to protect your account data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
      </div>

      {/* Right side - Reset Form */}
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
              {isReset ? 'Create new password' : 'Reset your password'}
            </h2>
            <p className="text-gray-400">
              <Link 
                to="/login" 
                className="font-medium text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to sign in
              </Link>
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
              {!isReset && (
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
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-secondary-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm backdrop-blur-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              )}

              {isReset && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                      New password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-600 placeholder-gray-400 text-white bg-secondary-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm backdrop-blur-sm"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
                      Confirm new password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-600 placeholder-gray-400 text-white bg-secondary-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm backdrop-blur-sm"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {isReset ? 'Resetting password...' : 'Sending reset link...'}
                  </>
                ) : (
                  isReset ? 'Reset password' : 'Send reset link'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
