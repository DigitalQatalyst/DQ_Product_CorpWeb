import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "./Modal";

import {
  Home as HomeIcon,
  BarChart3 as BarChart3Icon,
  Users as UsersIcon,
  Briefcase as BriefcaseIcon,
  FileText as FileTextIcon,
  Calendar as CalendarIcon,
  Bell as BellIcon,
  Settings as SettingsIcon,
  Building2 as Building2Icon,
  LogOut as LogOutIcon,
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { loggedrole, signOut } = useAuth();
  const userRole = loggedrole?.role?.toLowerCase() || "";

  console.log("Current user role:", userRole);

  // Navigation Configuration
  const navigation = [
    {
      section: "Overview",
      allowedRoles: ["admin", "hr", "creator"],
      items: [
        { path: "/admin-ui/dashboard", label: "Dashboard", icon: <HomeIcon /> },
        { path: "/admin-ui/analytics", label: "Analytics", icon: <BarChart3Icon /> },
      ],
    },
    {
      section: "Recruitment",
      allowedRoles: ["admin", "hr", "creator"],
      items: [
        { path: "/admin-ui/job-applications", label: "Applications", icon: <FileTextIcon /> },
        { path: "/admin-ui/job-applications", label: "CV Screening", icon: <FileTextIcon /> },
        { path: "/admin-ui/job-postings", label: "Job Postings", icon: <BriefcaseIcon /> },
        { path: "/admin-ui/interviews", label: "Interviews", icon: <CalendarIcon /> },
        { path: "/admin-ui/settings", label: "Settings", icon: <SettingsIcon /> },
      ],
    },
    {
      section: "Departments",
      allowedRoles: ["admin"],
      items: [
        { path: "/admin-ui/departments", label: "Manage Departments", icon: <Building2Icon /> },
      ],
    },
    {
      section: "System",
      allowedRoles: ["admin"],
      items: [
        // Only Admin sees these
        { path: "/admin-ui/notifications", label: "Notifications", icon: <BellIcon />, allowedRoles: ["admin"] },
        { path: "/admin-ui/users", label: "User Management", icon: <UsersIcon />, allowedRoles: ["admin"] },
      ],
    },
  ];

  // Filter sections and items based on role
  const visibleNavigation = navigation
    .filter((section) => section.allowedRoles.includes(userRole))
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        // If item has allowedRoles, check them. Otherwise show to everyone in the section.
        if (item.allowedRoles) {
          return item.allowedRoles.includes(userRole);
        }
        return true;
      }),
    }));

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <Header />

      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="mb-10">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
            </div>

            <nav className="flex-1 space-y-8">
              {visibleNavigation.map((section) => (
                <div key={section.section}>
                  <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">
                    {section.section}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          location.pathname === item.path
                            ? "bg-white shadow-sm border border-gray-100 text-black font-semibold ring-1 ring-black/5"
                            : "text-gray-500 hover:text-black hover:bg-gray-100/50"
                        }`}
                      >
                        {React.cloneElement(item.icon, { size: 18 })}
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {visibleNavigation.length === 0 && (
                <p className="px-3 text-gray-500 text-sm">
                  You don't have access to any admin sections.
                </p>
              )}
            </nav>

            {/* Logout Button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 mt-auto"
            >
              <LogOutIcon size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b bg-white flex items-center justify-between">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-xl"
            >
              ☰
            </button>
          </div>

          <div className="flex-1 p-6 overflow-auto">{children}</div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Logout Modal */}
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </>
        }
      >
        Are you sure you want to logout?  
        You will need to sign in again to access the admin panel.
      </Modal>
    </>
  );
};

export default AppLayout;