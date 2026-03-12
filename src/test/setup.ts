import { vi } from 'vitest';

// Mock environment variables for tests
Object.defineProperty(globalThis, 'import.meta', {
  value: {
    env: {
      VITE_SUPABASE_URL: 'https://swwghoukwlnocpfkuluv.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3d2dob3Vrd2xub2NwZmt1bHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDQzODEsImV4cCI6MjA4MTQyMDM4MX0.SwGGjGOTRDD24oQKBbsoq4lydlnbH-ONXXgLHCRKBN8',
      VITE_SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3d2dob3Vrd2xub2NwZmt1bHV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg0NDM4MSwiZXhwIjoyMDgxNDIwMzgxfQ.6DgwX5tVY76eNio-QuvTydu4DZmIBtVBhRUXqtP0BFo',
    },
  },
  writable: true,
});

// Mock performance API if not available
if (!globalThis.performance) {
  globalThis.performance = {
    now: vi.fn(() => Date.now()),
  } as any;
}