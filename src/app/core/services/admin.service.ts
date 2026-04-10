import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/../environments/environment';
import {
  DashboardStats,
  Transaction,
  TransactionResponse,
  FrontDeskUser,
  UserStatistics
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin`;

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/dashboard/stats`);
  }

  getTransactions(page: number = 1, limit: number = 50): Observable<TransactionResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<TransactionResponse>(`${this.API_URL}/transactions`, { params });
  }

  getTransactionsByUser(userId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.API_URL}/transactions/user/${userId}`);
  }

  getFrontDeskUsers(): Observable<FrontDeskUser[]> {
    return this.http.get<FrontDeskUser[]>(`${this.API_URL}/frontdesk/users`);
  }

  getUserStatistics(userId: string): Observable<UserStatistics> {
    return this.http.get<UserStatistics>(`${this.API_URL}/users/${userId}/stats`);
  }

  lockUser(userId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/users/${userId}/lock`, {});
  }

  unlockUser(userId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/users/${userId}/unlock`, {});
  }

  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/users/${userId}`);
  }

  updateUser(userId: string, data: Partial<FrontDeskUser>): Observable<FrontDeskUser> {
    return this.http.put<FrontDeskUser>(`${this.API_URL}/users/${userId}`, data);
  }
}
