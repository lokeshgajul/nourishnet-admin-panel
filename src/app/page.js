'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  LayoutDashboard,
  Building2,
  Bell,
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    TOTAL: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Pending Applications', 
      value: stats.PENDING, 
      icon: Clock, 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-100',
      link: '/admin/ngos' 
    },
    { 
      label: 'Approved NGOs', 
      value: stats.APPROVED, 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bgColor: 'bg-green-100',
      link: '/admin/ngos' 
    },
    { 
      label: 'Rejected Applications', 
      value: stats.REJECTED, 
      icon: XCircle, 
      color: 'text-red-600', 
      bgColor: 'bg-red-100',
      link: '/admin/ngos' 
    },
    { 
      label: 'Total Registered', 
      value: stats.TOTAL, 
      icon: Building2, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      link: '/admin/ngos' 
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Status of your NourishNet ecosystem at a glance</p>
          </div>
          <button className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition-all relative">
            <Bell className="w-6 h-6 text-gray-500" />
            {stats.PENDING > 0 && (
              <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`${card.bgColor} p-3 rounded-2xl`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <Link 
                  href={card.link}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div>
                <span className="text-4xl font-bold text-gray-900 tracking-tight">{card.value}</span>
                <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-wider">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Recent Applications</h3>
              <Link href="/admin/ngos" className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="p-8 text-center py-20">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Quick access to NGO management is available in the sidebar or via the link above.</p>
              <Link 
                href="/admin/ngos" 
                className="mt-6 inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
              >
                Go to NGO Management
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 text-white shadow-xl shadow-green-600/20 flex flex-col justify-between">
            <div>
              <LayoutDashboard className="w-12 h-12 opacity-80 mb-6" />
              <h3 className="text-2xl font-bold mb-3">Quick Actions</h3>
              <p className="text-green-50/80 text-sm leading-relaxed mb-8">
                Manage your food donation network efficiently. Approve new partners to expand your impact.
              </p>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center text-sm font-medium bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
                <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
                Review {stats.PENDING} New Applications
              </li>
              <li className="flex items-center text-sm font-medium bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
                Generate Growth Report
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
