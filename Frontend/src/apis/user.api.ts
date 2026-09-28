import { apiClient } from "./client";

export interface User {
    name?: string;
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    message: string;
    user?: AuthUser;
}

export const loginUser = async (user: User): Promise<AuthResponse> => {
    const { email, password } = user;
    const response = await apiClient.post('/api/auth/login',{email , password})
    return response.data;
};

export const registerUser = async (user: User): Promise<AuthResponse> => {
    const { name, email, password } = user;
    const response = await apiClient.post("/api/auth/register" , {name , email , password} , { withCredentials: true });
    return response.data;
};

export const logoutUser = async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/api/auth/logout', { withCredentials: true });
    return response.data;
}