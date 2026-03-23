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
  minRole?: "admin" | "creator" | "hr";
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
  const { isAdmin, isCreator, isHR, isHRAdmin, isHRViewer, signOut } = useAuth();

  console.log('[AppLayout] User roles:', {
    isAdmin: isAdmin(),
    isCreator: isCreator(),
    isHR: isHR(),
    isHRUser: isHR()
  });

  const allNavigationItems: NavSection[] = [
    {
      section: "Overview",
      items: [
        { path: "/admin-ui/dashboard", label: "Dashboard", icon: <HomeIcon /> },
        {
          path: "/admin-ui/analytics",
          label: "Analytics",
          icon: <BarChart3Icon />,
          minRole: "hr",
        },
        {
          path: "/dashboard/profile",
          label: "Profile",
          icon: <UsersIcon />,
          minRole: "hr",
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
          minRole: "hr",
        },
        {
          path: "/admin-ui/job-applications",
          label: "CV Screening",
          icon: <FileTextIcon />,
          minRole: "hr",
        },
        {
          path: "/admin-ui/job-postings",
          label: "Job Postings",
          icon: <FileTextIcon />,
          minRole: "admin",
        },
        {
          path: "/admin-ui/interviews",
          label: "Interviews",
          icon: <CalendarIcon />,
          minRole: "hr",
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
    if (item.minRole === "hr" && isHR()) return true;
    return false;
  };

  /**
   * HR users should only see Overview and Recruitment sections
   * This overrides the hierarchical permissions for HR users
   */
  const isHRUser = (): boolean => {
    return isHR();
  };

  /**
   * Filter nav sections: only include items the user can see.
   * HR users are restricted to Overview and Recruitment sections only.
   * Sections with no visible items are omitted.
   */
  const visibleNavigationItems = allNavigationItems
    .filter((section) => {
      // HR users can only see Overview and Recruitment sections
      if (isHRUser()) {
        return section.section === "Overview" || section.section === "Recruitment";
      }
      return true;
    })
    .map((section) => ({
      ...section,
      items: section.items.filter(canSeeItem),
    }))
    .filter((section) => section.items.length > 0);

  // Debug logging for navigation
  console.log('[AppLayout] Visible navigation sections:', visibleNavigationItems);
  console.log('[AppLayout] All navigation sections:', allNavigationItems);
  
  // Additional debugging for admin users
  if (isAdmin()) {
    console.log('[AppLayout] Admin user detected, should see all sections');
    console.log('[AppLayout] canSeeItem results for each section:');
    allNavigationItems.forEach(section => {
      console.log(`- ${section.section}:`, section.items.map(item => ({
        label: item.label,
        minRole: item.minRole,
        canSee: canSeeItem(item)
      })));
    });
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      console.log('[AppLayout] Starting logout process...');
      
      // Start timeout for force logout
      const logoutTimeout = setTimeout(() => {
        console.warn('[AppLayout] Logout timeout - forcing logout');
        forceLogout();
      }, 5000); // 5 second timeout
      
      // Call AuthContext signOut which now includes comprehensive cleanup
      await signOut();
      
      // Clear timeout if logout completed successfully
      clearTimeout(logoutTimeout);
      
      // Additional cleanup to ensure everything is cleared
      setTimeout(() => {
        forceLogout();
      }, 1000);
      
    } catch (error) {
      console.error('[AppLayout] Logout error:', error);
      // Force logout even on error
      forceLogout();
    }
  };
  
  const forceLogout = () => {
    console.log('[AppLayout] Force logout - clearing all data...');
    
    // Clear all storage comprehensively
    try {
      // Clear localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('auth')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('auth')) {
          sessionStorage.removeItem(key);
        }
      });
      
      // Clear cookies
      document.cookie.split(';').forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.includes('supabase') || name.includes('auth')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        }
      });
      
      console.log('[AppLayout] All storage cleared');
    } catch (error) {
      console.error('[AppLayout] Error clearing storage:', error);
    }
    
    // Always close modal and redirect
    setIsLoggingOut(false);
    setShowLogoutModal(false);
    
    // Force hard redirect to clear any remaining memory
    window.location.href = '/';
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
