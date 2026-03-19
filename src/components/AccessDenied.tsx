import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldOff, Home, LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface AccessDeniedProps {
  /** Custom message explaining what resource/role is needed */
  message?: string;
  /** If true the component takes the full viewport */
  fullPage?: boolean;
}

/**
 * Shown when a user is authenticated but does not have the required
 * role / permission for the current page.
 */
export const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "You do not have permission to access this page.",
  fullPage = true,
}) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Force redirect even if logout fails
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const wrapper = fullPage
    ? "min-h-screen bg-gray-50 flex items-center justify-center p-6"
    : "flex items-center justify-center p-8";

  return (
    <div className={wrapper}>
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 border border-red-100">
          <ShieldOff className="text-red-400" size={36} />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-sm text-gray-500">{message}</p>
        </div>

        {/* Role badge hint */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full text-xs font-medium text-amber-700">
          <ShieldOff size={14} />
          Insufficient permissions
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut size={16} />
                Logout
              </>
            )}
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Refresh
              </>
            )}
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Home size={16} />
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
