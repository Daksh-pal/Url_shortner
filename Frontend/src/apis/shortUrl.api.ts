import type { ApiResponse, GetAllLinksResponse, DeleteLinkResponse } from "../types/url.types";
import { apiClient } from "./client";

export const createShortUrl = async (url: string, slug?: string): Promise<ApiResponse> => {
    const payload: { url: string; slug?: string } = { url };
    if (slug && slug.trim()) {
        payload.slug = slug.trim();
    }

    const response = await apiClient.post('/api/create', payload);
    return response.data;
};

export const getUserLinks = async (page = 1, limit = 10): Promise<GetAllLinksResponse> => {
    const response = await apiClient.get('/api/links', {
        params: { page, limit },
    });
    return response.data;
};

export const deleteUserLink = async (id: number): Promise<DeleteLinkResponse> => {
    const response = await apiClient.delete(`/api/links/${id}`);
    return response.data;
};