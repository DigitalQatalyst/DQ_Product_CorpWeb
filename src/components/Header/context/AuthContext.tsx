import React, {
  createContext,
  useContext,
  ReactNode,
} from "react";

type UserRole = "admin" | "creator" | "viewer" | "HR-Admin" | "HR-viewer";

interface Permission {
  resource: string;
  action: string;
  can_perform: boolean;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  supabaseUserId?: string;
  role?: UserRole;
  permissions?: Permission[];
  isNewUser?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isSyncing: boolean;
  syncError: string | null;
  login: () => void;
  signup: () => void;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
  isAdmin: () => boolean;
  isCreator: () => boolean;
  isViewer: () => boolean;
  isHRAdmin: () => boolean;
  isHRViewer: () => boolean;
  refreshAvatar: () => Promise<void>;
}

// Mock auth context for development without authentication
const mockUser: UserProfile = {
  id: "dev-user",
  name: "Development User",
  email: "dev@example.com",
  role: "admin",
  permissions: [],
};

const mockAuthContext: AuthContextType = {
  user: mockUser,
  isLoading: false,
  isSyncing: false,
  syncError: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  hasPermission: () => true,
  isAdmin: () => true,
  isCreator: () => true,
  isViewer: () => true,
  isHRAdmin: () => true,
  isHRViewer: () => true,
  refreshAvatar: async () => {},
};

const AuthContext = createContext<AuthContextType | undefined>(mockAuthContext);

export function AuthProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Return mock context directly - no authentication needed
  return (
    <AuthContext.Provider value={mockAuthContext}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { supabase } from "../../../lib/supabase";
