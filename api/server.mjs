import http from "http";
import { parse } from "url";
import signHandler from "./uploads/sign.js";
import deleteHandler from "./uploads/delete.js";

const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 3001;

// Security middleware
function securityMiddleware(req, res) {
  const { pathname } = parse(req.url || "", true);
  
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
    '.swo'
  ];
  
  // Check for blocked paths
  for (const blockedPath of BLOCKED_PATHS) {
    if (pathname.toLowerCase().startsWith(blockedPath.toLowerCase())) {
      console.warn(`🚨 Security: Blocked access attempt to ${pathname} from ${req.socket.remoteAddress}`);
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Not Found" }));
      return false;
    }
  }
  
  // Check for blocked file extensions
  for (const ext of BLOCKED_EXTENSIONS) {
    if (pathname.toLowerCase().endsWith(ext)) {
      console.warn(`🚨 Security: Blocked access attempt to ${pathname} from ${req.socket.remoteAddress}`);
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Not Found" }));
      return false;
    }
  }
  
  // Check for path traversal attempts
  if (pathname.includes('../') || pathname.includes('..\\') || pathname.includes('%2e%2e')) {
    console.warn(`🚨 Security: Path traversal attempt detected: ${pathname} from ${req.socket.remoteAddress}`);
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Bad Request" }));
    return false;
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
  
  return true;
}

const server = http.createServer(async (req, res) => {
  try {
    // Apply security middleware first
    if (!securityMiddleware(req, res)) {
      return; // Request was blocked
    }
    
    const { pathname } = parse(req.url || "", true);
    if (pathname === "/api/uploads/sign") return signHandler(req, res);
    if (pathname === "/api/uploads/delete") return deleteHandler(req, res);
    if (pathname === "/api/health") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ ok: true }));
    }
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Not found" }));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: e?.message || "Server error" }));
  }
});

server.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
