
import type { ApiResponse } from "../types/url.types";
import { apiClient } from "./client";

export const createShortUrl = async (url: string, slug?: string): Promise<ApiResponse> => {
    const payload: { url: string; slug?: string } = { url };
    if (slug && slug.trim()) {
        payload.slug = slug.trim();
    }

    const response = await apiClient.post('/api/create', payload)
    return response.data;
};