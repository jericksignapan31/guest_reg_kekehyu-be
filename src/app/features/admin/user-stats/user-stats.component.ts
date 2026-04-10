import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { AdminService } from '@core/services/admin.service';
import { ToastService } from '@shared/services/toast.service';
import { UserStatistics } from '@core/models';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatDividerModule,
    MatTableModule
  ],
  template: `
    <div class="stats-container">
      <div class="header">
        <button mat-icon-button routerLink="/admin/users">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>User Statistics</h1>
      </div>

      @if (isLoading) {
        <div class="loading">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (userStats) {
        <mat-grid-list cols="3" rowHeight="120px" gutterSize="1rem">
          <!-- Total Registrations -->
          <mat-grid-tile>
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">person_add</mat-icon>
                  <div class="stat-info">
                    <h3>Total Registrations</h3>
                    <p class="stat-value">{{ userStats.registrations }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>

          <!-- Total Transactions -->
          <mat-grid-tile>
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">history</mat-icon>
                  <div class="stat-info">
                    <h3>Total Transactions</h3>
                    <p class="stat-value">{{ userStats.transactions }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>

          <!-- Last Login -->
          <mat-grid-tile>
            <mat-card class="stat-card">
              <mat-card-content>
                <div class="stat-content">
                  <mat-icon class="stat-icon">login</mat-icon>
                  <div class="stat-info">
                    <h3>Last Login</h3>
                    <p class="stat-value">{{ userStats.lastLogin | date: 'short' }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>

        <!-- Recent Activity -->
        <mat-card class="activity-card">
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (userStats.recentActivity.length > 0) {
              <table mat-table [dataSource]="userStats.recentActivity" class="activity-table">
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

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            } @else {
              <p>No recent activity</p>
            }
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .stats-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
        font-size: 1.75rem;
      }
    }

    .loading {
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
        padding: 1.5rem;
      }
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .stat-info {
      h3 {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 500;
        opacity: 0.9;
      }

      .stat-value {
        margin: 0.5rem 0 0 0;
        font-size: 1.5rem;
        font-weight: bold;
      }
    }

    .activity-card {
      margin-top: 2rem;
    }

    .activity-table {
      width: 100%;
    }

    @media (max-width: 800px) {
      mat-grid-list {
        cols: 1 !important;
      }
    }
  `]
})
export class UserStatsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);

  userStats: UserStatistics | null = null;
  isLoading = true;
  displayedColumns = ['action', 'details', 'timestamp'];

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUserStats(userId);
    }
  }

  private loadUserStats(userId: string): void {
    this.adminService.getUserStatistics(userId).subscribe({
      next: (data) => {
        this.userStats = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('Failed to load user statistics');
      }
    });
  }
}
