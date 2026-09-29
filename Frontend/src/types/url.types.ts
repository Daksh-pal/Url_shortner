export interface ShortenedItem {
    _id?: string;
    id?: number;
    shortId: string;
    originalUrl: string;
    clicks?: number;
    createdAt?: string;
    updatedAt?: string;
    user?: string;
    userId?: number;
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

export interface UserLink {
    id: number;
    shortId: string;
    originalUrl: string;
    clicks: number;
    userId?: number;
    createdAt: string;
    updatedAt: string;
}

export interface GetAllLinksResponse {
    links: UserLink[];
}

export interface DeleteLinkResponse {
    message: string;
}

