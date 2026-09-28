import z from 'zod';

export const createShortUrlSchema = z.object({
    url : z.string().trim().url("Must be a valid URL including http:// or https://"),
    slug: z.string().trim().min(3,"Custom slug must be at least 3 characters long").max(20,"Custom slug must be at most 20 characters long").regex(/^[a-zA-Z0-9_-]+$/, "Slug can only contain letters, numbers, hyphens, and underscores").optional(),
});