import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@app/../environments/environment';
import {
  RegisterReservationRequest,
  ReservationResponse,
  Reservation,
  ReservationStats
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/reservations`;

  registerReservation(data: RegisterReservationRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(`${this.API_URL}/register`, data);
  }

  getMyBookings(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.API_URL}/my-bookings`);
  }

  getReservationById(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.API_URL}/${id}`);
  }

  getStatsToday(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.API_URL}/stats/today`);
  }

  getStatsWeek(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.API_URL}/stats/week`);
  }

  getStatsMonth(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.API_URL}/stats/month`);
  }

  getStats(): Observable<ReservationStats> {
    return this.http.get<ReservationStats>(`${this.API_URL}/stats`);
  }

  updateReservation(id: string, data: Partial<RegisterReservationRequest>): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.API_URL}/${id}`, data);
  }

  deleteReservation(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }
}
