import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from './config';

export type Status = 'APPLIED' | 'OA' | 'INTERVIEW' | 'OFFER' | 'REJECTED';

export const STATUSES: { value: Status; label: string }[] = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'OA', label: 'Online Assessment' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'REJECTED', label: 'Rejected' },
];

export interface Application {
  id: number;
  company: string;
  role: string;
  status: Status;
  appliedDate: string | null;
  source: string | null;
  notes: string | null;
}

export type ApplicationRequest = Omit<Application, 'id'>;

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private http = inject(HttpClient);
  private url = `${API_URL}/applications`;

  getAll() {
    return this.http.get<Application[]>(this.url);
  }

  create(body: ApplicationRequest) {
    return this.http.post<Application>(this.url, body);
  }

  update(id: number, body: ApplicationRequest) {
    return this.http.put<Application>(`${this.url}/${id}`, body);
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}