import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private router = inject(Router);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    console.log('[AuthInterceptor] Intercepting request:', {
      url: request.url,
      method: request.method,
      tokenExists: !!token
    });

    if (token) {
      console.log('[AuthInterceptor] Adding Authorization header with token');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('[AuthInterceptor] Request headers after clone:', request.headers.keys());
    } else {
      console.warn('[AuthInterceptor] NO TOKEN AVAILABLE - Request will be unauthorized');
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('[AuthInterceptor] Error caught:', {
          url: request.url,
          status: error.status,
          statusText: error.statusText,
          authHeaderSent: request.headers.has('Authorization')
        });

        if (error.status === 401) {
          console.log('[AuthInterceptor] 401 Unauthorized - Logging out');
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
