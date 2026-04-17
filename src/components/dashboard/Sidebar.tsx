

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { usePermissions } from "@/lib/permissions";
import { useSnackbar } from "notistack";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

interface MenuItem {
  name: string;
  icon: ReactNode;
  path: string;
  requiredPermission?: keyof import('@/lib/permissions').UserPermissions;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { can } = usePermissions();
  const { enqueueSnackbar } = useSnackbar();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const baseMenu: MenuItem[] = [
    { name: "Dashboard", icon: <DashboardIcon fontSize="small" />, path: "/dashboard" },
    { name: "Leads", icon: <PeopleIcon fontSize="small" />, path: "/dashboard/leads" },
    { name: "Companies", icon: <BusinessIcon fontSize="small" />, path: "/dashboard/companies" },
    { name: "Deals", icon: <WorkIcon fontSize="small" />, path: "/dashboard/deals" },
    { name: "Tickets", icon: <ConfirmationNumberIcon fontSize="small" />, path: "/dashboard/tickets" },
    {
      name: "Users",
      icon: <ManageAccountsIcon fontSize="small" />,
      path: "/dashboard/users",
      requiredPermission: "canViewAllUsers"
    },
  ];

  // Filter menu based on permissions (only after mounted)
  const filteredMenu = mounted ? baseMenu.filter(item => {
    if (item.requiredPermission) {
      return can(item.requiredPermission);
    }
    return true;
  }) : baseMenu.filter(item => !item.requiredPermission); // Only show items without permissions during SSR

  const handleRestrictedAccess = (item: MenuItem) => {
    if (item.requiredPermission && !can(item.requiredPermission)) {
      const warningMessages: Record<string, string> = {
        canViewAllUsers: '⚠️ User Management is only available for administrators',
        canCreateUsers: '⚠️ Creating users is only available for administrators',
        canUpdateUsers: '⚠️ Updating users is only available for administrators',
        canDeleteUsers: '⚠️ Deleting users is only available for administrators',
      };

      const message = warningMessages[item.requiredPermission] || '⚠️ You do not have permission to access this feature';
      enqueueSnackbar(message, {
        variant: 'warning',
        autoHideDuration: 3000,
      });
      return true; // Prevent navigation
    }
    return false; // Allow navigation
  };

  return (
    <aside
      className="w-[90px] flex flex-col items-center py-6 gap-6 shadow-sm bg-white"
    >
      {filteredMenu.map((item) => {
        const isActive =
          item.path === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.path);

        return (
          <Link
            key={item.name}
            href={item.path}
            className="group flex flex-col items-center gap-1"
            onClick={(e) => {
              if (handleRestrictedAccess(item)) {
                e.preventDefault();
              }
            }}
          >
            {/* ICON */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200
          ${isActive ? "text-white" : "bg-white text-slate-400 border border-gray-200"}
          group-hover:bg-gray-50 group-hover:text-blue-600
        `}
              style={{
                backgroundColor: isActive ? "#5948DB" : undefined
              }}
            >
              {item.icon}
            </div>

            {/* TEXT */}
            <span
              className={`text-[13px] leading-none
          ${isActive
                  ? "font-semibold text-slate-600"
                  : "font-semibold text-slate-600 group-hover:text-slate-700"}
        `}
            >
              {item.name}
            </span>
          </Link>
        );
      })}

    </aside>
  );
}
