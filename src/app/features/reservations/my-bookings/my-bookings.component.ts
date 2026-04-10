import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { ReservationService } from '@core/services/reservation.service';
import { ToastService } from '@shared/services/toast.service';
import { Reservation } from '@core/models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterModule
  ],
  template: `
    <div class="bookings-container">
      <div class="header">
        <h1>My Bookings</h1>
        <p>View and manage all your guest registrations</p>
      </div>

      <div class="filters">
        <mat-form-field>
          <mat-label>Search by Name or Reservation #</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="onSearchChange()" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Filter by Status</mat-label>
          <mat-select [(ngModel)]="statusFilter" (selectionChange)="onFilterChange()">
            <mat-option value="">All</mat-option>
            <mat-option value="completed">Completed</mat-option>
            <mat-option value="ongoing">Ongoing</mat-option>
            <mat-option value="upcoming">Upcoming</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      @if (isLoading) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        @if (filteredReservations.length > 0) {
          <mat-card class="table-card">
            <table mat-table [dataSource]="filteredReservations" class="bookings-table">
              <!-- Reservation Number -->
              <ng-container matColumnDef="reservationNumber">
                <th mat-header-cell *matHeaderCellDef>Reservation #</th>
                <td mat-cell *matCellDef="let element">{{ element.reservationNumber }}</td>
              </ng-container>

              <!-- Guest Name -->
              <ng-container matColumnDef="guestName">
                <th mat-header-cell *matHeaderCellDef>Guest Name</th>
                <td mat-cell *matCellDef="let element">
                  {{ element.guest.firstName }} {{ element.guest.lastName }}
                </td>
              </ng-container>

              <!-- Check-in Date -->
              <ng-container matColumnDef="checkInDate">
                <th mat-header-cell *matHeaderCellDef>Check-in</th>
                <td mat-cell *matCellDef="let element">
                  {{ element.checkInDate | date: 'MMM dd, yyyy' }}
                </td>
              </ng-container>

              <!-- Check-out Date -->
              <ng-container matColumnDef="checkOutDate">
                <th mat-header-cell *matHeaderCellDef>Check-out</th>
                <td mat-cell *matCellDef="let element">
                  {{ element.checkOutDate | date: 'MMM dd, yyyy' }}
                </td>
              </ng-container>

              <!-- Rooms -->
              <ng-container matColumnDef="rooms">
                <th mat-header-cell *matHeaderCellDef>Rooms</th>
                <td mat-cell *matCellDef="let element">
                  {{ element.rooms.length }}
                </td>
              </ng-container>

              <!-- Status -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let element">
                  <span class="status" [ngClass]="element.status">
                    {{ element.status | uppercase }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let element">
                  <button mat-icon-button [routerLink]="['/reservations', element.id]" matTooltip="View">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" matTooltip="Delete" (click)="deleteReservation(element.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="data-row"></tr>
            </table>

            <mat-paginator
              [length]="filteredReservations.length"
              [pageSize]="pageSize"
              [pageSizeOptions]="pageSizeOptions"
              (page)="onPageChange($event)"
            ></mat-paginator>
          </mat-card>
        } @else {
          <mat-card class="empty-state">
            <mat-icon>event_note</mat-icon>
            <h2>No Bookings Found</h2>
            <p>You don't have any guest registrations yet.</p>
            <button mat-raised-button color="primary" routerLink="/reservations/register">
              <mat-icon>person_add</mat-icon>
              Create New Registration
            </button>
          </mat-card>
        }
      }
    </div>
  `,
  styles: [`
    .bookings-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;

      h1 {
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
      }

      p {
        margin: 0;
        color: #666;
      }
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;

      mat-form-field {
        min-width: 250px;
      }
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    .table-card {
      overflow: auto;
    }

    .bookings-table {
      width: 100%;
    }

    .data-row:hover {
      background-color: #f5f5f5;
    }

    .status {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;

      &.completed {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      &.ongoing {
        background-color: #fff3e0;
        color: #f57c00;
      }

      &.upcoming {
        background-color: #e3f2fd;
        color: #1976d2;
      }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;

      mat-icon {
        font-size: 3rem;
        width: 3rem;
        height: 3rem;
        color: #ccc;
        margin-bottom: 1rem;
      }

      h2 {
        margin: 0 0 0.5rem 0;
        color: #666;
      }

      p {
        margin: 0 0 2rem 0;
        color: #999;
      }
    }

    @media (max-width: 1000px) {
      .bookings-table {
        font-size: 0.875rem;
      }

      .filters {
        flex-direction: column;

        mat-form-field {
          width: 100%;
          min-width: unset;
        }
      }
    }
  `]
})
export class MyBookingsComponent implements OnInit {
  private reservationService = inject(ReservationService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  displayedColumns = ['reservationNumber', 'guestName', 'checkInDate', 'checkOutDate', 'rooms', 'status', 'actions'];
  
  isLoading = true;
  searchTerm = '';
  statusFilter = '';
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];

  ngOnInit(): void {
    this.loadReservations();
  }

  private loadReservations(): void {
    this.reservationService.getMyBookings().subscribe({
      next: (data) => {
        this.reservations = data;
        this.filteredReservations = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.isLoading = false;
        this.toastService.error('Failed to load bookings');
        this.cdr.markForCheck();
      }
    });
  }

  onSearchChange(): void {
    this.filterReservations();
  }

  onFilterChange(): void {
    this.filterReservations();
  }

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.filteredReservations = this.reservations.slice(startIndex, endIndex);
  }

  private filterReservations(): void {
    let filtered = this.reservations;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.reservationNumber.toLowerCase().includes(term) ||
          r.guest.firstName.toLowerCase().includes(term) ||
          r.guest.lastName.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter) {
      filtered = filtered.filter((r) => r.status === this.statusFilter);
    }

    this.filteredReservations = filtered;
  }

  deleteReservation(id: string): void {
    if (confirm('Are you sure you want to delete this reservation?')) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          this.toastService.success('Reservation deleted successfully');
          this.loadReservations();
        },
        error: () => {
          this.toastService.error('Failed to delete reservation');
        }
      });
    }
  }
}
