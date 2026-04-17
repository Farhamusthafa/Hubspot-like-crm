"use client";

import { useState, useEffect } from "react";
import { getTeamPerformance } from "@/lib/api";
import { useSnackbar } from "notistack";
import { useAccessWarnings } from "@/hooks/useAccessWarnings";

interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  totalLeads: number;
  wonLeads: number;
  revenue: number;
}

export default function TeamTable() {
  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  // Enable access warnings
  useAccessWarnings();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const data = await getTeamPerformance();
        if (data) {
          setTeamData(data);
        } else {
          // Access denied - data will be null, just show empty state
          setTeamData([]);
        }
      } catch (error: any) {
        console.error('Failed to fetch team data:', error);
        enqueueSnackbar(error.message || 'Failed to fetch team data', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [enqueueSnackbar]);

  const handleExport = () => {
    const headers = ["Employee", "Active Deals", "Closed Deals", "Revenue", "Conversion Rate"];
    const rows = teamData.map(member => [
      `${member.firstName} ${member.lastName}`,
      member.totalLeads - member.wonLeads,
      member.wonLeads,
      member.revenue,
      member.totalLeads > 0 ? `${((member.wonLeads / member.totalLeads) * 100).toFixed(1)}%` : '0%'
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "team_performance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    enqueueSnackbar("Team performance report exported successfully", { variant: 'success' });
  };

  return (
    <div className="bg-white rounded-2xl p-6 mt-6 w-full border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[18px] font-bold text-gray-900">
          Team Performance Tracking
        </h3>

        <button
          className="px-5 py-2 rounded-lg border border-blue-400 text-blue-600 text-sm font-bold hover:bg-blue-50 transition"
          onClick={handleExport}
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : teamData.length > 0 ? (
        <div className="space-y-3">
          {/* Table Head */}
          <div className="grid grid-cols-5 px-4 text-[14px] font-semibold text-gray-700 bg-gray-50 py-3">
            <span>Employee</span>
            <span className="text-right">Active Deals</span>
            <span className="text-right">Closed Deals</span>
            <span className="text-right">Revenue</span>
            <span className="text-right">Conversion Rate</span>
          </div>

          {/* Rows */}
          {teamData.map((member) => {
            const activeDeals = member.totalLeads - member.wonLeads;
            const conversionRate = member.totalLeads > 0
              ? ((member.wonLeads / member.totalLeads) * 100).toFixed(1)
              : '0';

            return (
              <div
                key={member.id}
                className="grid grid-cols-5 items-center bg-white rounded-xl border border-gray-100 px-4 py-3"
              >
                {/* Employee */}
                <div>
                  <span className="text-[14px] font-semibold text-gray-700">
                    {member.firstName} {member.lastName}
                  </span>
                  <span className="text-[12px] text-gray-500 block">
                    {member.email}
                  </span>
                </div>

                {/* Active Deals */}
                <span className="text-[14px] font-semibold text-gray-700 text-right">
                  {activeDeals}
                </span>

                {/* Closed Deals */}
                <span className="text-[14px] font-semibold text-gray-700 text-right">
                  {member.wonLeads}
                </span>

                {/* Revenue */}
                <span className="text-[14px] font-semibold text-gray-800 text-right">
                  ${member.revenue.toLocaleString()}
                </span>

                {/* Conversion Rate */}
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${parseFloat(conversionRate) >= 20
                    ? "bg-green-100 text-green-600"
                    : parseFloat(conversionRate) >= 10
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-500"
                    }`}
                >
                  {conversionRate}%
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No team performance data available</p>
          <p className="text-sm mt-2">Team performance data will appear here once leads are assigned to team members.</p>
        </div>
      )}
    </div>
  );
}
