import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { connectionService, validateSupabaseEnvironment } from './connectionService';

// Mock only the Supabase client functions for controlled testing
vi.mock('../utils/supabaseClient', () => ({
  getSupabase: vi.fn(),
  getSupabaseAdmin: vi.fn(),
  isSupabaseConfigured: vi.fn(),
  isSupabaseAdminConfigured: vi.fn(),
}));

describe('ConnectionService', () => {
  beforeEach(() => {
    // Clear any cached results before each test
    connectionService.clearCache();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('validateEnvironment', () => {
    it('should validate the current environment configuration', () => {
      const result = validateSupabaseEnvironment();

      // Test that the function returns a proper structure
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('missingVariables');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('configurationIssues');
      
      // Verify arrays are properly initialized
      expect(Array.isArray(result.missingVariables)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
      expect(Array.isArray(result.configurationIssues)).toBe(true);
    });

    it('should handle environment validation logic correctly', () => {
      const result = validateSupabaseEnvironment();
      
      // If environment is properly configured, should be valid
      // If not, should provide helpful error messages
      if (!result.isValid) {
        expect(result.missingVariables.length > 0 || result.configurationIssues.length > 0).toBe(true);
      }
      
      // Should always provide constructive feedback
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          expect(typeof warning).toBe('string');
          expect(warning.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('testDatabaseAccess', () => {
    it('should handle unconfigured Supabase client', async () => {
      const { isSupabaseConfigured } = await import('../utils/supabaseClient');
      vi.mocked(isSupabaseConfigured).mockReturnValue(false);

      const result = await connectionService.testDatabaseAccess();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Supabase client not configured');
      expect(result.details).toBe('Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
    });

    it('should handle database query success', async () => {
      const { isSupabaseConfigured, getSupabase } = await import('../utils/supabaseClient');
      
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ id: 'test-id' }],
              error: null,
            }),
          }),
        }),
      };

      vi.mocked(isSupabaseConfigured).mockReturnValue(true);
      vi.mocked(getSupabase).mockReturnValue(mockSupabase as any);

      const result = await connectionService.testDatabaseAccess();

      expect(result.success).toBe(true);
      expect(result.latency).toBeGreaterThan(0);
      expect(result.details).toEqual({ recordCount: 1 });
    });

    it('should handle database query error', async () => {
      const { isSupabaseConfigured, getSupabase } = await import('../utils/supabaseClient');
      
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database connection failed' },
            }),
          }),
        }),
      };

      vi.mocked(isSupabaseConfigured).mockReturnValue(true);
      vi.mocked(getSupabase).mockReturnValue(mockSupabase as any);

      const result = await connectionService.testDatabaseAccess();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database connection failed');
      expect(result.latency).toBeGreaterThan(0);
    });
  });

  describe('testStorageAccess', () => {
    it('should handle storage access success', async () => {
      const { isSupabaseConfigured, getSupabase } = await import('../utils/supabaseClient');
      
      const mockSupabase = {
        storage: {
          listBuckets: vi.fn().mockResolvedValue({
            data: [{ name: 'test-bucket' }],
            error: null,
          }),
        },
      };

      vi.mocked(isSupabaseConfigured).mockReturnValue(true);
      vi.mocked(getSupabase).mockReturnValue(mockSupabase as any);

      const result = await connectionService.testStorageAccess();

      expect(result.success).toBe(true);
      expect(result.latency).toBeGreaterThan(0);
      expect(result.details).toEqual({ bucketCount: 1 });
    });

    it('should handle storage access error', async () => {
      const { isSupabaseConfigured, getSupabase } = await import('../utils/supabaseClient');
      
      const mockSupabase = {
        storage: {
          listBuckets: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Storage access denied' },
          }),
        },
      };

      vi.mocked(isSupabaseConfigured).mockReturnValue(true);
      vi.mocked(getSupabase).mockReturnValue(mockSupabase as any);

      const result = await connectionService.testStorageAccess();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Storage access denied');
      expect(result.latency).toBeGreaterThan(0);
    });
  });

  describe('checkConnection', () => {
    it('should return proper connection result structure', async () => {
      const { isSupabaseConfigured, isSupabaseAdminConfigured, getSupabase } = await import('../utils/supabaseClient');
      
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ id: 'test-id' }],
              error: null,
            }),
          }),
        }),
        storage: {
          listBuckets: vi.fn().mockResolvedValue({
            data: [{ name: 'test-bucket' }],
            error: null,
          }),
        },
      };

      vi.mocked(isSupabaseConfigured).mockReturnValue(true);
      vi.mocked(isSupabaseAdminConfigured).mockReturnValue(true);
      vi.mocked(getSupabase).mockReturnValue(mockSupabase as any);

      const result = await connectionService.checkConnection();

      // Verify result structure
      expect(result).toHaveProperty('isConnected');
      expect(result).toHaveProperty('database');
      expect(result).toHaveProperty('storage');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('overallLatency');

      // Verify database status structure
      expect(result.database).toHaveProperty('isConnected');
      expect(result.database).toHaveProperty('lastChecked');

      // Verify storage status structure
      expect(result.storage).toHaveProperty('isConnected');
      expect(result.storage).toHaveProperty('lastChecked');

      // Verify environment status structure
      expect(result.environment).toHaveProperty('isValid');
      expect(result.environment).toHaveProperty('missingVariables');
      expect(result.environment).toHaveProperty('warnings');

      // Verify arrays are properly initialized
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it('should handle database connection failures gracefully', async () => {
      const { isSupabaseConfigured, getSupabase } = await import('../utils/supabaseClient');
      
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database connection failed' },
            }),
          }),
        }),
        storage: {
          listBuckets: vi.fn().mockResolvedValue({
            data: [{ name: 'test-bucket' }],
            error: null,
          }),
        },
      };

      vi.mocked(isSupabaseConfigured).mockReturnValue(true);
      vi.mocked(getSupabase).mockReturnValue(mockSupabase as any);

      const result = await connectionService.checkConnection();

      expect(result.database.isConnected).toBe(false);
      expect(result.database.error).toBe('Database connection failed');
      expect(result.errors.some(e => e.type === 'database')).toBe(true);
    });

    it('should measure and report latency', async () => {
      const { isSupabaseConfigured, getSupabase } = await import('../utils/supabaseClient');
      
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ id: 'test-id' }],
              error: null,
            }),
          }),
        }),
        storage: {
          listBuckets: vi.fn().mockResolvedValue({
            data: [{ name: 'test-bucket' }],
            error: null,
          }),
        },
      };

      vi.mocked(isSupabaseConfigured).mockReturnValue(true);
      vi.mocked(getSupabase).mockReturnValue(mockSupabase as any);

      const result = await connectionService.checkConnection();

      expect(typeof result.overallLatency).toBe('number');
      expect(result.overallLatency).toBeGreaterThan(0);
      
      if (result.database.isConnected) {
        expect(typeof result.database.latency).toBe('number');
        expect(result.database.latency).toBeGreaterThan(0);
      }
      
      if (result.storage.isConnected) {
        expect(typeof result.storage.latency).toBe('number');
        expect(result.storage.latency).toBeGreaterThan(0);
      }
    });
  });
});