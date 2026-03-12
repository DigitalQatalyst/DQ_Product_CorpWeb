import React, { useState } from 'react';
import { testAuthorCreation, testAuthorList } from '../utils/testAuthorCreation';
import { getSupabase } from '../utils/supabaseClient';

export const AuthorSystemDebug: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setIsLoading(true);
    addResult('🔍 Testing Supabase connection...');
    
    try {
      const supabase = getSupabase();
      
      // Test basic connection
      const { data, error } = await supabase.from('authors').select('count').limit(1);
      
      if (error) {
        addResult(`❌ Connection failed: ${error.message}`);
        if (error.code) addResult(`   Error code: ${error.code}`);
        if (error.details) addResult(`   Details: ${error.details}`);
        if (error.hint) addResult(`   Hint: ${error.hint}`);
      } else {
        addResult('✅ Supabase connection successful');
        addResult(`   Authors table accessible`);
      }
    } catch (error: any) {
      addResult(`❌ Connection test failed: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  const testAuthorCreationFlow = async () => {
    setIsLoading(true);
    addResult('🧪 Testing author creation flow...');
    
    try {
      const result = await testAuthorCreation();
      addResult(`✅ Author created with ID: ${result.id}`);
      addResult(`   Name: ${result.name}`);
      addResult(`   Title: ${result.title}`);
    } catch (error: any) {
      addResult(`❌ Author creation failed: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  const testAuthorListFlow = async () => {
    setIsLoading(true);
    addResult('📋 Testing author list retrieval...');
    
    try {
      const authors = await testAuthorList();
      addResult(`✅ Retrieved ${authors.length} authors`);
      authors.forEach((author, index) => {
        addResult(`   ${index + 1}. ${author.name} (${author.title})`);
      });
    } catch (error: any) {
      addResult(`❌ Author list failed: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  const checkTableExists = async () => {
    setIsLoading(true);
    addResult('🔍 Checking if authors table exists...');
    
    try {
      const supabase = getSupabase();
      
      // Try to describe the table structure
      const { data, error } = await supabase
        .from('authors')
        .select('*')
        .limit(0);
      
      if (error) {
        if (error.code === '42P01') {
          addResult('❌ Authors table does not exist');
          addResult('   Please run the SQL schema script first');
        } else {
          addResult(`❌ Table check failed: ${error.message}`);
        }
      } else {
        addResult('✅ Authors table exists and is accessible');
      }
    } catch (error: any) {
      addResult(`❌ Table check failed: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Author System Debug</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={checkTableExists}
          disabled={isLoading}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Check Table
        </button>
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Connection
        </button>
        <button
          onClick={testAuthorListFlow}
          disabled={isLoading}
          className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Test List Authors
        </button>
        <button
          onClick={testAuthorCreationFlow}
          disabled={isLoading}
          className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
        >
          Test Create Author
        </button>
        <button
          onClick={clearResults}
          disabled={isLoading}
          className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Clear Results
        </button>
      </div>

      {isLoading && (
        <div className="mb-4 text-blue-600">
          <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
          Running test...
        </div>
      )}

      <div className="bg-white border border-gray-300 rounded p-4 max-h-96 overflow-y-auto">
        <h4 className="font-medium text-gray-900 mb-2">Test Results:</h4>
        {testResults.length === 0 ? (
          <p className="text-gray-500 text-sm">No tests run yet. Click a button above to start testing.</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono text-gray-700">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};