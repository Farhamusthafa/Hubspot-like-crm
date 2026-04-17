'use client';

import { ColumnDef } from "@/components/shared/DataTable";
import { User } from "@/app/types/usertypes";
import { usePermissions } from "@/lib/permissions";

interface UserColumnsProps {
  onToggleStatus?: (user: User) => void;
}

export const createUserColumns = ({ onToggleStatus }: UserColumnsProps): ColumnDef<User>[] => {
  const { can, canUpdateUserData, canDeleteUserData } = usePermissions();

  return [
    {
      key: "profileImage",
      label: "Profile",
      render: (user: User) => (
        <div className="flex items-center justify-center">
          {user.profileImage ? (
            <img src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase transition-transform hover:scale-105">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
          )}
        </div>
      ),
      className: "w-16"
    },
    {
      key: "firstName",
      label: "Full Name",
      render: (user: User) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 leading-tight">
            {user.firstName} {user.lastName}
          </span>
        </div>
      ),
      className: "min-w-[150px]"
    },
    {
      key: "email",
      label: "Email",
      className: " font-lexend text-sm"
    },
    {
      key: "role",
      label: "Role",
      render: (user: User) => {
        const normalizedRole = user.role === 'admin' ? 'Admin' : user.role === 'user' ? 'User' : user.role;
        const roleStyles: Record<string, string> = {
          Admin: 'bg-purple-100 text-purple-700 border-purple-200',
          User: 'bg-blue-100 text-blue-700 border-blue-200'
        };
        return (
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${roleStyles[normalizedRole] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {normalizedRole}
          </span>
        );
      }
    },
    {
      key: "status",
      label: "Status",
      render: (user: User) => (
        <button
          onClick={() => onToggleStatus?.(user)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium transition-all duration-200 active:scale-95 hover:shadow-sm ${user.status === 'Active'
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
          {user.status}
        </button>
      )
    },
    {
      key: "companyName",
      label: "Company",
      render: (user: User) => (
        <span className="text-gray-600 text-sm">{user.companyName || "-"}</span>
      ),
    },
    {
      key: "industryType",
      label: "Industry",
      render: (user: User) => user.industryType || "-",
      className: "italic text-sm"
    },
    {
      key: "createdAt",
      label: "Joined Date",
      render: (user: User) => user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : "-",
      className: " text-sm whitespace-nowrap"
    }
  ];
};
