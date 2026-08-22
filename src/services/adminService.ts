import type { AdminUser, UpdateUserData } from '../types/auth';
import { del, get, patch } from './requester';

const getAllUsers = (): Promise<AdminUser[]> =>
    get<AdminUser[]>('/users', { auth: true });

const updateUser = (id: string, data: UpdateUserData): Promise<AdminUser> =>
    patch<AdminUser>(`/users/${id}`, { body: data });

const deactivateUser = (id: string): Promise<AdminUser> =>
    del<AdminUser>(`/users/${id}`);

const activateUser = (id: string): Promise<AdminUser> =>
    patch<AdminUser>(`/users/${id}/activate`);

const adminService = { getAllUsers, updateUser, deactivateUser, activateUser };

export default adminService;