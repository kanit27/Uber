import React, { useState, useEffect } from 'react';
import socket from '../socket';

const TestingDashboard = () => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [serverResponse, setServerResponse] = useState(null);
  const [riders, setRiders] = useState(0);
  const [drivers, setDrivers] = useState(0);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), `${timestamp}: ${message}`]);
  };

  useEffect(() => {
    // Connection status
    socket.on('connect', () => {
      setConnectionStatus('Connected');
      addLog('✅ Connected to server');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('Disconnected');
      addLog('❌ Disconnected from server');
    });

    socket.on('connect_error', (error) => {
      setConnectionStatus('Error');
      addLog(`🚫 Connection error: ${error.message}`);
    });

    // Pong response
    socket.on('pong', (data) => {
      setServerResponse(data);
      setRiders(data.riders);
      setDrivers(data.drivers);
      addLog(`🏓 Server response: ${data.riders} riders, ${data.drivers} drivers`);
    });

    // Driver updates
    socket.on('drivers_update', (driverLocations) => {
      setDrivers(driverLocations.length);
      addLog(`🚗 Drivers update: ${driverLocations.length} drivers`);
    });

    // Rider updates
    socket.on('rider_location_update', (location) => {
      if (location) {
        addLog(`🚶 Rider location update: [${location[0]}, ${location[1]}]`);
      } else {
        addLog('🚶 Rider disconnected');
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('pong');
      socket.off('drivers_update');
      socket.off('rider_location_update');
    };
  }, []);

  const pingServer = () => {
    addLog('🏓 Pinging server...');
    socket.emit('ping');
  };

  const testRegisterAsRider = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const location = [pos.coords.latitude, pos.coords.longitude];
      socket.emit('register_rider', location);
      addLog(`🚶 Registered as rider at [${location[0]}, ${location[1]}]`);
    });
  };

  const testRegisterAsDriver = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const location = [pos.coords.latitude, pos.coords.longitude];
      const driverId = 'test-driver-' + Math.random().toString(36).substr(2, 9);
      socket.emit('register_driver', { location, driverId });
      addLog(`🚗 Registered as driver (${driverId}) at [${location[0]}, ${location[1]}]`);
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Socket Connection Testing Dashboard</h1>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          connectionStatus === 'Connected' ? 'bg-green-100 text-green-800' :
          connectionStatus === 'Disconnected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {connectionStatus}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Socket ID: {socket.id || 'Not connected'}
        </div>
        <div className="text-sm text-gray-600">
          Server URL: {socket.io.uri}
        </div>
      </div>

      {/* Current State */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current State</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">{riders}</div>
            <div className="text-sm text-gray-600">Active Riders</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{drivers}</div>
            <div className="text-sm text-gray-600">Active Drivers</div>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test Actions</h2>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={pingServer}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Ping Server
          </button>
          <button 
            onClick={testRegisterAsRider}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Register as Rider
          </button>
          <button 
            onClick={testRegisterAsDriver}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Register as Driver
          </button>
        </div>
      </div>

      {/* Server Response */}
      {serverResponse && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Last Server Response</h2>
          <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
            {JSON.stringify(serverResponse, null, 2)}
          </pre>
        </div>
      )}

      {/* Logs */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Activity Log</h2>
        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">No activity yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))
          )}
        </div>
        <button 
          onClick={() => setLogs([])}
          className="mt-2 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
        >
          Clear Log
        </button>
      </div>
    </div>
  );
};

export default TestingDashboard;