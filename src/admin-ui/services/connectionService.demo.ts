/**
 * Demo script to test the connection service functionality
 * This can be run to verify the connection service is working correctly
 */

import { connectionService } from './connectionService';

async function demonstrateConnectionService() {
  console.log('🔍 Starting Connection Service Demo...\n');

  // 1. Test environment validation
  console.log('1. Testing Environment Validation:');
  const envValidation = connectionService.validateEnvironment();
  console.log('   Environment Valid:', envValidation.isValid);
  console.log('   Missing Variables:', envValidation.missingVariables);
  console.log('   Warnings:', envValidation.warnings);
  console.log('   Configuration Issues:', envValidation.configurationIssues);
  console.log('');

  // 2. Test database access
  console.log('2. Testing Database Access:');
  try {
    const dbResult = await connectionService.testDatabaseAccess();
    console.log('   Database Connected:', dbResult.success);
    console.log('   Database Latency:', dbResult.latency?.toFixed(2) + 'ms');
    if (dbResult.error) {
      console.log('   Database Error:', dbResult.error);
    }
  } catch (error) {
    console.log('   Database Test Failed:', error);
  }
  console.log('');

  // 3. Test storage access
  console.log('3. Testing Storage Access:');
  try {
    const storageResult = await connectionService.testStorageAccess();
    console.log('   Storage Connected:', storageResult.success);
    console.log('   Storage Latency:', storageResult.latency?.toFixed(2) + 'ms');
    if (storageResult.error) {
      console.log('   Storage Error:', storageResult.error);
    }
  } catch (error) {
    console.log('   Storage Test Failed:', error);
  }
  console.log('');

  // 4. Test comprehensive connection check
  console.log('4. Testing Comprehensive Connection Check:');
  try {
    const connectionResult = await connectionService.checkConnection();
    console.log('   Overall Connected:', connectionResult.isConnected);
    console.log('   Overall Latency:', connectionResult.overallLatency?.toFixed(2) + 'ms');
    console.log('   Errors Count:', connectionResult.errors.length);
    console.log('   Warnings Count:', connectionResult.warnings.length);
    
    if (connectionResult.errors.length > 0) {
      console.log('   Errors:');
      connectionResult.errors.forEach((error, index) => {
        console.log(`     ${index + 1}. [${error.type}] ${error.message}`);
      });
    }
    
    if (connectionResult.warnings.length > 0) {
      console.log('   Warnings:');
      connectionResult.warnings.forEach((warning, index) => {
        console.log(`     ${index + 1}. ${warning}`);
      });
    }
  } catch (error) {
    console.log('   Connection Check Failed:', error);
  }
  console.log('');

  console.log('✅ Connection Service Demo Complete!');
}

// Export for potential use in other contexts
export { demonstrateConnectionService };

// If running directly (not imported), execute the demo
if (typeof window === 'undefined' && require.main === module) {
  demonstrateConnectionService().catch(console.error);
}