

import KPISection from "@/components/dashboard/KPISection";
import ConversionCard from "@/components/dashboard/ConversionCard";
import SalesReport from "@/components/dashboard/SalesReport";
import TeamTable from "@/components/dashboard/TeamTable";

export default function DashboardPage() {
  return (
    <div className="space-y-4" suppressHydrationWarning>
      {/* KPI SECTION */}
      <KPISection />

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="lg:col-span-1">
          <ConversionCard />
        </div>

        <div className="lg:col-span-3">
          <SalesReport />
        </div>
      </div>

      {/* TEAM TABLE */}
      <TeamTable />
    </div>
  );
}
