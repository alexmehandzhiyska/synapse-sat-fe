import type { CreateNotebookEntryData, NotebookEntry, UpdateNotebookEntryData } from '../types/notebook';
import { del, get, patch, post } from './requester';

const getAll = (): Promise<NotebookEntry[]> =>
    get<NotebookEntry[]>('/notebook', { auth: true });

const create = (data: CreateNotebookEntryData): Promise<NotebookEntry> =>
    post<NotebookEntry>('/notebook', { body: data });

const update = (id: string, data: UpdateNotebookEntryData): Promise<NotebookEntry> =>
    patch<NotebookEntry>(`/notebook/${id}`, { body: data });

const remove = (id: string): Promise<void> =>
    del<void>(`/notebook/${id}`);

const notebookService = { getAll, create, update, remove };

export default notebookService;