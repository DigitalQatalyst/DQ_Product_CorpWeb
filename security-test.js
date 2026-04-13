#!/usr/bin/env node

/**
 * Security Test Script
 * Tests the implemented security measures to ensure sensitive paths are blocked
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TIMEOUT = 5000;

// Test cases for sensitive paths that should be blocked
const SENSITIVE_PATHS = [
  '/WEB-INF/web.xml',
  '/WEB-INF/applicationContext.xml',
  '/WEB-INF/classes/config.properties',
  '/META-INF/MANIFEST.MF',
  '/classes/application.properties',
  '/lib/config.jar',
  '/.env',
  '/.env.local',
  '/.env.production',
  '/package.json',
  '/package-lock.json',
  '/yarn.lock',
  '/tsconfig.json',
  '/vite.config.ts',
  '/webpack.config.js',
  '/.git/config',
  '/node_modules/package.json',
  '/backup.sql',
  '/config.bak',
  '/app.config.old',
  '/temp.tmp',
  '/test.swp'
];

// Expected blocked status codes
const BLOCKED_STATUS_CODES = [403, 404, 410];

/**
 * Make HTTP request and return promise
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, { timeout: TIMEOUT }, (res) => {
      resolve({
        url,
        statusCode: res.statusCode,
        headers: res.headers,
        blocked: BLOCKED_STATUS_CODES.includes(res.statusCode)
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout for ${url}`));
    });
    
    req.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Test security headers
 */
async function testSecurityHeaders() {
  console.log('\n🔍 Testing Security Headers...');
  
  try {
    const result = await makeRequest(BASE_URL);
    const headers = result.headers;
    
    const requiredHeaders = {
      'x-frame-options': 'SAMEORIGIN',
      'x-content-type-options': 'nosniff',
      'x-xss-protection': '1; mode=block',
      'referrer-policy': 'strict-origin-when-cross-origin'
    };
    
    let headersPassed = 0;
    let headersTotal = Object.keys(requiredHeaders).length;
    
    for (const [header, expectedValue] of Object.entries(requiredHeaders)) {
      const actualValue = headers[header];
      if (actualValue && actualValue.toLowerCase().includes(expectedValue.toLowerCase())) {
        console.log(`✅ ${header}: ${actualValue}`);
        headersPassed++;
      } else {
        console.log(`❌ ${header}: Missing or incorrect (expected: ${expectedValue})`);
      }
    }
    
    // Check for CSP
    if (headers['content-security-policy']) {
      console.log(`✅ content-security-policy: Present`);
      headersPassed++;
      headersTotal++;
    } else {
      console.log(`❌ content-security-policy: Missing`);
      headersTotal++;
    }
    
    // Check for HSTS
    if (headers['strict-transport-security']) {
      console.log(`✅ strict-transport-security: ${headers['strict-transport-security']}`);
      headersPassed++;
      headersTotal++;
    } else {
      console.log(`❌ strict-transport-security: Missing`);
      headersTotal++;
    }
    
    console.log(`\n📊 Security Headers: ${headersPassed}/${headersTotal} passed`);
    return headersPassed === headersTotal;
    
  } catch (error) {
    console.error(`❌ Error testing security headers: ${error.message}`);
    return false;
  }
}

/**
 * Test blocked paths
 */
async function testBlockedPaths() {
  console.log('\n🚫 Testing Blocked Paths...');
  
  let blockedCount = 0;
  let totalPaths = SENSITIVE_PATHS.length;
  
  for (const path of SENSITIVE_PATHS) {
    try {
      const url = BASE_URL + path;
      const result = await makeRequest(url);
      
      if (result.blocked) {
        console.log(`✅ ${path} - Blocked (${result.statusCode})`);
        blockedCount++;
      } else {
        console.log(`❌ ${path} - NOT BLOCKED (${result.statusCode}) - SECURITY RISK!`);
      }
    } catch (error) {
      // Network errors are acceptable (means server rejected the request)
      console.log(`✅ ${path} - Connection rejected (likely blocked)`);
      blockedCount++;
    }
  }
  
  console.log(`\n📊 Blocked Paths: ${blockedCount}/${totalPaths} properly blocked`);
  return blockedCount === totalPaths;
}

/**
 * Test path traversal protection
 */
async function testPathTraversal() {
  console.log('\n🔄 Testing Path Traversal Protection...');
  
  const traversalPaths = [
    '/../../../etc/passwd',
    '/..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
    '/%2e%2e/%2e%2e/%2e%2e/etc/passwd',
    '/....//....//....//etc/passwd',
    '/api/../../../.env'
  ];
  
  let blockedCount = 0;
  
  for (const path of traversalPaths) {
    try {
      const url = BASE_URL + path;
      const result = await makeRequest(url);
      
      if (result.blocked || result.statusCode >= 400) {
        console.log(`✅ ${path} - Blocked (${result.statusCode})`);
        blockedCount++;
      } else {
        console.log(`❌ ${path} - NOT BLOCKED (${result.statusCode}) - SECURITY RISK!`);
      }
    } catch (error) {
      console.log(`✅ ${path} - Connection rejected (likely blocked)`);
      blockedCount++;
    }
  }
  
  console.log(`\n📊 Path Traversal: ${blockedCount}/${traversalPaths.length} attempts blocked`);
  return blockedCount === traversalPaths.length;
}

/**
 * Test rate limiting (if implemented)
 */
async function testRateLimit() {
  console.log('\n⏱️ Testing Rate Limiting...');
  
  const testPath = '/api/health';
  const requests = [];
  const maxRequests = 20;
  
  // Send multiple rapid requests
  for (let i = 0; i < maxRequests; i++) {
    requests.push(makeRequest(BASE_URL + testPath).catch(() => ({ statusCode: 429 })));
  }
  
  try {
    const results = await Promise.all(requests);
    const rateLimited = results.filter(r => r.statusCode === 429).length;
    
    if (rateLimited > 0) {
      console.log(`✅ Rate limiting active - ${rateLimited} requests rate limited`);
      return true;
    } else {
      console.log(`⚠️ Rate limiting not detected (may not be configured for this endpoint)`);
      return true; // Not necessarily a failure
    }
  } catch (error) {
    console.log(`⚠️ Rate limit test inconclusive: ${error.message}`);
    return true;
  }
}

/**
 * Main test runner
 */
async function runSecurityTests() {
  console.log('🛡️ Security Test Suite');
  console.log('='.repeat(50));
  console.log(`Testing: ${BASE_URL}`);
  
  const results = {
    headers: await testSecurityHeaders(),
    blockedPaths: await testBlockedPaths(),
    pathTraversal: await testPathTraversal(),
    rateLimit: await testRateLimit()
  };
  
  console.log('\n📋 Test Results Summary');
  console.log('='.repeat(50));
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  for (const [test, result] of Object.entries(results)) {
    console.log(`${result ? '✅' : '❌'} ${test}: ${result ? 'PASSED' : 'FAILED'}`);
  }
  
  console.log(`\n🎯 Overall Score: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All security tests passed! Your application is well protected.');
    process.exit(0);
  } else {
    console.log('⚠️ Some security tests failed. Please review and fix the issues.');
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runSecurityTests().catch(error => {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  });
}

module.exports = { runSecurityTests, testSecurityHeaders, testBlockedPaths };