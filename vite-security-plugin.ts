/**
 * Vite Security Plugin
 * Implements security measures during development
 */

import { Plugin } from 'vite';

// List of blocked paths and patterns
const BLOCKED_PATHS = [
  '/WEB-INF',
  '/META-INF', 
  '/classes',
  '/lib',
  '/.env',
  '/.git',
  '/node_modules',
  '/package.json',
  '/package-lock.json',
  '/yarn.lock',
  '/tsconfig.json',
  '/vite.config.ts',
  '/webpack.config.js'
];

const BLOCKED_EXTENSIONS = [
  '.xml',
  '.properties', 
  '.yml',
  '.yaml',
  '.conf',
  '.config',
  '.ini',
  '.bak',
  '.backup',
  '.old',
  '.tmp',
  '.temp',
  '.swp',
  '.swo',
  '.sql'
];

export function securityPlugin(): Plugin {
  return {
    name: 'security-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';
        const pathname = new URL(url, 'http://localhost').pathname;
        
        // Check for blocked paths
        for (const blockedPath of BLOCKED_PATHS) {
          if (pathname.toLowerCase().startsWith(blockedPath.toLowerCase())) {
            console.warn(`🚨 Security: Blocked access attempt to ${pathname} from ${req.socket?.remoteAddress}`);
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1></body></html>');
            return;
          }
        }
        
        // Check for blocked file extensions
        for (const ext of BLOCKED_EXTENSIONS) {
          if (pathname.toLowerCase().endsWith(ext)) {
            console.warn(`🚨 Security: Blocked access attempt to ${pathname} from ${req.socket?.remoteAddress}`);
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1></body></html>');
            return;
          }
        }
        
        // Check for path traversal attempts (more comprehensive)
        const decodedPath = decodeURIComponent(pathname);
        const traversalPatterns = [
          '../',
          '..\\',
          '%2e%2e/',
          '%2e%2e\\',
          '%2e%2e%2f',
          '%2e%2e%5c',
          '..%2f',
          '..%5c',
          '%252e%252e%252f',
          '%252e%252e%255c'
        ];
        
        const hasTraversal = traversalPatterns.some(pattern => 
          pathname.toLowerCase().includes(pattern.toLowerCase()) ||
          decodedPath.toLowerCase().includes(pattern.toLowerCase())
        );
        
        if (hasTraversal) {
          console.warn(`🚨 Security: Path traversal attempt detected: ${pathname} from ${req.socket?.remoteAddress}`);
          res.statusCode = 400;
          res.setHeader('Content-Type', 'text/html');
          res.end('<!DOCTYPE html><html><head><title>400 Bad Request</title></head><body><h1>400 Bad Request</h1></body></html>');
          return;
        }
        
        // Add security headers for all responses
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Only add HSTS in production
        if (process.env.NODE_ENV === 'production') {
          res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
        
        // Content Security Policy
        res.setHeader('Content-Security-Policy', [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: https:",
          "connect-src 'self' https: wss: ws://localhost:*",
          "frame-ancestors 'self'"
        ].join('; '));
        
        next();
      });
    }
  };
}