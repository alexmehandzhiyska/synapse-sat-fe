import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { del, get, patch, post, put } from './requester';

const BASE_URL = import.meta.env.VITE_BASE_URL;

describe('requester', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    const givenResponse = (body: string | null, status = 200) => {
        fetchMock.mockResolvedValue(new Response(body, { status }));
    };

    const requestInit = () => fetchMock.mock.calls[0][1] as RequestInit;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
        vi.stubGlobal('localStorage', { getItem: vi.fn().mockReturnValue('access-token') });
        givenResponse(JSON.stringify({ id: 'test-1' }));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('get', () => {
        it('sends a public GET request to the base url and returns the parsed body', async () => {
            const result = await get('/practice-test');

            expect(fetchMock).toHaveBeenCalledWith(`${BASE_URL}/practice-test`, { method: 'GET', headers: {}, body: undefined });
            expect(result).toEqual({ id: 'test-1' });
        });

        it('attaches the access token when auth is requested', async () => {
            await get('/practice-test', { auth: true });

            expect(requestInit().headers).toEqual({ Authorization: 'Bearer access-token' });
        });
    });

    describe('post', () => {
        it('sends an authenticated request with a JSON body', async () => {
            await post('/practice-test', { body: { title: 'A test' } });

            expect(requestInit()).toEqual({
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer access-token' },
                body: JSON.stringify({ title: 'A test' }),
            });
        });

        it('leaves out the access token when auth is turned off', async () => {
            await post('/auth/login', { body: { email: 'pencho@test.com' }, auth: false });

            expect(requestInit().headers).toEqual({ 'Content-Type': 'application/json' });
        });

        it('leaves out the content type when there is no body', async () => {
            await post('/test-attempt/attempt-1/submit');

            expect(requestInit().headers).toEqual({ Authorization: 'Bearer access-token' });
            expect(requestInit().body).toBeUndefined();
        });
    });

    describe('put', () => {
        it('sends an authenticated PUT request', async () => {
            await put('/study-plan', { body: { goalScore: 1200 } });

            expect(requestInit()).toMatchObject({ method: 'PUT', headers: { Authorization: 'Bearer access-token' } });
        });
    });

    describe('patch', () => {
        it('sends an authenticated PATCH request', async () => {
            await patch('/lessons/lesson-1', { body: { title: 'A lesson' } });

            expect(requestInit()).toMatchObject({ method: 'PATCH', headers: { Authorization: 'Bearer access-token' } });
        });
    });

    describe('del', () => {
        it('sends an authenticated DELETE request', async () => {
            await del('/lessons/lesson-1');

            expect(requestInit()).toMatchObject({ method: 'DELETE', headers: { Authorization: 'Bearer access-token' } });
        });
    });

    describe('responses', () => {
        it('returns null for an empty body', async () => {
            givenResponse(null, 204);

            await expect(del('/lessons/lesson-1')).resolves.toBeNull();
        });

        it('throws the message sent by the backend', async () => {
            givenResponse(JSON.stringify({ message: 'Invalid credentials.' }), 401);

            await expect(post('/auth/login')).rejects.toThrow('Invalid credentials.');
        });

        it('throws a generic message when the backend sends none', async () => {
            givenResponse(JSON.stringify({}), 500);

            await expect(get('/practice-test')).rejects.toThrow('Something went wrong.');
        });

        it('throws a generic message when an error response has no body', async () => {
            givenResponse(null, 500);

            await expect(get('/practice-test')).rejects.toThrow('Something went wrong.');
        });
    });
});