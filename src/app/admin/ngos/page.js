'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NGODataTable from '@/components/admin/NGODataTable';
import { Search, Filter, Loader2, CheckCircle } from 'lucide-react';

export default function NGOManagementPage() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New state for approval modal
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [sendCredentials, setSendCredentials] = useState(true);
  const [approving, setApproving] = useState(false);

  const fetchNgos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/ngos?status=${statusFilter}&search=${searchQuery}`);
      setNgos(response.data);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      alert('Failed to fetch NGOs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgos();
  }, [statusFilter]);

  const handleApprove = (id) => {
    const ngo = ngos.find(n => n._id === id);
    setSelectedNgo(ngo);
    setShowApproveModal(true);
  };

  const confirmApproval = async () => {
    if (!selectedNgo) return;
    
    try {
      setApproving(true);
      await axios.patch(`/api/admin/ngos/${selectedNgo._id}/approve`, { 
        sendCredentials 
      });
      setShowApproveModal(false);
      fetchNgos();
    } catch (error) {
      console.error('Error approving NGO:', error);
      const errorMessage = error.response?.data?.message || 'Failed to approve NGO';
      alert(errorMessage);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Please enter a rejection reason (optional):');
    if (reason === null) return;

    try {
      await axios.patch(`/api/admin/ngos/${id}/reject`, { rejectionReason: reason });
      alert('NGO rejected successfully');
      fetchNgos();
    } catch (error) {
      console.error('Error rejecting NGO:', error);
      alert('Failed to reject NGO');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">NGO Applications</h1>
            <p className="text-gray-500">Review and manage registration requests from NGOs</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search NGOs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchNgos()}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-64 shadow-sm"
              />
            </div>
            <button 
              onClick={fetchNgos}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 bg-white p-1 rounded-2xl w-fit shadow-sm border border-gray-100">
          {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === status 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="capitalize">{status}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
            <p className="text-gray-500 animate-pulse">Loading applications...</p>
          </div>
        ) : (
          <NGODataTable 
            ngos={ngos} 
            onApprove={handleApprove} 
            onReject={handleReject} 
          />
        )}
      </div>

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Approve Application</h3>
              <p className="text-gray-500 mb-6">
                You are about to approve <span className="font-semibold text-gray-900">{selectedNgo?.ngoName}</span>. 
                This will grant them access to the platform.
              </p>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-8">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={sendCredentials}
                      onChange={(e) => setSendCredentials(e.target.checked)}
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${sendCredentials ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${sendCredentials ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <div className="ml-4">
                    <span className="text-sm font-semibold text-gray-900 block">Send Account Credentials</span>
                    <span className="text-xs text-gray-500">Auto-generate and email temporary password</span>
                  </div>
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  disabled={approving}
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={approving}
                  onClick={confirmApproval}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 disabled:opacity-50 flex items-center justify-center"
                >
                  {approving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}