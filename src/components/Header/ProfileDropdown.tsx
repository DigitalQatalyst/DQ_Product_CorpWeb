import React, { useState } from "react";
import { LogOutIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  // Generate initials from user name if no avatar is available
  const getInitials = () => {
    if (!user || !user.profile?.full_name) return "?";
    const fullName = user.profile.full_name;
    const nameParts = fullName.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`;
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  // Get user's first name for greeting
  const getFirstName = () => {
    if (!user || !user.profile?.full_name) return "";
    return user.profile.full_name.split(" ")[0];
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Show logout confirmation dialog
  const showLogoutConfirm = () => {
    setShowLogoutConfirmation(true);
  };

  // Cancel logout
  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  // Handle logout
  const handleLogout = async () => {
    closeDropdown();
    setShowLogoutConfirmation(false);
    await signOut();
  };

  // If still loading user data, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="ml-2 w-16 h-4 bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  // If no user is authenticated, don't show the dropdown
  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        className="flex items-center"
        onClick={toggleDropdown}
        aria-label="User menu"
      >
        <div className="relative w-10 h-10 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold hover:ring-2 hover:ring-white/30 transition-all">
          {user.profile?.avatar_url ? (
            <img
              src={user.profile.avatar_url}
              alt={user.profile.full_name || "User"}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm">{getInitials()}</span>
          )}
        </div>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={closeDropdown}></div>
          <div className="absolute right-0 mt-2 min-w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
            <div className="py-2">
              {/* Profile */}
              <button
                className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  closeDropdown();
                  navigate("/dashboard/profile");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-3 text-gray-600"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="10" r="3"></circle>
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                </svg>
                <div className="flex-col">
                  <span className="text-base">Profile</span>
                <p className="text-xs text-neutral-500">{user?.profile?.email}</p>
                </div>
              </button>
              
            </div>

            {/* Sign Out - with border and red text */}
            <div className="py-2 border-t border-gray-200">
              <button
                className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  showLogoutConfirm();
                }}
              >
                <LogOutIcon size={20} className="mr-3" />
                <span className="text-base">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
      {/* Logout Confirmation Dialog */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to log out? You will need to sign in again
              to access your account.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={cancelLogout}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                onClick={handleLogout}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
