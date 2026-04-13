/**
 * Security middleware for Express.js API routes
 * Prevents access to sensitive paths and implements security headers
 */

import { Request, Response, NextFunction } from 'express';

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
  '.ts',
  '.tsx',
  '.jsx',
  '.scss',
  '.sass',
  '.less',
  '.coffee'
];

/**
 * Security middleware to block access to sensitive paths
 */
export function securityMiddleware(req: Request, res: Response, next: NextFunction) {
  const path = req.path.toLowerCase();
  
  // Check for blocked paths
  for (const blockedPath of BLOCKED_PATHS) {
    if (path.startsWith(blockedPath.toLowerCase())) {
      console.warn(`🚨 Security: Blocked access attempt to ${req.path} from ${req.ip}`);
      return res.status(404).json({ error: 'Not Found' });
    }
  }
  
  // Check for blocked file extensions
  for (const ext of BLOCKED_EXTENSIONS) {
    if (path.endsWith(ext)) {
      console.warn(`🚨 Security: Blocked access attempt to ${req.path} from ${req.ip}`);
      return res.status(404).json({ error: 'Not Found' });
    }
  }
  
  // Check for path traversal attempts
  if (path.includes('../') || path.includes('..\\') || path.includes('%2e%2e')) {
    console.warn(`🚨 Security: Path traversal attempt detected: ${req.path} from ${req.ip}`);
    return res.status(400).json({ error: 'Bad Request' });
  }
  
  // Add security headers
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https: wss:",
    "frame-ancestors 'self'"
  ].join('; '));
  
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  next();
}

/**
 * Rate limiting middleware
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(maxRequests = 100, windowMs = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    const clientData = requestCounts.get(clientId);
    
    if (!clientData || now > clientData.resetTime) {
      // Reset or initialize counter
      requestCounts.set(clientId, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }
    
    if (clientData.count >= maxRequests) {
      console.warn(`🚨 Security: Rate limit exceeded for ${clientId}`);
      return res.status(429).json({ 
        error: 'Too Many Requests',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
    }
    
    clientData.count++;
    next();
  };
}

/**
 * Input validation middleware
 */
export function inputValidationMiddleware(req: Request, res: Response, next: NextFunction) {
  // Check for common injection patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /eval\(/i,
    /expression\(/i,
    /url\(/i,
    /import\(/i
  ];
  
  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };
  
  // Check query parameters
  if (checkValue(req.query)) {
    console.warn(`🚨 Security: Suspicious query parameters from ${req.ip}: ${JSON.stringify(req.query)}`);
    return res.status(400).json({ error: 'Invalid input detected' });
  }
  
  // Check request body
  if (req.body && checkValue(req.body)) {
    console.warn(`🚨 Security: Suspicious request body from ${req.ip}`);
    return res.status(400).json({ error: 'Invalid input detected' });
  }
  
  next();
}

/**
 * Security logging middleware
 */
export function securityLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  // Log suspicious requests
  const suspiciousIndicators = [
    req.path.includes('..'),
    req.path.includes('WEB-INF'),
    req.path.includes('META-INF'),
    req.path.includes('.env'),
    req.path.includes('config'),
    req.get('User-Agent')?.includes('sqlmap'),
    req.get('User-Agent')?.includes('nikto'),
    req.get('User-Agent')?.includes('nmap')
  ];
  
  if (suspiciousIndicators.some(Boolean)) {
    console.warn(`🚨 Security: Suspicious request detected:`, {
      ip: req.ip,
      method: req.method,
      path: req.path,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  }
  
  // Log response time for monitoring
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    if (duration > 5000) { // Log slow requests
      console.warn(`⚠️ Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  
  next();
}