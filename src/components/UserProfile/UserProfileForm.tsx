import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/Header/context/AuthContext";
import { updateUserProfile } from "@/lib/supabase";
import { Mail, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { isValidEmail } from "../../utils/emailValidation";

interface UserProfileFormProps {
  readonly onSuccess?: () => void;
}

export function UserProfileForm({ onSuccess }: Readonly<UserProfileFormProps>) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setOriginalEmail(user.email || "");
      setName(user.name || "");
    }
  }, [user]);

  // Check for changes
  useEffect(() => {
    const changed = email !== originalEmail || name !== user?.name;
    setHasChanges(changed);
  }, [email, name, originalEmail, user?.name]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate inputs
    if (!email?.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address (e.g., user@domain.com)");
      return;
    }

    if (!name?.trim()) {
      setError("Name is required");
      return;
    }

    if (!user?.supabaseUserId) {
      setError("Unable to identify user. Please try logging in again.");
      return;
    }

    setIsLoading(true);

    try {
      const updates: Record<string, unknown> = {};

      // Only include fields that have changed
      if (email !== originalEmail) {
        updates.email = email.trim();
      }
      if (name !== user?.name) {
        updates.name = name.trim();
      }

      if (Object.keys(updates).length === 0) {
        setError("No changes to save");
        setIsLoading(false);
        return;
      }

      await updateUserProfile(user.supabaseUserId, updates);

      // Update local state
      if (email !== originalEmail) {
        setOriginalEmail(email);
      }

      setSuccess("Profile updated successfully!");
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      console.error("Profile update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEmail(originalEmail);
    setName(user?.name || "");
    setError(null);
    setSuccess(null);
  };

  if (!user) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Please log in to edit your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <CheckCircle size={20} className="flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Your name"
          />
          <p className="mt-1 text-sm text-gray-500">
            Your full name or display name
          </p>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
          >
            <Mail size={16} />
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={false}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:border-gray-400 transition-colors"
            placeholder="your.email@domain.com"
          />
          <p className="mt-1 text-sm text-gray-500">
            Your email address (must be in format: user@domain.com)
          </p>
          {email && !isValidEmail(email) && (
            <p className="mt-1 text-sm text-red-600">Invalid email format</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading || !hasChanges || !isValidEmail(email)}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Changes to your email will be reflected
            immediately across the application.
          </p>
        </div>
      </form>
    </div>
  );
}
