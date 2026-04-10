import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '@app/../environments/environment';
import {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthState,
  UserInfo,
  TokenRefreshResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  PasswordResetConfirm
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly API_URL = `${environment.apiUrl}/auth`;

  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAuthState();
    }
  }

  login(credentials: AuthLoginRequest): Observable<AuthLoginResponse> {
    return this.http.post<AuthLoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => this.setAuthState(response))
      );
  }

  register(data: AuthRegisterRequest): Observable<AuthRegisterResponse> {
    return this.http.post<AuthRegisterResponse>(`${this.API_URL}/register`, data);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
    }
    this.authStateSubject.next({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false
    });
  }

  refresh(refreshToken: string): Observable<TokenRefreshResponse> {
    return this.http.post<TokenRefreshResponse>(`${this.API_URL}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('accessToken', response.accessToken);
          }
          const currentState = this.authStateSubject.getValue();
          this.authStateSubject.next({
            ...currentState,
            accessToken: response.accessToken
          });
        })
      );
  }

  requestPasswordReset(email: string): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(`${this.API_URL}/password-reset/request`, { email });
  }

  resetPassword(data: PasswordResetConfirm): Observable<PasswordResetResponse> {
    return this.http.post<PasswordResetResponse>(`${this.API_URL}/password-reset`, data);
  }

  getProfile(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.API_URL}/profile`);
  }

  updateProfile(data: Partial<UserInfo>): Observable<UserInfo> {
    return this.http.put<UserInfo>(`${this.API_URL}/profile`, data);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  getAccessToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('refreshToken');
  }

  getUserRole(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('userRole');
  }

  private setAuthState(response: AuthLoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userRole', response.user.role);
    }

    this.authStateSubject.next({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      isAuthenticated: true
    });
  }

  private loadAuthState(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      this.authStateSubject.next({
        user: null,
        accessToken,
        refreshToken,
        isAuthenticated: true
      });
    }
  }
}
