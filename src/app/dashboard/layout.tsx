// src/app/dashboard/layout.tsx
"use client";

import type { ReactNode } from "react";
import Topbar from "@/components/dashboard/Topbar";
import Sidebar from "@/components/dashboard/Sidebar";

import { SearchProvider } from "@/context/SearchContext";
import { AuthProvider } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <SearchProvider>
        <div className="flex flex-col h-screen overflow-hidden">
          {/* 1. Ensure Topbar height matches the h-[calc(100vh-64px)] logic */}
          <Topbar />

          <div className="flex flex-1 overflow-hidden">
            <Sidebar />

            {/* 2. Reduced padding from 60px to 32px (p-8) to match the screenshot gap */}
            <main className="flex-1 p-6 overflow-auto bg-[#F9FAFB]">
              <div className="max-w-[1600px] mx-auto w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SearchProvider>
    </AuthProvider>
  );
}