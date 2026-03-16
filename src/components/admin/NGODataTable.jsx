'use client';

import React from 'react';
import StatusBadge from './StatusBadge';
import { CheckCircle, XCircle, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

export default function NGODataTable({ ngos, onApprove, onReject }) {
  if (ngos.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
        <p className="text-gray-500">No applications found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">NGO Details</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Registration</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {ngos.map((ngo) => (
            <tr key={ngo._id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{ngo.ngoName}</div>
                <div className="text-sm text-gray-500 max-w-xs truncate">{ngo.bio}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 opacity-60" /> {ngo.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 opacity-60" /> {ngo.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 opacity-60" /> {ngo.address}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm">
                <StatusBadge status={ngo.status} />
              </td>
              <td className="px-6 py-4">
                {ngo.registrationProof ? (
                  <a 
                    href={ngo.registrationProof} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Proof <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm italic">Not provided</span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                {ngo.status === 'PENDING' && (
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onApprove(ngo._id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onReject(ngo._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
                {ngo.status !== 'pending' && (
                  <span className="text-xs text-gray-400">Processed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
