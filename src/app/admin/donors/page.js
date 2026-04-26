'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2, UserX, UserCheck, RefreshCw, User } from 'lucide-react';

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: 'bg-green-50 text-green-700 border border-green-200',
    SUSPENDED: 'bg-red-50 text-red-700 border border-red-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export default function DonorManagementPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [suspendingId, setSuspendingId] = useState(null);
  const [activatingId, setActivatingId] = useState(null);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/admin/donor?status=${statusFilter}&search=${searchQuery}`
      );
      setDonors(response.data);
    } catch (error) {
      console.error('Error fetching donors:', error);
      alert('Failed to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [statusFilter]);

  const handleActivate = async (donor) => {
    if (!confirm(`Reactivate "${donor.donorName}"? They will regain full access.`)) return;

    try {
      setActivatingId(donor._id);
      await axios.patch(`/api/admin/donor/${donor._id}/activate`);
      fetchDonors();
    } catch (error) {
      console.error('Error activating donor:', error);
      alert('Failed to activate donor');
    } finally {
      setActivatingId(null);
    }
  };

  const handleSuspend = async (donor) => {
    if (!confirm(`Suspend "${donor.donorName}"? They will be logged out immediately.`)) return;

    try {
      setSuspendingId(donor._id);
      await axios.patch(`/api/admin/donor/${donor._id}/suspend`);
      fetchDonors();
    } catch (error) {
      console.error('Error suspending donor:', error);
      alert('Failed to suspend donor');
    } finally {
      setSuspendingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Donors</h1>
            <p className="text-gray-500">View and manage registered donors on the platform</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search donors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchDonors()}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-64 shadow-sm"
              />
            </div>
            <button
              onClick={fetchDonors}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 bg-white p-1 rounded-2xl w-fit shadow-sm border border-gray-100">
          {['ALL', 'ACTIVE', 'SUSPENDED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
            <p className="text-gray-500 animate-pulse">Loading donors...</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <User className="w-12 h-12 mb-4 opacity-40" />
            <p className="font-medium">No donors found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Donor</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Address</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Joined</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {donors.map((donor) => (
                  <tr key={donor._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {donor.profileImage ? (
                          <img
                            src={donor.profileImage}
                            alt={donor.donorName}
                            className="w-9 h-9 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{donor.donorName}</p>
                          <p className="text-xs text-gray-400">{donor.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{donor.email}</p>
                      <p className="text-xs text-gray-400">{donor.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{donor.address || '—'}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(donor.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={donor.status ?? 'ACTIVE'} />
                    </td>
                    <td className="px-6 py-4">
                      {(donor.status ?? 'ACTIVE') === 'ACTIVE' ? (
                        <button
                          onClick={() => handleSuspend(donor)}
                          disabled={suspendingId === donor._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {suspendingId === donor._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <UserX className="w-3.5 h-3.5" />
                          )}
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(donor)}
                          disabled={activatingId === donor._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          {activatingId === donor._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
