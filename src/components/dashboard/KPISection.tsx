"use client";

import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { ReactNode, useEffect, useState } from "react";
import { getDashboardKPIs } from "@/lib/api";
import { useSnackbar } from "notistack";

interface KPI {
  title: string;
  value: string;
  icon: ReactNode;
}

interface KPIData {
  totalLeads: number;
  activeDeals: number;
  closedDeals: number;
  monthlyRevenue: number;
}

export default function KPISection() {
  const [kpis, setKpis] = useState<KPI[]>([
    {
      title: "Total Leads",
      value: "0",
      icon: <PeopleIcon sx={{ color: "#2563eb", fontSize: 28 }} />,
    },
    {
      title: "Active Deals",
      value: "0",
      icon: <WorkIcon sx={{ color: "#16a34a", fontSize: 28 }} />,
    },
    {
      title: "Closed Deals",
      value: "0",
      icon: <CheckCircleIcon sx={{ color: "#dca526", fontSize: 28 }} />,
    },
    {
      title: "Monthly Revenue",
      value: "0",
      icon: <MonetizationOnIcon sx={{ color: "#d8ea33", fontSize: 28 }} />,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true);
        const data: KPIData = await getDashboardKPIs();

        const updatedKpis: KPI[] = [
          {
            title: "Total Leads",
            value: data.totalLeads.toLocaleString(),
            icon: <PeopleIcon sx={{ color: "#2563eb", fontSize: 28 }} />,
          },
          {
            title: "Active Deals",
            value: data.activeDeals.toLocaleString(),
            icon: <WorkIcon sx={{ color: "#16a34a", fontSize: 28 }} />,
          },
          {
            title: "Closed Deals",
            value: data.closedDeals.toLocaleString(),
            icon: <CheckCircleIcon sx={{ color: "#dca526", fontSize: 28 }} />,
          },
          {
            title: "Monthly Revenue",
            value: `$${data.monthlyRevenue.toLocaleString()}`,
            icon: <MonetizationOnIcon sx={{ color: "#d8ea33", fontSize: 28 }} />,
          },
        ];

        setKpis(updatedKpis);
      } catch (error: any) {
        console.error('Failed to fetch KPIs:', error);
        enqueueSnackbar(error.message || 'Failed to fetch dashboard metrics', {
          variant: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();

    // Refresh KPIs every 30 seconds
    const interval = setInterval(fetchKPIs, 30000);
    return () => clearInterval(interval);
  }, [enqueueSnackbar]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {kpis.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-xl p-4 shadow flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-gray-500">{item.title}</p>
            <h2 className="text-2xl font-semibold mt-1">
              {loading ? (
                <span className="animate-pulse bg-gray-200 rounded w-20 h-6 inline-block"></span>
              ) : (
                item.value
              )}
            </h2>
          </div>

          <div className="bg-gray-100 p-3 rounded-full">{item.icon}</div>
        </div>
      ))}
    </div>
  );
}
