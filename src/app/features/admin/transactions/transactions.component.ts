import { Component, OnInit, inject } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from '@core/services/admin.service';
import { ToastService } from '@shared/services/toast.service';
import { Transaction } from '@core/models';

@Component({
  selector: 'app-transactions',
  standalone: true,
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
    MatSelectModule
  ],
  template: `
    <div class="transactions-container">
      <div class="header">
        <h1>Transaction History</h1>
        <p>View all system transactions and user activities</p>
      </div>

      <div class="filters">
        <mat-form-field>
          <mat-label>Search by user or reservation</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup)="onSearchChange()" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Filter by Action</mat-label>
          <mat-select [(ngModel)]="actionFilter" (selectionChange)="onFilterChange()">
            <mat-option value="">All Actions</mat-option>
            <mat-option value="GUEST_REGISTERED">Guest Registered</mat-option>
            <mat-option value="PAYMENT_PROCESSED">Payment Processed</mat-option>
            <mat-option value="USER_LOGIN">User Login</mat-option>
            <mat-option value="USER_LOGOUT">User Logout</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      @if (isLoading) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <mat-card class="table-card">
          <table mat-table [dataSource]="filteredTransactions" class="transactions-table">
            <!-- User -->
            <ng-container matColumnDef="userName">
              <th mat-header-cell *matHeaderCellDef>User</th>
              <td mat-cell *matCellDef="let element">{{ element.userName }}</td>
            </ng-container>

            <!-- Action -->
            <ng-container matColumnDef="action">
              <th mat-header-cell *matHeaderCellDef>Action</th>
              <td mat-cell *matCellDef="let element">{{ element.action }}</td>
            </ng-container>

            <!-- Details -->
            <ng-container matColumnDef="details">
              <th mat-header-cell *matHeaderCellDef>Details</th>
              <td mat-cell *matCellDef="let element">{{ element.details }}</td>
            </ng-container>

            <!-- Timestamp -->
            <ng-container matColumnDef="timestamp">
              <th mat-header-cell *matHeaderCellDef>Timestamp</th>
              <td mat-cell *matCellDef="let element">
                {{ element.timestamp | date: 'short' }}
              </td>
            </ng-container>

            <!-- Reservation # -->
            <ng-container matColumnDef="reservationNumber">
              <th mat-header-cell *matHeaderCellDef>Reservation #</th>
              <td mat-cell *matCellDef="let element">
                {{ element.reservationNumber || 'N/A' }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="data-row"></tr>
          </table>

          <mat-paginator
            [length]="transactions.length"
            [pageSize]="pageSize"
            [pageSizeOptions]="pageSizeOptions"
            (page)="onPageChange($event)"
          ></mat-paginator>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .transactions-container {
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

    .transactions-table {
      width: 100%;
    }

    .data-row:hover {
      background-color: #f5f5f5;
    }

    @media (max-width: 1000px) {
      .transactions-table {
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
export class TransactionsComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  displayedColumns = ['userName', 'action', 'details', 'timestamp', 'reservationNumber'];

  isLoading = true;
  searchTerm = '';
  actionFilter = '';
  pageSize = 25;
  pageSizeOptions = [10, 25, 50, 100];

  ngOnInit(): void {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    this.adminService.getTransactions(1, 500).subscribe({
      next: (data) => {
        this.transactions = data.data;
        this.filteredTransactions = data.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load transactions');
      }
    });
  }

  onSearchChange(): void {
    this.filterTransactions();
  }

  onFilterChange(): void {
    this.filterTransactions();
  }

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.filteredTransactions = this.transactions.slice(startIndex, endIndex);
  }

  private filterTransactions(): void {
    let filtered = this.transactions;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.userName.toLowerCase().includes(term) ||
          t.reservationNumber?.toLowerCase().includes(term)
      );
    }

    if (this.actionFilter) {
      filtered = filtered.filter((t) => t.action === this.actionFilter);
    }

    this.filteredTransactions = filtered;
  }
}
