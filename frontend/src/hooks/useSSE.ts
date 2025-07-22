import { useEffect } from 'react';
type SSECallback = (data: any) => void;
// This is a mock implementation of SSE for demonstration
export function useSSE(endpoint: string, callback: SSECallback) {
  useEffect(() => {
    // In a real implementation, we would connect to a real SSE endpoint
    console.log(`Connecting to SSE endpoint: ${endpoint}`);
    // Set up a mock event source that simulates real-time updates
    const mockEventInterval = setInterval(() => {
      // Simulate random updates to demonstrate real-time functionality
      if (Math.random() > 0.5) {
        const mockData = {
          type: 'stats_update',
          payload: {
            totalUsers: Math.floor(Math.random() * 10) + 50,
            totalVendors: Math.floor(Math.random() * 5) + 20
          }
        };
        callback(mockData);
      }
    }, 5000); // Simulate an update every 5 seconds
    return () => {
      clearInterval(mockEventInterval);
      console.log(`Disconnecting from SSE endpoint: ${endpoint}`);
    };
  }, [endpoint, callback]);
}