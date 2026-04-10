import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="reports-container">
      <div class="header">
        <h1>System Reports</h1>
        <p>Generate and view various system reports</p>
      </div>

      <div class="reports-grid">
        <!-- Daily Report -->
        <mat-card class="report-card">
          <mat-card-header>
            <mat-card-title>Daily Summary Report</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>View today's registration and transaction summary.</p>
            <button mat-raised-button color="primary">
              <mat-icon>assessment</mat-icon>
              Generate Daily Report
            </button>
          </mat-card-content>
        </mat-card>

        <!-- Weekly Report -->
        <mat-card class="report-card">
          <mat-card-header>
            <mat-card-title>Weekly Summary Report</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>View this week's registration and transaction summary.</p>
            <button mat-raised-button color="primary">
              <mat-icon>calendar_today</mat-icon>
              Generate Weekly Report
            </button>
          </mat-card-content>
        </mat-card>

        <!-- Monthly Report -->
        <mat-card class="report-card">
          <mat-card-header>
            <mat-card-title>Monthly Summary Report</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>View this month's registration and transaction summary.</p>
            <button mat-raised-button color="primary">
              <mat-icon>date_range</mat-icon>
              Generate Monthly Report
            </button>
          </mat-card-content>
        </mat-card>

        <!-- User Activity Report -->
        <mat-card class="report-card">
          <mat-card-header>
            <mat-card-title>User Activity Report</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>View detailed user activity and transactions.</p>
            <button mat-raised-button color="primary">
              <mat-icon>people</mat-icon>
              Generate User Report
            </button>
          </mat-card-content>
        </mat-card>

        <!-- Custom Date Range -->
        <mat-card class="report-card">
          <mat-card-header>
            <mat-card-title>Custom Date Range Report</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="customReportForm">
              <mat-form-field class="full-width">
                <mat-label>Start Date</mat-label>
                <input matInput [matDatepicker]="startDatePicker" formControlName="startDate" />
                <mat-datepicker-toggle matIconSuffix [for]="startDatePicker"></mat-datepicker-toggle>
                <mat-datepicker #startDatePicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field class="full-width">
                <mat-label>End Date</mat-label>
                <input matInput [matDatepicker]="endDatePicker" formControlName="endDate" />
                <mat-datepicker-toggle matIconSuffix [for]="endDatePicker"></mat-datepicker-toggle>
                <mat-datepicker #endDatePicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field class="full-width">
                <mat-label>Report Type</mat-label>
                <mat-select formControlName="reportType">
                  <mat-option value="registrations">Registrations</mat-option>
                  <mat-option value="transactions">Transactions</mat-option>
                  <mat-option value="users">User Activity</mat-option>
                </mat-select>
              </mat-form-field>

              <button mat-raised-button color="primary">
                <mat-icon>assessment</mat-icon>
                Generate Report
              </button>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Export Options -->
        <mat-card class="report-card">
          <mat-card-header>
            <mat-card-title>Export Options</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Export reports in your preferred format.</p>
            <div class="export-buttons">
              <button mat-stroked-button>
                <mat-icon>download</mat-icon>
                Export as PDF
              </button>
              <button mat-stroked-button>
                <mat-icon>download</mat-icon>
                Export as Excel
              </button>
              <button mat-stroked-button>
                <mat-icon>download</mat-icon>
                Export as CSV
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
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

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .report-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      mat-card-header {
        padding: 1rem !important;
        border-bottom: 1px solid #eee;
      }

      mat-card-content {
        padding: 1rem !important;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }

      button {
        align-self: flex-start;
      }
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .export-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      button {
        width: 100%;
        justify-content: flex-start;
      }
    }

    @media (max-width: 600px) {
      .reports-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportsComponent {
  private fb = inject(FormBuilder);
  customReportForm: FormGroup;

  constructor() {
    this.customReportForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      reportType: ['registrations']
    });
  }
}
