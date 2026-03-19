import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "./Modal";
import {
  Home as HomeIcon,
  BookOpen as BookOpenIcon,
  Settings as SettingsIcon,
  Users as UsersIcon,
  Tag as TagIcon,
  MessageSquare as MessageIcon,
  Briefcase as BriefcaseIcon,
  FileText as FileTextIcon,
  BarChart3 as BarChart3Icon,
  Calendar as CalendarIcon,
  Bell as BellIcon,
  Lock as LockIcon,
  LogOut as LogOutIcon,
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

type NavItem = {
  path: string;
  label: string;
  icon: React.ReactElement;
  /** Minimum role required to see this nav item. undefined = any logged-in user */
  minRole?: "admin" | "creator" | "HR-Admin" | "HR-viewer";
};

type NavSection = {
  section: string;
  items: NavItem[];
};

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAdmin, isCreator, isHRAdmin, isHRViewer, signOut } = useAuth();

  const allNavigationItems: NavSection[] = [
    {
      section: "Overview",
      items: [
        { path: "/admin-ui/dashboard", label: "Dashboard", icon: <HomeIcon /> },
        {
          path: "/admin-ui/analytics",
          label: "Analytics",
          icon: <BarChart3Icon />,
          minRole: "HR-viewer",
        },
      ],
    },
    {
      section: "Recruitment",
      items: [
        {
          path: "/admin-ui/job-applications",
          label: "Applications",
          icon: <BriefcaseIcon />,
          minRole: "HR-Admin",
        },
        {
          path: "/admin-ui/job-applications",
          label: "CV Screening",
          icon: <FileTextIcon />,
          minRole: "HR-viewer",
        },
        {
          path: "/admin-ui/job-postings",
          label: "Job Postings",
          icon: <FileTextIcon />,
          minRole: "HR-Admin",
        },
        {
          path: "/admin-ui/interviews",
          label: "Interviews",
          icon: <CalendarIcon />,
          minRole: "HR-Admin",
        },
      ],
    },
    {
      section: "System",
      items: [
        {
          path: "/admin-ui/notifications",
          label: "Notifications",
          icon: <BellIcon />,
          minRole: "creator",
        },
        {
          path: "/admin-ui/users",
          label: "User Management",
          icon: <UsersIcon />,
          minRole: "admin",
        },
        {
          path: "/admin-ui/settings",
          label: "Settings",
          icon: <SettingsIcon />,
          minRole: "admin",
        },
      ],
    },
  ];

  /**
   * Determine whether the current user meets the minimum role requirement
   * for a nav item.
   */
  const canSeeItem = (item: NavItem): boolean => {
    if (!item.minRole) return true;
    if (item.minRole === "creator" && isCreator()) return true;
    if (item.minRole === "admin" && isAdmin()) return true;
    if (item.minRole === "HR-Admin" && isHRAdmin()) return true;
    if (item.minRole === "HR-viewer" && isHRViewer()) return true;
    return false;
  };

  /**
   * Filter nav sections: only include items the user can see.
   * Sections with no visible items are omitted.
   */
  const visibleNavigationItems = allNavigationItems
    .map((section) => ({
      ...section,
      items: section.items.filter(canSeeItem),
    }))
    .filter((section) => section.items.length > 0);

  const handleLogout = async () => {
    console.log('Logout button clicked');
    setIsLoggingOut(true);
    
    try {
      // Try the normal logout first with timeout
      const logoutPromise = signOut();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Logout timeout')), 3000)
      );
      
      const result = await Promise.race([logoutPromise, timeoutPromise]);
      console.log('SignOut result:', result);
      
      if (result && (result as any).error) {
        console.error('Logout failed:', (result as any).error);
      }
      
      console.log('Logout successful, redirecting...');
    } catch (error) {
      console.error('Logout exception:', error);
      // Even if there's an error, continue with logout
    } finally {
      // Always close modal and redirect, regardless of outcome
      setIsLoggingOut(false);
      setShowLogoutModal(false);
      
      // Clear any remaining auth data from localStorage
      try {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.refreshToken');
        // Clear all supabase related items
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase.')) {
            localStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.warn('Failed to clear localStorage:', e);
      }
      
      // Force redirect to home page
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header from main app */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`bg-[#fafafa] border-r border-gray-200 w-64 fixed h-[calc(100vh-64px)] overflow-y-auto z-40 transition-transform duration-300 md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="p-4 space-y-6">
            {visibleNavigationItems.map((section) => (
              <div key={section.section} className="space-y-1">
                <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  {section.section}
                </div>
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() =>
                      window.innerWidth < 768 ? setSidebarOpen(false) : null
                    }
                    className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-white shadow-sm border border-gray-100 text-black font-semibold ring-1 ring-black/5"
                        : "text-gray-500 hover:text-black hover:bg-gray-100/50"
                    }`}
                  >
                    <span
                      className={`${location.pathname === item.path ? "text-black" : "text-gray-400"}`}
                    >
                      {React.cloneElement(
                        item.icon as React.ReactElement<{ size?: number }>,
                        {
                          size: 18,
                        },
                      )}
                    </span>
                    <span className="ml-3 font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            ))}

            {/* If no sections are visible (e.g. viewer role), show a hint */}
            {visibleNavigationItems.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <LockIcon className="text-gray-300" size={28} />
                <p className="text-xs text-gray-400 font-medium">
                  You don't have access to any admin sections.
                </p>
              </div>
            )}

            {/* Logout button */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
              >
                <LogOutIcon size={18} />
                <span className="ml-3 font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 md:ml-64 transition-all duration-300">
          <div className="px-6 py-8 md:px-10 lg:px-12 w-full max-w-[1600px]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {title}
              </h1>
            </div>
            {children}
          </div>
        </main>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Logout confirmation modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setShowLogoutModal(false)}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoggingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging out...
                </>
              ) : (
                <>
                  <LogOutIcon size={16} />
                  Logout
                </>
              )}
            </button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <LogOutIcon className="text-red-600" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Are you sure you want to logout?
          </h3>
          <p className="text-sm text-gray-500">
            You will need to sign in again to access the admin panel.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AppLayout;
