import type { UpdateProfileData, UserProfile } from '../types/auth';
import { get, put } from './requester';

const getProfile = async () => {
    return await get<UserProfile>('/auth/me', { auth: true });
};

const update = async (data: UpdateProfileData) => {
    return await put<UserProfile>('/auth/me', { body: data });
};

const userService = { getProfile, update };
export default userService;