import type { UserProfile } from '../types/auth';
import { get } from './requester';

const getProfile = async () => {
    return await get<UserProfile>('/auth/me', { auth: true });
};

const userService = { getProfile };
export default userService;