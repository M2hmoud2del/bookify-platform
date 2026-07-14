import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiError } from './api-error.model';
import { ApiResponse } from './api-response.model';

type QueryValue = string | number | boolean | ReadonlyArray<string | number | boolean>;

export interface ApiOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, QueryValue>;
  context?: HttpContext;
  withCredentials?: boolean;
  body?: unknown;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  get<T>(path: string, options?: ApiOptions): Observable<ApiResponse<T>> {
    return this.http
      .get<ApiResponse<T>>(this.buildUrl(path), options)
      .pipe(catchError((error) => throwError(() => this.normalizeError(error))));
  }

  post<T>(path: string, body?: unknown, options?: ApiOptions): Observable<ApiResponse<T>> {
    return this.http
      .post<ApiResponse<T>>(this.buildUrl(path), body, options)
      .pipe(catchError((error) => throwError(() => this.normalizeError(error))));
  }

  put<T>(path: string, body?: unknown, options?: ApiOptions): Observable<ApiResponse<T>> {
    return this.http
      .put<ApiResponse<T>>(this.buildUrl(path), body, options)
      .pipe(catchError((error) => throwError(() => this.normalizeError(error))));
  }

  patch<T>(path: string, body?: unknown, options?: ApiOptions): Observable<ApiResponse<T>> {
    return this.http
      .patch<ApiResponse<T>>(this.buildUrl(path), body, options)
      .pipe(catchError((error) => throwError(() => this.normalizeError(error))));
  }

  delete<T>(path: string, options?: ApiOptions): Observable<ApiResponse<T>> {
    return this.http
      .delete<ApiResponse<T>>(this.buildUrl(path), options)
      .pipe(catchError((error) => throwError(() => this.normalizeError(error))));
  }

  private buildUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.apiBaseUrl}${normalizedPath}`;
  }

  private normalizeError(error: {
    status?: number;
    message?: string;
    error?: { message?: string; errors?: unknown; details?: unknown };
  }): ApiError {
    return {
      message: error?.error?.message || error?.message || 'Something went wrong',
      statusCode: error?.status,
      errors: error?.error?.errors,
      details: error?.error?.details,
    };
  }
}
