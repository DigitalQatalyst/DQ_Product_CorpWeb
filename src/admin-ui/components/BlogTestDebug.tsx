import React, { useState } from 'react';
import { runBlogTestWithSampleAuthor, testExistingBlog } from '../utils/runBlogTest';

export function BlogTestDebug() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testSlug, setTestSlug] = useState('');

  const handleRunTest = async () => {
    setIsRunning(true);
    setTestResult(null);
    
    try {
      const result = await runBlogTestWithSampleAuthor();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleTestExisting = async () => {
    if (!testSlug.trim()) {
      alert('Please enter a blog slug to test');
      return;
    }

    setIsRunning(true);
    setTestResult(null);
    
    try {
      const result = await testExistingBlog(testSlug.trim());
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Blog System Test</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Test the complete blog creation and retrieval workflow to ensure everything is working correctly.
          </p>
          
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleRunTest}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Running Test...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create & Test New Blog
                </>
              )}
            </button>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">Test an existing blog by slug:</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={testSlug}
                onChange={(e) => setTestSlug(e.target.value)}
                placeholder="Enter blog slug (e.g., test-blog-post)"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleTestExisting}
                disabled={isRunning || !testSlug.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Existing
              </button>
            </div>
          </div>
        </div>

        {testResult && (
          <div className={`border rounded-lg p-4 ${testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center gap-2 mb-3">
              {testResult.success ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <h4 className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {testResult.success ? 'Test Passed!' : 'Test Failed'}
              </h4>
            </div>

            {testResult.success && testResult.creation && (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Blog ID:</span>
                    <span className="ml-2 text-gray-600">{testResult.creation.blogId}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Slug:</span>
                    <span className="ml-2 text-gray-600">{testResult.creation.slug}</span>
                  </div>
                </div>
                
                {testResult.retrieval?.analysis && (
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-green-200">
                    <div>
                      <span className="font-medium text-gray-700">Word Count:</span>
                      <span className="ml-2 text-gray-600">{testResult.retrieval.analysis.wordCount}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Paragraphs:</span>
                      <span className="ml-2 text-gray-600">{testResult.retrieval.analysis.paragraphCount}</span>
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-green-200">
                  <a
                    href={`/blog/${testResult.creation.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Blog Post
                  </a>
                </div>
              </div>
            )}

            {testResult.success && testResult.blog && (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <span className="ml-2 text-gray-600">{testResult.blog.title}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 text-gray-600">{testResult.blog.type}</span>
                  </div>
                </div>
                
                {testResult.analysis && (
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-green-200">
                    <div>
                      <span className="font-medium text-gray-700">Word Count:</span>
                      <span className="ml-2 text-gray-600">{testResult.analysis.wordCount}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Paragraphs:</span>
                      <span className="ml-2 text-gray-600">{testResult.analysis.paragraphCount}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!testResult.success && (
              <div className="text-sm text-red-700">
                <p className="font-medium">Error:</p>
                <p className="mt-1">{testResult.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}