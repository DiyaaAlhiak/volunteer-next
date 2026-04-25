'use client';

import { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';

interface Team {
  id: number;
  name: string;
  leader_name: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  nationalId: string;
  job?: string;
  organization?: string;
  attachments?: string;
  status: string;
  createdAt: string;
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/admin/teams');
      if (response.ok) {
        const data = await response.json();
        setTeams(data.teams || []);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (team: Team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'pending' },
      approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Teams Management</h1>
        <p className="text-gray-600">View and manage registered teams</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Team Name</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Leader</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">City</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{team.name}</td>
                  <td className="px-6 py-4 text-gray-600">{team.leader_name}</td>
                  <td className="px-6 py-4 text-gray-600">{team.city}</td>
                  <td className="px-6 py-4">{getStatusBadge(team.status)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(team)}
                      className="inline-flex items-center px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No teams found</p>
          </div>
        )}
      </div>

      {/* Team Details Modal */}
      {showModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Team Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Team Name</label>
                    <p className="text-gray-900">{selectedTeam.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Leader Name</label>
                    <p className="text-gray-900">{selectedTeam.leader_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900">{selectedTeam.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedTeam.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Region</label>
                    <p className="text-gray-900">{selectedTeam.region}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                    <p className="text-gray-900">{selectedTeam.city}</p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Job</label>
                    <p className="text-gray-900">{selectedTeam.job || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Organization</label>
                    <p className="text-gray-900">{selectedTeam.organization || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">National ID</label>
                    <p className="text-gray-900">{selectedTeam.nationalId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <div>{getStatusBadge(selectedTeam.status)}</div>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              {selectedTeam.attachments && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <a
                      href={selectedTeam.attachments.startsWith('/') ? selectedTeam.attachments : `/${selectedTeam.attachments}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors font-medium"
                      download
                    >
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View/Download Attachment
                    </a>
                    <p className="text-sm text-gray-500 mt-2">
                      File path: {selectedTeam.attachments}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
