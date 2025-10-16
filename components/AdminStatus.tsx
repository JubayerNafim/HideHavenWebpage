import React, { useEffect, useState } from 'react';
import { checkBackendConnectivity } from '../utils';

const AdminStatus: React.FC = () => {
  const [status, setStatus] = useState({ loading: true, success: false, message: 'Checking backend connectivity...' });
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const runCheck = async () => {
    setStatus({ loading: true, success: false, message: 'Checking backend connectivity...' });
    try {
      const result = await checkBackendConnectivity();
      setStatus({ loading: false, success: result.success, message: result.message });
      setLastChecked(new Date());
    } catch (error) {
      setStatus({ loading: false, success: false, message: `Error checking connectivity: ${error.message || 'Unknown error'}` });
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    runCheck();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-serif font-bold mb-6">Backend Status Check</h1>
      
      <div className={`p-4 mb-6 rounded-lg ${status.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${status.loading ? 'bg-yellow-500 animate-pulse' : status.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium">{status.loading ? 'Checking...' : status.success ? 'Connected' : 'Connection Issue'}</span>
        </div>
        <p>{status.message}</p>
        {lastChecked && (
          <p className="mt-2 text-sm opacity-75">Last checked: {lastChecked.toLocaleString()}</p>
        )}
      </div>
      
      <div className="mb-6">
        <button 
          className="bg-chocolate text-cream py-2 px-4 rounded hover:bg-chocolate-dark transition-colors"
          onClick={runCheck}
          disabled={status.loading}
        >
          {status.loading ? 'Checking...' : 'Check Again'}
        </button>
      </div>
      
      <div className="bg-neutral-100 rounded-lg p-6">
        <h2 className="text-xl font-medium mb-3">Backend Integration Info</h2>
        <p className="mb-4">The Hide Haven website uses the following API endpoints for tracking and orders:</p>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-lg">Analytics Tracking</h3>
            <div className="bg-white p-3 rounded border border-neutral-200">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                <code>Endpoint: analytics.php?action=analytics</code>
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg">Order Placement</h3>
            <div className="bg-white p-3 rounded border border-neutral-200">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                <code>Endpoint: analytics.php?action=order</code>
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg">Customer Reviews</h3>
            <div className="bg-white p-3 rounded border border-neutral-200">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                <code>Endpoint: analytics.php?action=review_list<br/>Endpoint: analytics.php?action=review_add</code>
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg">Connectivity Check</h3>
            <div className="bg-white p-3 rounded border border-neutral-200">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                <code>Endpoint: analytics.php?action=ping</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatus;