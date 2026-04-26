"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Loader2,
  MessageSquare,
  RefreshCw,
  Users,
  Building2,
} from "lucide-react";

const TABS = [
  { label: "All", value: "ALL", icon: MessageSquare, color: "gray" },
  { label: "Donors", value: "DONOR", icon: Users, color: "blue" },
  { label: "NGOs", value: "NGO", icon: Building2, color: "green" },
];

const roleBadgeStyles = {
  NGO: "bg-green-50 text-green-700 border-green-200",
  DONOR: "bg-blue-50 text-blue-700 border-blue-200",
};

const tabActiveStyles = {
  ALL: "bg-gray-900 text-white border-gray-900",
  DONOR: "bg-blue-600 text-white border-blue-600",
  NGO: "bg-green-600 text-white border-green-600",
};

const tabInactiveStyles =
  "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/admin/feedback?search=${searchQuery}&role=${roleFilter}`,
      );
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      alert("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    axios
      .get(`/api/admin/feedback?search=${searchQuery}&role=${roleFilter}`)
      .then((res) => {
        if (active) setFeedbacks(res.data);
      })
      .catch(() => {
        if (active) alert("Failed to fetch feedbacks");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [roleFilter]); // searchQuery is applied on Enter / Refresh button

  const donorCount = feedbacks.filter(
    (f) => f.role?.toLowerCase() === "donor",
  ).length;
  const ngoCount = feedbacks.filter(
    (f) => f.role?.toLowerCase() === "ngo",
  ).length;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Feedback</h1>
            <p className="text-gray-500">
              Feedback submitted by donors and NGOs on the platform
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchFeedbacks()}
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

        {/* Tabs + Stats */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = roleFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setRoleFilter(tab.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all shadow-sm ${
                  isActive ? tabActiveStyles[tab.value] : tabInactiveStyles
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {!loading && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}
                  >
                    {tab.value === "ALL"
                      ? feedbacks.length
                      : tab.value === "DONOR"
                        ? donorCount
                        : ngoCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
            <p className="text-gray-500 animate-pulse">Loading feedbacks...</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MessageSquare className="w-12 h-12 mb-4 opacity-40" />
            <p className="font-medium">No feedback found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {feedbacks.map((item) => {
              const role = item.role?.toUpperCase();
              const badgeStyle =
                roleBadgeStyles[role] ??
                "bg-gray-50 text-gray-600 border-gray-200";
              return (
                <div
                  key={item._id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold border px-2.5 py-1 rounded-lg ${badgeStyle}`}
                    >
                      {item.role}
                    </span>
                    <span className="text-xs text-gray-400">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.feedback}
                  </p>

                  <p className="text-[10px] text-gray-300 font-mono mt-auto">
                    ID: {item._id}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
