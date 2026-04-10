import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FrontDeskUser } from '@core/models';
import { AdminService } from '@core/services/admin.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Edit User Account</h2>
    
    <mat-dialog-content>
      <form [formGroup]="form" class="edit-form">
        <mat-form-field>
          <mat-label>First Name</mat-label>
          <input matInput formControlName="firstName" />
          @if (form.get('firstName')?.hasError('required')) {
            <mat-error>First name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="lastName" />
          @if (form.get('lastName')?.hasError('required')) {
            <mat-error>Last name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" [disabled]="true" />
          <mat-hint>Email cannot be changed</mat-hint>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Contact Number</mat-label>
          <input matInput formControlName="contactNumber" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="FRONTDESK">Front Desk Staff</mat-option>
            <mat-option value="ADMIN">Administrator</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="active">Active</mat-option>
            <mat-option value="inactive">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      </form>

      <div class="info-section">
        <h3>Account Information</h3>
        <p><strong>User ID:</strong> {{ data.id }}</p>
        <p><strong>Created:</strong> {{ data.createdAt | date: 'medium' }}</p>
        <p><strong>Last Updated:</strong> {{ data.updatedAt | date: 'medium' }}</p>
        <p><strong>Last Login:</strong> {{ data.lastLogin | date: 'medium' }}</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="onSave()"
        [disabled]="!form.valid || isSaving"
      >
        @if (isSaving) {
          <span class="save-loading">Saving...</span>
        } @else {
          <ng-container>
            <mat-icon>save</mat-icon>
            <span>Save Changes</span>
          </ng-container>
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
      padding: 2rem;
    }

    .edit-form {
      display: grid;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    mat-form-field {
      width: 100%;
    }

    .info-section {
      background-color: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;

      h3 {
        margin: 0 0 1rem 0;
        font-size: 0.95rem;
        color: #333;
      }

      p {
        margin: 0.5rem 0;
        font-size: 0.875rem;
        color: #666;
      }

      strong {
        color: #333;
      }
    }

    mat-dialog-actions {
      padding: 1rem 2rem;
      gap: 0.5rem;
    }

    .save-loading {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: auto;
        width: 100vw;
      }
    }
  `]
})
export class EditUserDialogComponent implements OnInit {
  form: FormGroup;
  isSaving = false;

  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: FrontDeskUser) {
    this.form = this.fb.group({
      firstName: [data.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [data.lastName, [Validators.required, Validators.minLength(2)]],
      email: [{ value: data.email, disabled: true }],
      contactNumber: [data.contactNumber || ''],
      role: [data.role || 'FRONTDESK', Validators.required],
      status: [data.status, Validators.required]
    });
  }

  ngOnInit(): void {
    // Form is initialized in constructor
  }

  onSave(): void {
    if (!this.form.valid) {
      this.toastService.error('Please fix the errors in the form');
      return;
    }

    this.isSaving = true;
    const formData = this.form.getRawValue();
    
    this.adminService.updateUser(this.data.id, formData).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.success('User updated successfully');
        window.location.reload(); // Refresh to show updated data
      },
      error: (error) => {
        this.isSaving = false;
        this.toastService.error(error?.error?.message || 'Failed to update user');
      }
    });
  }
}
