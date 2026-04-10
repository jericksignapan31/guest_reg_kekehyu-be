import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/services/toast.service';
import { UserRole } from '@core/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatProgressBarModule,
    RouterModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create New User Account</mat-card-title>
          <mat-card-subtitle>Kekehyu Hotel - User Registration</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field class="form-field">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" required />
                @if (getControl('firstName')?.invalid && getControl('firstName')?.touched) {
                  <mat-error>First name is required</mat-error>
                }
              </mat-form-field>

              <mat-form-field class="form-field">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" required />
                @if (getControl('lastName')?.invalid && getControl('lastName')?.touched) {
                  <mat-error>Last name is required</mat-error>
                }
              </mat-form-field>
            </div>

            <mat-form-field class="full-width">
              <mat-label>Middle Name (Optional)</mat-label>
              <input matInput formControlName="middleName" />
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Contact Number</mat-label>
              <input matInput formControlName="contactNumber" required />
              @if (getControl('contactNumber')?.invalid && getControl('contactNumber')?.touched) {
                <mat-error>Contact number is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required />
              @if (getControl('email')?.invalid && getControl('email')?.touched) {
                <mat-error>
                  @if (getControl('email')?.hasError('required')) {
                    Email is required
                  }
                  @if (getControl('email')?.hasError('email')) {
                    Please enter a valid email
                  }
                </mat-error>
              }
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role" required>
                <mat-option value="FRONTDESK">Front Desk Staff</mat-option>
                <mat-option value="ADMIN">Admin</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required />
              @if (getControl('password')?.invalid && getControl('password')?.touched) {
                <mat-error>
                  @if (getControl('password')?.hasError('required')) {
                    Password is required
                  }
                  @if (getControl('password')?.hasError('minlength')) {
                    Password must be at least 12 characters
                  }
                  @if (getControl('password')?.hasError('pattern')) {
                    Password must contain uppercase, lowercase, number, and special character
                  }
                </mat-error>
              }
            </mat-form-field>

            @if (getControl('password')?.value) {
              <div class="password-strength">
                <mat-progress-bar 
                  [value]="passwordStrength" 
                  [color]="passwordStrengthColor"
                ></mat-progress-bar>
                <p class="strength-text">Strength: {{ passwordStrengthText }}</p>
              </div>
            }

            <mat-form-field class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput type="password" formControlName="confirmPassword" required />
              @if (getControl('confirmPassword')?.invalid && getControl('confirmPassword')?.touched) {
                <mat-error>
                  @if (getControl('confirmPassword')?.hasError('required')) {
                    Please confirm your password
                  }
                  @if (registerForm.hasError('passwordMismatch')) {
                    Passwords do not match
                  }
                </mat-error>
              }
            </mat-form-field>

            @if (registerForm.hasError('passwordMismatch') && getControl('confirmPassword')?.touched) {
              <mat-error class="full-width">Passwords do not match</mat-error>
            }

            @if (errorMessage) {
              <div class="error-message">{{ errorMessage }}</div>
            }

            @if (successMessage) {
              <div class="success-message">{{ successMessage }}</div>
            }

            <div class="form-actions">
              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="isLoading || registerForm.invalid"
              >
                @if (isLoading) {
                  <mat-spinner diameter="20"></mat-spinner>
                  Creating Account...
                } @else {
                  Create Account
                }
              </button>

              <button 
                mat-stroked-button 
                type="button"
                (click)="resetForm()"
                [disabled]="isLoading"
              >
                Clear
              </button>

              <button 
                mat-stroked-button 
                type="button"
                routerLink="/auth/login"
                [disabled]="isLoading"
              >
                Back to Login
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .register-card {
      width: 100%;
      max-width: 600px;
      padding: 2rem;
    }

    mat-card-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    mat-card-title {
      font-size: 1.5rem;
      margin: 0;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-field {
      width: 100%;
    }

    .full-width {
      width: 100%;
    }

    .password-strength {
      margin-top: -0.5rem;
      margin-bottom: 1rem;
    }

    .strength-text {
      font-size: 0.875rem;
      margin: 0.5rem 0 0 0;
      color: #666;
    }

    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }

    .success-message {
      background-color: #e8f5e9;
      color: #2e7d32;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;

      button {
        flex: 1;
      }
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  passwordStrength = 0;
  passwordStrengthText = '';
  passwordStrengthColor = 'warn';

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        middleName: [''],
        contactNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(12),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]/)
          ]
        ],
        confirmPassword: ['', Validators.required],
        role: ['FRONTDESK', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );

    this.getControl('password')?.valueChanges.subscribe(() => {
      this.updatePasswordStrength();
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  getControl(name: string): AbstractControl | null {
    return this.registerForm.get(name);
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  updatePasswordStrength(): void {
    const password = this.getControl('password')?.value;
    let strength = 0;

    if (password) {
      if (password.length >= 12) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[a-z]/.test(password)) strength += 25;
      if (/\d/.test(password)) strength += 12.5;
      if (/@$!%*?&/.test(password)) strength += 12.5;
    }

    this.passwordStrength = strength;

    if (strength < 40) {
      this.passwordStrengthText = 'Weak';
      this.passwordStrengthColor = 'warn';
    } else if (strength < 70) {
      this.passwordStrengthText = 'Moderate';
      this.passwordStrengthColor = 'accent';
    } else {
      this.passwordStrengthText = 'Strong';
      this.passwordStrengthColor = 'primary';
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.registerForm.value;
    delete formData.confirmPassword;

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = `User ${response.firstName} ${response.lastName} created successfully!`;
        this.toastService.success(this.successMessage);
        this.registerForm.reset();
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 409) {
          this.errorMessage = 'Email already exists';
        } else {
          this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
        }
        this.toastService.error(this.errorMessage);
      }
    });
  }

  resetForm(): void {
    this.registerForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.passwordStrength = 0;
  }
}
