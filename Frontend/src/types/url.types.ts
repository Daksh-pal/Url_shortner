export interface ShortenedItem {
    _id?: string;
    shortId: string;
    originalUrl: string;
    clicks?: number;
    createdAt?: string;
    updatedAt?: string;
    user?: string;
}

export interface ApiResponse {
    message: string;
    newRec: ShortenedItem;
}

export interface ShortenedResult {
    shortUrl: string;
    shortId: string;
    originalUrl: string;
    createdAt: string;
    clicks?: number;
}
