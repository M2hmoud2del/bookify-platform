import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const token = tokenService.getToken();
  const apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  const isBackendApiRequest = apiBaseUrl ? req.url.startsWith(apiBaseUrl) : req.url.startsWith('/');

  const authReq =
    token && isBackendApiRequest
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error?.status === 401 && isBackendApiRequest) {
        tokenService.clearToken();
        window.dispatchEvent(new CustomEvent('bookify:auth:unauthorized'));
        router.navigate(['/login']);
      } else if (
        error?.status === 404 &&
        error?.error?.message &&
        error.error.message.includes('Provider profile not found')
      ) {
        if (!router.url.includes('/provider/profile')) {
          router.navigate(['/provider/profile']);
        }
      }

      return throwError(() => error);
    })
  );
};
