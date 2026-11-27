import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';
import { API_URL } from './config';

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  register(body: { name: string; email: string; password: string }) {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/register`, body)
      .pipe(tap((res) => this.save(res)));
  }

  login(body: { email: string; password: string }) {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, body)
      .pipe(tap((res) => this.save(res)));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getName(): string {
    return localStorage.getItem('name') ?? '';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private save(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('name', res.name);
  }
}