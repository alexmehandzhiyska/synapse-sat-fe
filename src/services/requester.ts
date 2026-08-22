const BASE_URL = import.meta.env.VITE_BASE_URL;

interface RequestOptions {
    body?: unknown;

    // Attaches the stored access token as a bearer authorization header.
    auth?: boolean;
}

const request = async <T>(
    path: string,
    method: string,
    options: RequestOptions = {},
): Promise<T> => {
    const { body, auth = false } = options;

    const headers: Record<string, string> = {};

    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }

    if (auth) {
        headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    // Empty bodies have nothing to parse.
    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : null;

    if (!response.ok) {
        throw new Error(data?.message || 'Something went wrong.');
    }

    return data as T;
};

export const get = <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>(path, 'GET', { auth: false, ...options });

export const post = <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>(path, 'POST', { auth: true, ...options });

export const put = <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>(path, 'PUT', { auth: true, ...options });

export const patch = <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>(path, 'PATCH', { auth: true, ...options });