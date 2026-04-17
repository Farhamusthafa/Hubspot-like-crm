"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getSalesReport } from "@/lib/api";
import { useSnackbar } from "notistack";

interface SalesData {
  month?: number;
  year?: number;
  totalValue: number;
  wonValue: number;
}

interface ChartData {
  label: string;
  total: number;
  won: number;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function SalesReports() {
  const [view, setView] = useState<"monthly" | "yearly">("monthly");
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const data = await getSalesReport();
        console.log('Sales data received:', data);
        setSalesData(data);
      } catch (error: any) {
        console.error('Failed to fetch sales data:', error);
        enqueueSnackbar(error.message || 'Failed to fetch sales report', {
          variant: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [enqueueSnackbar]);

  // Process data for chart
  const getChartData = (): ChartData[] => {
    console.log('Processing sales data:', salesData, 'View:', view);

    if (view === "monthly") {
      const monthlyData = salesData.map(item => ({
        label: item.month ? monthNames[item.month - 1] : '',
        total: item.totalValue,
        won: item.wonValue
      }));
      console.log('Monthly chart data:', monthlyData);
      return monthlyData;
    } else {
      // Group by year for yearly view
      const yearlyMap = new Map<number, { total: number; won: number }>();

      salesData.forEach(item => {
        const year = item.year || new Date().getFullYear();
        const existing = yearlyMap.get(year) || { total: 0, won: 0 };
        yearlyMap.set(year, {
          total: existing.total + item.totalValue,
          won: existing.won + item.wonValue
        });
      });

      const yearlyData = Array.from(yearlyMap.entries()).map(([year, data]) => ({
        label: year.toString(),
        total: data.total,
        won: data.won
      }));
      console.log('Yearly chart data:', yearlyData);
      return yearlyData;
    }
  };

  const chartData = getChartData();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full flex flex-col h-[370px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-semibold text-gray-900">
          Sales Reports
        </h3>

        <select
          value={view}
          onChange={(e) => setView(e.target.value as any)}
          className="border border-gray-200 text-[12px] font-semibold px-3 py-1.5 rounded-lg text-gray-700 focus:outline-none"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-sm font-medium">No sales data available</p>
              <p className="text-xs mt-1">Sales will appear here once deals are won</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={34} barGap={-34} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>

              {/* Gradient for purple bars */}
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A5B4FC" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={1} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#E5E7EB"
                vertical={false}
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#4B5563", fontWeight: 700 }}
              />

              <YAxis
                tickFormatter={(v) => `$${v.toLocaleString()}`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#4B5563", fontWeight: 700 }}
              />

              {/* BACKGROUND TOTAL BAR */}
              <Bar
                dataKey="total"
                fill="rgba(124,108,242,0.18)"
                radius={[8, 8, 8, 8]}
              />

              <Bar
                dataKey="won"
                fill="url(#purpleGradient)"
                radius={[8, 8, 8, 8]}
                barSize={34}
              />

            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}