import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminService } from '@core/services/admin.service';
import { DashboardStats, Transaction } from '@core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    RouterModule
  ],
  template: `
    <div class="admin-dashboard-container">
      <div class="welcome-section">
        <h1>Admin Dashboard</h1>
        <p>System overview and management</p>
      </div>

      @if (isLoading) {
        <div class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <mat-grid-list cols="4" rowHeight="120px" gutterSize="1rem">
          <!-- Today's Bookings -->
          <mat-grid-tile>
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">today</mat-icon>
                  <div class="stat-info">
                    <h3>Today</h3>
                    <p class="stat-value">{{ stats.today }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>

          <!-- This Week -->
          <mat-grid-tile>
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">week</mat-icon>
                  <div class="stat-info">
                    <h3>This Week</h3>
                    <p class="stat-value">{{ stats.week }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>

          <!-- This Month -->
          <mat-grid-tile>
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">calendar_today</mat-icon>
                  <div class="stat-info">
                    <h3>This Month</h3>
                    <p class="stat-value">{{ stats.month }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>

          <!-- Total -->
          <mat-grid-tile>
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">assessment</mat-icon>
                  <div class="stat-info">
                    <h3>Total</h3>
                    <p class="stat-value">{{ stats.total }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>

        <div class="management-section">
          <div class="section-card">
            <h2>Quick Management</h2>
            <div class="action-buttons">
              <button mat-raised-button color="primary" routerLink="/admin/users">
                <mat-icon>people</mat-icon>
                Manage Users
              </button>
              <button mat-raised-button color="accent" routerLink="/admin/transactions">
                <mat-icon>history</mat-icon>
                View Transactions
              </button>
              <button mat-stroked-button routerLink="/admin/reports">
                <mat-icon>assessment</mat-icon>
                View Reports
              </button>
            </div>
          </div>

          <div class="section-card">
            <h2>Recent Transactions</h2>
            @if (recentTransactions.length > 0) {
              <table mat-table [dataSource]="recentTransactions" class="transactions-table">
                <!-- User Column -->
                <ng-container matColumnDef="userName">
                  <th mat-header-cell *matHeaderCellDef>User</th>
                  <td mat-cell *matCellDef="let element">{{ element.userName }}</td>
                </ng-container>

                <!-- Action Column -->
                <ng-container matColumnDef="action">
                  <th mat-header-cell *matHeaderCellDef>Action</th>
                  <td mat-cell *matCellDef="let element">
                    <mat-chip>{{ element.action }}</mat-chip>
                  </td>
                </ng-container>

                <!-- Timestamp Column -->
                <ng-container matColumnDef="timestamp">
                  <th mat-header-cell *matHeaderCellDef>Time</th>
                  <td mat-cell *matCellDef="let element">
                    {{ element.timestamp | date: 'short' }}
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            } @else {
              <p>No transactions yet</p>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 2rem;

      h1 {
        margin: 0;
        font-size: 2rem;
        color: #333;
      }

      p {
        margin: 0.5rem 0 0 0;
        color: #666;
      }
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }

    mat-grid-list {
      margin-bottom: 2rem;
    }

    .stat-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;

      mat-card-content {
        padding: 1rem;
      }
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .stat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .stat-info {
      width: 100%;

      h3 {
        margin: 0;
        font-size: 0.75rem;
        font-weight: 500;
        opacity: 0.9;
      }

      .stat-value {
        margin: 0.25rem 0 0 0;
        font-size: 1.5rem;
        font-weight: bold;
      }
    }

    .management-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
    }

    .section-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);

      h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.25rem;
      }
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      button {
        justify-content: flex-start;

        mat-icon {
          margin-right: 0.5rem;
        }
      }
    }

    .transactions-table {
      width: 100%;
      margin-top: 1rem;
    }

    @media (max-width: 1024px) {
      .management-section {
        grid-template-columns: 1fr;
      }

      mat-grid-list {
        cols: 2 !important;
      }
    }

    @media (max-width: 600px) {
      .welcome-section h1 {
        font-size: 1.5rem;
      }

      mat-grid-list {
        cols: 1 !important;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  stats: DashboardStats = {
    today: 0,
    week: 0,
    month: 0,
    total: 0,
    timestamp: new Date()
  };

  recentTransactions: Transaction[] = [];
  displayedColumns = ['userName', 'action', 'timestamp'];

  ngOnInit(): void {
    // Delay dashboard data loading to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => this.loadDashboardData(), 0);
  }

  private loadDashboardData(): void {
    forkJoin({
      stats: this.adminService.getDashboardStats(),
      transactions: this.adminService.getTransactions(1, 10)
    }).subscribe({
      next: (result) => {
        this.stats = result.stats;
        this.recentTransactions = result.transactions.data.slice(0, 5);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('[AdminDashboard] Error loading data:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
