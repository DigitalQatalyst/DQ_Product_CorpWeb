import { getSupabase, getSupabaseAdmin, isSupabaseConfigured, isSupabaseAdminConfigured } from '../utils/supabaseClient';

export interface ConnectionError {
  type: 'database' | 'storage' | 'environment' | 'configuration';
  message: string;
  details?: string;
  troubleshooting?: string[];
}

export interface DatabaseStatus {
  isConnected: boolean;
  latency?: number;
  error?: string;
  lastChecked: string;
}

export interface StorageStatus {
  isConnected: boolean;
  latency?: number;
  error?: string;
  lastChecked: string;
}

export interface EnvironmentStatus {
  isValid: boolean;
  missingVariables: string[];
  warnings: string[];
}

export interface ConnectionResult {
  isConnected: boolean;
  database: DatabaseStatus;
  storage: StorageStatus;
  environment: EnvironmentStatus;
  errors: ConnectionError[];
  warnings: string[];
  overallLatency?: number;
}

export interface DatabaseAccessResult {
  success: boolean;
  latency: number;
  error?: string;
  details?: any;
}

export interface StorageAccessResult {
  success: boolean;
  latency: number;
  error?: string;
  details?: any;
}

export interface EnvironmentValidation {
  isValid: boolean;
  missingVariables: string[];
  warnings: string[];
  configurationIssues: string[];
}

class ConnectionService {
  private lastConnectionCheck: ConnectionResult | null = null;
  private checkInProgress = false;

  /**
   * Validates environment variables and configuration
   */
  validateEnvironment(): EnvironmentValidation {
    const missingVariables: string[] = [];
    const warnings: string[] = [];
    const configurationIssues: string[] = [];

    // Check required environment variables
    const supabaseUrl = (import.meta as any)?.env?.VITE_SUPABASE_URL;
    const anonKey = (import.meta as any)?.env?.VITE_SUPABASE_ANON_KEY;
    const serviceKey = (import.meta as any)?.env?.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || typeof supabaseUrl !== 'string' || !supabaseUrl.trim()) {
      missingVariables.push('VITE_SUPABASE_URL');
      configurationIssues.push('Supabase URL is required for database connectivity');
    } else if (!/^https?:\/\//i.test(supabaseUrl.trim())) {
      configurationIssues.push('VITE_SUPABASE_URL must be a valid HTTP/HTTPS URL');
    }

    if (!anonKey || typeof anonKey !== 'string' || !anonKey.trim()) {
      missingVariables.push('VITE_SUPABASE_ANON_KEY');
      configurationIssues.push('Supabase anonymous key is required for client operations');
    }

    if (!serviceKey || typeof serviceKey !== 'string' || !serviceKey.trim()) {
      warnings.push('VITE_SUPABASE_SERVICE_ROLE_KEY is missing - this may cause Row Level Security (RLS) issues');
      warnings.push('Add VITE_SUPABASE_SERVICE_ROLE_KEY to your .env.local file for full admin functionality');
    }

    // Additional configuration checks
    if (supabaseUrl && supabaseUrl.includes('localhost')) {
      warnings.push('Using localhost Supabase URL - ensure local Supabase is running');
    }

