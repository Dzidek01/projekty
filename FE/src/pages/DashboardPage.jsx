import React from 'react';

const DashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Welcome to the Hotel Management System</h2>
          <p className="text-gray-600 mb-4">
            Manage your hotels, rooms, and reservations efficiently with our comprehensive system.
          </p>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-500">
              Select an option from the navigation menu to get started.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat Cards */}
          <div className="bg-blue-50 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Hotels</h3>
            <p className="text-3xl font-bold text-blue-600">12</p>
          </div>
          
          <div className="bg-green-50 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-green-800 mb-2">Rooms</h3>
            <p className="text-3xl font-bold text-green-600">84</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Reservations</h3>
            <p className="text-3xl font-bold text-yellow-600">156</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-purple-800 mb-2">Occupancy</h3>
            <p className="text-3xl font-bold text-purple-600">78%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;