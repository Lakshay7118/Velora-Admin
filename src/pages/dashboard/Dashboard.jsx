import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, TrendingUp, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("https://velora-backend-production-3e79.up.railway.app/api/dashboard");
        const data = res.data;

        setStats([
          {
            label: "Total Products",
            value: data.totalProducts || 0,
            icon: <Package className="w-6 h-6 text-blue-600" />,
            bg: "bg-blue-100",
          },
          {
            label: "Total Orders",
            value: data.totalOrders || 0,
            icon: <ShoppingCart className="w-6 h-6 text-purple-600" />,
            bg: "bg-purple-100",
          },
          {
            label: "Total Users",
            value: data.totalUsers || 0,
            icon: <Users className="w-6 h-6 text-yellow-600" />,
            bg: "bg-yellow-100",
          },
          {
            label: "Total Revenue",
            value: "₹" + (data.totalRevenue || 0).toLocaleString('en-IN'),
            icon: <TrendingUp className="w-6 h-6 text-green-600" />,
            bg: "bg-green-100",
          },
        ]);

        setRecentOrders(data.recentOrders || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 font-sans text-gray-900">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, here is what's happening today.</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-all hover:shadow-md"
          >
            <div className={`p-4 rounded-full flex-shrink-0 ${item.bg}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <h2 className="text-2xl font-bold mt-1">{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Table Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link 
            to="/admin/orders" 
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            View All &rarr;
          </Link>
        </div>

        {/* Table Wrapper for responsiveness */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.user?.name || order.customer?.name || "Unknown User"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ₹{order.totalAmount?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}