    return {
      isValid: missingVariables.length === 0 && configurationIssues.length === 0,
      missingVariables,
      warnings,
      configurationIssues,
    };
  }

  /**
   * Tests database connectivity and measures latency
   */
  async testDatabaseAccess(): Promise<DatabaseAccessResult> {
    const startTime = performance.now();
    
    try {
      if (!isSupabaseConfigured()) {
        return {
          success: false,
          latency: 0,
          error: 'Supabase client not configured',
          details: 'Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables',
        };
      }

      const supabase = getSupabase();
      
      // Test basic database connectivity with a simple query
      const { data, error } = await supabase
        .from('media_items')
        .select('id')
        .limit(1);

      const latency = performance.now() - startTime;

      if (error) {
        return {
          success: false,
          latency,
          error: error.message,
          details: error,
        };
      }

      return {
        success: true,
        latency,
        details: { recordCount: data?.length || 0 },
      };
    } catch (error: any) {
      const latency = performance.now() - startTime;
      return {
        success: false,
        latency,
        error: error?.message || 'Unknown database error',
        details: error,
      };
    }
  }

  /**
   * Tests storage connectivity and measures latency
   */
  async testStorageAccess(): Promise<StorageAccessResult> {
    const startTime = performance.now();
    
    try {
      if (!isSupabaseConfigured()) {
        return {
          success: false,
          latency: 0,
          error: 'Supabase client not configured',
          details: 'Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables',
        };
      }

      const supabase = getSupabase();
      
      // Test storage connectivity by listing buckets
      const { data, error } = await supabase.storage.listBuckets();

      const latency = performance.now() - startTime;

      if (error) {
        return {
          success: false,
          latency,
          error: error.message,
          details: error,
        };
      }

      return {
        success: true,
        latency,
        details: { bucketCount: data?.length || 0 },
      };
    } catch (error: any) {
      const latency = performance.now() - startTime;
      return {
        success: false,
        latency,
        error: error?.message || 'Unknown storage error',
        details: error,
      };
    }
  }

  /**
   * Performs comprehensive connection check
   */
  async checkConnection(): Promise<ConnectionResult> {
    if (this.checkInProgress) {
      return this.lastConnectionCheck || this.getDefaultConnectionResult();
    }

    this.checkInProgress = true;
    const overallStartTime = performance.now();

    try {
      const errors: ConnectionError[] = [];
      const warnings: string[] = [];

      // 1. Validate environment
      const envValidation = this.validateEnvironment();
      warnings.push(...envValidation.warnings);

      if (!envValidation.isValid) {
        envValidation.missingVariables.forEach(variable => {
          errors.push({
            type: 'environment',
            message: `Missing required environment variable: ${variable}`,
            troubleshooting: [
              'Check your .env.local file',
              'Ensure all required Supabase variables are set',
              'Restart the development server after making changes',
            ],
          });
        });

        envValidation.configurationIssues.forEach(issue => {
          errors.push({
            type: 'configuration',
            message: issue,
            troubleshooting: [
              'Verify your Supabase project settings',
              'Check the format of your environment variables',
            ],
          });
        });
      }

      // 2. Test database access
      const dbResult = await this.testDatabaseAccess();
      const databaseStatus: DatabaseStatus = {
        isConnected: dbResult.success,
        latency: dbResult.latency,
        error: dbResult.error,
        lastChecked: new Date().toISOString(),
      };

      if (!dbResult.success) {
        errors.push({
          type: 'database',
          message: `Database connection failed: ${dbResult.error}`,
          details: dbResult.details ? JSON.stringify(dbResult.details, null, 2) : undefined,
          troubleshooting: [
            'Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY',
            'Verify your Supabase project is active',
            'Check network connectivity',
            'Ensure Row Level Security policies allow access',
          ],
        });
      }

      // 3. Test storage access
      const storageResult = await this.testStorageAccess();
      const storageStatus: StorageStatus = {
        isConnected: storageResult.success,
        latency: storageResult.latency,
        error: storageResult.error,
        lastChecked: new Date().toISOString(),
      };

      if (!storageResult.success) {
        errors.push({
          type: 'storage',
          message: `Storage connection failed: ${storageResult.error}`,
          details: storageResult.details ? JSON.stringify(storageResult.details, null, 2) : undefined,
          troubleshooting: [
            'Check your Supabase storage configuration',
            'Verify storage buckets exist and are accessible',
            'Check storage policies and permissions',
          ],
        });
      }

      // 4. Additional warnings for service role key
      if (!isSupabaseAdminConfigured()) {
        warnings.push('Service role key not configured - some admin operations may fail due to RLS policies');
      }

      const overallLatency = performance.now() - overallStartTime;
      const isConnected = dbResult.success && storageResult.success && envValidation.isValid;

      const result: ConnectionResult = {
        isConnected,
        database: databaseStatus,
        storage: storageStatus,
        environment: {
          isValid: envValidation.isValid,
          missingVariables: envValidation.missingVariables,
          warnings: envValidation.warnings,
        },
        errors,
        warnings,
        overallLatency,
      };

      this.lastConnectionCheck = result;
      return result;
    } finally {
      this.checkInProgress = false;
    }
  }

  /**
   * Gets the last connection check result without performing a new check
   */
  getLastConnectionResult(): ConnectionResult | null {
    return this.lastConnectionCheck;
  }

  /**
   * Clears the cached connection result to force a fresh check
   */
  clearCache(): void {
    this.lastConnectionCheck = null;
  }

  /**
   * Logs connection status and issues to console
   */
  logConnectionStatus(result: ConnectionResult): void {
    const timestamp = new Date().toISOString();
    
    if (result.isConnected) {
      console.log(`[ConnectionService] ${timestamp} - ✅ All systems connected (${result.overallLatency?.toFixed(0)}ms)`);
      console.log(`[ConnectionService] Database: ${result.database.latency?.toFixed(0)}ms, Storage: ${result.storage.latency?.toFixed(0)}ms`);
    } else {
      console.error(`[ConnectionService] ${timestamp} - ❌ Connection issues detected`);
    }

    // Log errors
    result.errors.forEach(error => {
      console.error(`[ConnectionService] ${error.type.toUpperCase()}: ${error.message}`);
      if (error.details) {
        console.error(`[ConnectionService] Details:`, error.details);
      }
      if (error.troubleshooting) {
        console.error(`[ConnectionService] Troubleshooting:`, error.troubleshooting);
      }
    });

    // Log warnings
    result.warnings.forEach(warning => {
      console.warn(`[ConnectionService] ⚠️ ${warning}`);
    });
  }

  private getDefaultConnectionResult(): ConnectionResult {
    return {
      isConnected: false,
      database: {
        isConnected: false,
        lastChecked: new Date().toISOString(),
      },
      storage: {
        isConnected: false,
        lastChecked: new Date().toISOString(),
      },
      environment: {
        isValid: false,
        missingVariables: [],
        warnings: [],
      },
      errors: [],
      warnings: [],
    };
  }
}

// Export singleton instance
export const connectionService = new ConnectionService();

// Export convenience functions
export const checkSupabaseConnection = () => connectionService.checkConnection();
export const validateSupabaseEnvironment = () => connectionService.validateEnvironment();
export const testSupabaseDatabase = () => connectionService.testDatabaseAccess();
export const testSupabaseStorage = () => connectionService.testStorageAccess();