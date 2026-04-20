'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader2, MessageSquare, RefreshCw } from 'lucide-react';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/feedback?search=${searchQuery}`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      alert('Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const ngoFeedbacks = feedbacks.filter((f) => f.role?.toLowerCase() === 'ngo');

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Feedback</h1>
            <p className="text-gray-500">All feedback submitted by NGOs on the platform</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchFeedbacks()}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-64 shadow-sm"
              />
            </div>
            <button
              onClick={fetchFeedbacks}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-3 flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">
              {ngoFeedbacks.length} NGO feedback{ngoFeedbacks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
            <p className="text-gray-500 animate-pulse">Loading feedbacks...</p>
          </div>
        ) : ngoFeedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MessageSquare className="w-12 h-12 mb-4 opacity-40" />
            <p className="font-medium">No NGO feedback found</p>
          </div>
        ) : (
          <>
            {/* Section heading */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-5 bg-green-600 rounded-full" />
              <h2 className="text-base font-bold text-gray-800">NGO Feedback</h2>
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                {ngoFeedbacks.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ngoFeedbacks.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
                >
                  {/* Role badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg">
                      {item.role}
                    </span>
                    <span className="text-xs text-gray-400">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </span>
                  </div>

                  {/* Feedback text */}
                  <p className="text-sm text-gray-700 leading-relaxed">{item.feedback}</p>

                  {/* Document ID — helps admin trace the record */}
                  <p className="text-[10px] text-gray-300 font-mono mt-auto">ID: {item._id}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
