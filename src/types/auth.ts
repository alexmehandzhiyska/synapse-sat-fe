export type RegisterData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    country?: string;
    city?: string;
    school?: string;
}

export type LoginData = {
    email: string;
    password: string;
}

type AuthUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export type AuthResponse = {
    success: boolean;
    message: string;
    user: AuthUser;
    accessToken: string;
}

export type ForgotPasswordData = {
    email: string;
}

export type VerifyResetCodeData = {
    email: string;
    code: string;
}

export type ResetPasswordData = {
    email: string;
    code: string;
    newPassword: string;
    confirmNewPassword: string;
}

export type MessageResponse = {
    success: boolean;
    message: string;
}

type UserRole = 'student' | 'teacher' | 'admin';

export type UserProfile = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    country: string | null;
    city: string | null;
    school: string | null;
    role: UserRole;
}

export type UpdateProfileData = {
    firstName: string;
    lastName: string;
    country?: string;
    city?: string;
    school?: string;
}