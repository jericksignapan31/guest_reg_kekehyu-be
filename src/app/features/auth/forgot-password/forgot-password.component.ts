import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatStepperModule,
    RouterModule
  ],
  template: `
    <div class="forgot-password-container">
      <mat-card class="forgot-password-card">
        <mat-card-header>
          <mat-card-title>Password Reset</mat-card-title>
          <mat-card-subtitle>Kekehyu Hotel - Guest Registration System</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-stepper [linear]="true" #stepper>
            <!-- Step 1: Request Reset -->
            <mat-step [stepControl]="requestForm" [editable]="!isLoading">
              <ng-template matStepLabel>Email Verification</ng-template>

              <form [formGroup]="requestForm">
                <p>Enter your email address and we'll send you a password reset link.</p>

                <mat-form-field class="full-width">
                  <mat-label>Email Address</mat-label>
                  <input matInput type="email" formControlName="email" required />
                  @if (requestForm.get('email')?.invalid && requestForm.get('email')?.touched) {
                    <mat-error>
                      @if (requestForm.get('email')?.hasError('required')) {
                        Email is required
                      }
                      @if (requestForm.get('email')?.hasError('email')) {
                        Please enter a valid email
                      }
                    </mat-error>
                  }
                </mat-form-field>

                @if (requestErrorMessage) {
                  <div class="error-message">{{ requestErrorMessage }}</div>
                }

                @if (requestSuccessMessage) {
                  <div class="success-message">{{ requestSuccessMessage }}</div>
                }

                <div class="step-actions">
                  <button 
                    mat-raised-button 
                    color="primary" 
                    matStepperNext
                    [disabled]="requestForm.invalid || isLoading"
                  >
                    @if (isLoading) {
                      <mat-spinner diameter="20"></mat-spinner>
                      Sending...
                    } @else {
                      Send Reset Link
                    }
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Step 2: Reset Password -->
            <mat-step [stepControl]="resetForm" [editable]="!isLoading">
              <ng-template matStepLabel>Set New Password</ng-template>

              <form [formGroup]="resetForm">
                <p>Enter the reset code from your email and set a new password.</p>

                <mat-form-field class="full-width">
                  <mat-label>Reset Token</mat-label>
                  <input matInput formControlName="resetToken" required />
                  @if (resetForm.get('resetToken')?.invalid && resetForm.get('resetToken')?.touched) {
                    <mat-error>Reset token is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-label>New Password</mat-label>
                  <input matInput type="password" formControlName="newPassword" required />
                  @if (resetForm.get('newPassword')?.invalid && resetForm.get('newPassword')?.touched) {
                    <mat-error>Password must be at least 8 characters</mat-error>
                  }
                </mat-form-field>

                <mat-form-field class="full-width">
                  <mat-label>Confirm Password</mat-label>
                  <input matInput type="password" formControlName="confirmPassword" required />
                  @if (resetForm.get('confirmPassword')?.invalid && resetForm.get('confirmPassword')?.touched) {
                    <mat-error>Please confirm your password</mat-error>
                  }
                </mat-form-field>

                @if (resetForm.hasError('passwordMismatch') && resetForm.get('confirmPassword')?.touched) {
                  <mat-error class="error-message">Passwords do not match</mat-error>
                }

                @if (resetErrorMessage) {
                  <div class="error-message">{{ resetErrorMessage }}</div>
                }

                @if (resetSuccessMessage) {
                  <div class="success-message">{{ resetSuccessMessage }}</div>
                }

                <div class="step-actions">
                  <button 
                    mat-stroked-button 
                    matStepperPrevious
                    [disabled]="isLoading"
                  >
                    Back
                  </button>

                  <button 
                    mat-raised-button 
                    color="primary"
                    (click)="submitPasswordReset()"
                    [disabled]="resetForm.invalid || isLoading"
                  >
                    @if (isLoading) {
                      <mat-spinner diameter="20"></mat-spinner>
                      Resetting...
                    } @else {
                      Reset Password
                    }
                  </button>
                </div>
              </form>
            </mat-step>
          </mat-stepper>

          <div class="footer-links">
            <a routerLink="/auth/login">Back to Login</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .forgot-password-card {
      width: 100%;
      max-width: 500px;
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
      margin-top: 1rem;
    }

    .full-width {
      width: 100%;
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

    .step-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .step-actions button {
      flex: 1;
    }

    .footer-links {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;

      a {
        color: #667eea;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class ForgotPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  requestForm!: FormGroup;
  resetForm!: FormGroup;
  isLoading = false;
  requestErrorMessage = '';
  requestSuccessMessage = '';
  resetErrorMessage = '';
  resetSuccessMessage = '';

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group(
      {
        resetToken: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  submitPasswordReset(): void {
    if (this.resetForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.resetErrorMessage = '';

    const { resetToken, newPassword } = this.resetForm.value;

    this.authService.resetPassword({ resetToken, newPassword }).subscribe({
      next: () => {
        this.isLoading = false;
        this.resetSuccessMessage = 'Password reset successfully! Redirecting to login...';
        this.toastService.success('Password reset successfully!');
        
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.resetErrorMessage = error.error?.message || 'Failed to reset password. Please try again.';
        this.toastService.error(this.resetErrorMessage);
      }
    });
  }

  passwordMatchValidator(control: any) {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
