"use client";

import { useState, useEffect } from "react";
import { getConversionData } from "@/lib/api";
import { useSnackbar } from "notistack";

interface Step {
  label: string;
  color: string;
  percent: number;
}

interface ConversionData {
  label: string;
  count: number;
  percent: number;
}

const statusColors: { [key: string]: string } = {
  'Contacted': '#5948DB',
  'Qualified': '#2DD4BF',
  'Open': '#FACC15',
  'Inprogress': '#5948DB',
  'Won': '#22C55E',
  'Lost': '#EF4444'
};

export default function ConversionCard() {
  const [conversionData, setConversionData] = useState<ConversionData[]>([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchConversionData = async () => {
      try {
        setLoading(true);
        const data = await getConversionData();
        setConversionData(data);
      } catch (error: any) {
        console.error('Failed to fetch conversion data:', error);
        enqueueSnackbar(error.message || 'Failed to fetch conversion data', {
          variant: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConversionData();
  }, [enqueueSnackbar]);

  const steps: Step[] = conversionData.map(item => ({
    label: item.label,
    color: statusColors[item.label] || '#6B7280',
    percent: item.percent
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full sm:w-full md:w-full lg:w-full xl:w-full flex flex-col h-[370px]">
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-[18px] font-semibold mb-4 text-gray-900">
          Lead Conversion Funnel
        </h3>

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.label}>
                <p
                  className="text-[13px] font-semibold text-gray-600"
                >
                  {step.label} ({step.percent}%)
                </p>

                {/* Track */}
                <div className="w-full h-2 rounded-full"
                  style={{ backgroundColor: "#E5E7EB" }}
                >
                  {/* Progress */}
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${step.percent}%`,
                      backgroundColor: step.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
