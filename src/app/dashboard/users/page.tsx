"use client";

import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { ModuleHeader } from '@/components/module';
import { PageLayout } from '@/components/shared/PageLayout';
import { DataTable } from '@/components/shared/DataTable';
import { createUserColumns } from '@/components/users/users.columns';
import { User } from '@/app/types/usertypes';
import { createUsersConfig } from '@/config/users.config';
import UserModal from '@/components/modals/UserModal';
import DeleteUserModal from '@/components/modals/DeleteUserModal';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { usePermissions } from '@/lib/permissions';
import { getAllUsers, createUserAccount, updateUser, deleteUser, toggleUserStatus } from '@/lib/api';
import { any } from 'zod';

export default function UsersPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { isAdmin, can } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debug logging
  console.log('UsersPage Debug:', {
    isAdmin,
    can,
    token: typeof window !== 'undefined' && localStorage.getItem('token') ? 'Token exists' : 'No token'
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const companyId = storedUser.companyId;
      const data = await getAllUsers(companyId);
      setUsers(data);
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to fetch users', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string | number) => {
    const user = users.find(u => u.id === Number(id));
    if (user) {
      setUserToDelete(user);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        console.log('Attempting to delete user:', userToDelete);
        const response = await deleteUser(userToDelete.id.toString());
        console.log('Delete response:', response);
        await fetchUsers(); // Refresh the list
        enqueueSnackbar('User deleted successfully', { variant: 'success' });
        setUserToDelete(null);
        setIsDeleteModalOpen(false);
      } catch (error: any) {
        console.error('Delete user error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        enqueueSnackbar(error.message || 'Failed to delete user', { variant: 'error' });
      }
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await toggleUserStatus(user.id.toString());
      await fetchUsers(); // Refresh the list
      enqueueSnackbar(`User status changed successfully`, { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to update user status', { variant: 'error' });
    }
  };

  const handleSaveUser = async (data: any) => {
    console.log('handleSaveUser called with:', data);
    console.log('Editing user:', editingUser);
    console.log('Token exists:', typeof window !== 'undefined' && localStorage.getItem('token') ? 'Yes' : 'No');

    try {
      if (editingUser) {
        console.log('Updating user:', editingUser.id);
        await updateUser(editingUser.id.toString(), data);
        enqueueSnackbar('User updated successfully', { variant: 'success' });
      } else {
        console.log('Creating new user');
        await createUserAccount(data);
        enqueueSnackbar('User created successfully', { variant: 'success' });
      }
      await fetchUsers(); // Refresh the list
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (error: any) {
      console.error('Save user error:', error);
      enqueueSnackbar(error.message || 'Failed to save user', { variant: 'error' });
    }
  };

  const headerConfig = createUsersConfig({
    onCreate: () => {
      setEditingUser(null);
      setIsModalOpen(true);
    },
  });

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock pagination: show users only on page 1 to match other modules
  const paginatedUsers = currentPage === 1 ? filteredUsers : [];

  const columns = createUserColumns({
    onToggleStatus: handleToggleStatus
  });

  return (
    <ProtectedRoute adminOnly>
      <PageLayout>
        <ModuleHeader
          title="User Management"
          description="Manage system users and their permissions"
          searchPlaceholder="Search users by name or email..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          buttons={[
            {
              id: 'add-user',
              label: "Add User",
              variant: 'primary' as const,
              onClick: () => setIsModalOpen(true),
              disabled: !can('canCreateUsers')
            }
          ]}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <div className="bg-white border-x border-gray-200">
          <DataTable
            columns={columns}
            data={paginatedUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteClick}
            nameColumn="firstName"
            emptyMessage="No users found. Try adjusting your search or add a new user."
            isLoading={isLoading}
          />
        </div>

        <UserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
          onSave={handleSaveUser}
          initialData={editingUser}
        />

        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          userName={userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : ''}
        />
      </PageLayout>
    </ProtectedRoute>
  );
}
