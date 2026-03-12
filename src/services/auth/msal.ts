import {
  PublicClientApplication,
  Configuration,
  BrowserCacheLocation,
  LogLevel,
} from "@azure/msal-browser";

// Support both NEXT_PUBLIC_* and VITE_* envs
const env = (import.meta as any).env as Record<string, string | undefined>;

const CLIENT_ID = env.VITE_MSAL_CLIENT_ID || "";
if (!CLIENT_ID) {
  console.warn("VITE_MSAL_CLIENT_ID is not set in environment variables.");
}

const REDIRECT_URI = env.VITE_MSAL_REDIRECT_URI || window.location.origin;

const POST_LOGOUT_REDIRECT_URI =
  env.VITE_MSAL_POST_LOGOUT_REDIRECT_URI || REDIRECT_URI;
const API_SCOPES = (env.NEXT_PUBLIC_API_SCOPES || env.VITE_AZURE_SCOPES || "")
  .split(/[\s,]+/)
  .map((s) => s.trim())
  .filter(Boolean);

// Always request standard OIDC scopes; include email to avoid UPN-only claims and offline_access for refresh tokens
const DEFAULT_OIDC_SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
] as const;

// Vite exposes only VITE_* via import.meta.env (not process.env)
const AUTHORITY_SIGNUP_SIGNIN =
  env.VITE_MSAL_AUTHORITY || "https://login.microsoftonline.com/common";

// If using B2C policies, you can reconstruct the URL here, but for now we rely on the full authority URL from env.
const AUTHORITY_SIGNUP = AUTHORITY_SIGNUP_SIGNIN;

// Compute authority URL helper
let authorityHost = "";
try {
  if (AUTHORITY_SIGNUP_SIGNIN) {
    const url = new URL(AUTHORITY_SIGNUP_SIGNIN);
    authorityHost = url.host;
  }
} catch (e) {
  // invalid url, ignore
}

export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: AUTHORITY_SIGNUP_SIGNIN,
    knownAuthorities: authorityHost ? [authorityHost] : [],
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
    // Stay on the redirectUri after login instead of bouncing back
    // to the page where login was initiated.
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message) => {
        if (level >= LogLevel.Error) console.error(message);
      },
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Initialize MSAL instance
 * Must be called on app startup before using MSAL features
 * Handles redirect from Azure B2C after authentication
 */
export async function initializeMsal(): Promise<void> {
  try {
    console.log("[MSAL] Initializing MSAL instance...");

    // Initialize MSAL (required before calling any other MSAL API)
    await msalInstance.initialize();
    console.log("[MSAL] MSAL.initialize() completed");

    // Handle redirect from Azure B2C
    const authResult = await msalInstance.handleRedirectPromise();
    console.log(
      "[MSAL] Redirect promise handled",
      authResult ? "with auth result" : "no redirect",
    );

    // Set active account from cache or auth result
    const accounts = msalInstance.getAllAccounts();
    if (!msalInstance.getActiveAccount() && accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
      console.log("[MSAL] Active account set from cache");
    }

    console.log("[MSAL] MSAL initialized successfully");
  } catch (error) {
    console.error(
      "[MSAL] Failed to initialize:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

// Optionally include Graph User.Read for email resolution fallback (see AuthContext)
const ENABLE_GRAPH_USER_READ =
  (env.VITE_MSAL_ENABLE_GRAPH_FALLBACK ||
    env.NEXT_PUBLIC_MSAL_ENABLE_GRAPH_FALLBACK) === "true";
const GRAPH_SCOPES: string[] = ENABLE_GRAPH_USER_READ ? ["User.Read"] : [];

export const defaultLoginRequest = {
  scopes: Array.from(new Set([...DEFAULT_OIDC_SCOPES, ...GRAPH_SCOPES])),
  authority: AUTHORITY_SIGNUP_SIGNIN,
};

export const signupRequest = {
  scopes: Array.from(new Set([...DEFAULT_OIDC_SCOPES, ...GRAPH_SCOPES])),
  authority: AUTHORITY_SIGNUP,
};
