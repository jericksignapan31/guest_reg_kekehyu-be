import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '@core/services/admin.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-create-user-dialog',
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
    <h2 mat-dialog-title>Create New User Account</h2>
    
    <mat-dialog-content>
      <form [formGroup]="form" class="create-form">
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
          <mat-label>Email Address</mat-label>
          <input matInput formControlName="email" type="email" />
          @if (form.get('email')?.hasError('required')) {
            <mat-error>Email is required</mat-error>
          }
          @if (form.get('email')?.hasError('email')) {
            <mat-error>Invalid email format</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" />
          @if (form.get('password')?.hasError('required')) {
            <mat-error>Password is required</mat-error>
          }
          @if (form.get('password')?.hasError('minlength')) {
            <mat-error>Password must be at least 6 characters</mat-error>
          }
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
          @if (form.get('role')?.hasError('required')) {
            <mat-error>Role is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="active">Active</mat-option>
            <mat-option value="inactive">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
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
          <span class="save-loading">Creating...</span>
        } @else {
          <ng-container>
            <mat-icon>person_add</mat-icon>
            <span>Create User</span>
          </ng-container>
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 400px;
      padding: 1rem 0;
    }

    mat-form-field {
      width: 100%;
    }

    mat-dialog-actions {
      padding-top: 1rem;
      gap: 0.5rem;
    }

    .save-loading {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    :host ::ng-deep .mat-mdc-form-field {
      width: 100%;
    }
  `]
})
export class CreateUserDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);
  private dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);

  form!: FormGroup;
  isSaving = false;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      contactNumber: [''],
      role: ['FRONTDESK', [Validators.required]],
      status: ['active', [Validators.required]]
    });
  }

  onSave(): void {
    if (!this.form.valid) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    this.isSaving = true;
    const formData = this.form.value;

    const createUserData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      contactNumber: formData.contactNumber || '',
      role: formData.role,
      status: formData.status
    };

    this.adminService.createUser(createUserData).subscribe({
      next: (response) => {
        this.isSaving = false;
        this.toastService.success('User created successfully!');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error creating user:', error);
        this.toastService.error(error?.error?.message || 'Failed to create user');
      }
    });
  }
}
