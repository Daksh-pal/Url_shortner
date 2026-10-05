/**
 * Extracts clean domain name from a URL string (strips protocol and www)
 */
export const getDomain = (urlString: string): string => {
    try {
        const url = new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`);
        return url.hostname.replace(/^www\./, "");
    } catch {
        return urlString;
    }
};

/**
 * Returns Google Favicon service URL for a given target URL
 */
export const getFaviconUrl = (urlString: string): string => {
    try {
        const domain = getDomain(urlString);
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
        return "";
    }
};
