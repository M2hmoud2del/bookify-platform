import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiError } from '../api/api-error.model';
import { ApiService } from '../api/api.service';
import { API_ENDPOINTS } from '../api/endpoints';
import { TokenService } from '../auth/token.service';
import { BackendUser, mapBackendUser } from '../mappers/user.mapper';
import { User, UserRole } from '../models/user.model';

interface AuthData {
  token?: string;
  accessToken?: string;
  access_token?: string;
  user?: BackendUser;
}

type MeData = BackendUser | { user?: BackendUser };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private api = inject(ApiService);
  private tokenService = inject(TokenService);

  user = signal<User | null>(null);
  session = signal<{ access_token: string } | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  isAuthenticated = computed(() => !!this.user() && !!this.session());
  isProvider = computed(() => this.user()?.role === 'provider');
  isCustomer = computed(() => this.user()?.role === 'customer');

  constructor() {
    window.addEventListener('bookify:auth:unauthorized', () => this.clearAuthState());
  }

  async checkSession(): Promise<void> {
    const token = this.tokenService.getToken();

    if (!token) {
      this.clearAuthState();
      return;
    }

    this.session.set({ access_token: token });

    try {
      await this.me();
    } catch (err) {
      console.error('Session check error:', err);
      this.clearAuthState();
    }
  }

  async me(): Promise<User | null> {
    if (!this.tokenService.hasToken()) {
      this.clearAuthState();
      return null;
    }

    const response = await firstValueFrom(this.api.get<MeData>(API_ENDPOINTS.auth.me));
    const payload = ('data' in response && (response as any).data ? (response as any).data : response) as MeData;
    const backendUser = this.extractUser(payload);

    if (!backendUser) {
      throw new Error('Unable to load the current user.');
    }

    const mappedUser = mapBackendUser(backendUser);
    this.user.set(mappedUser);
    this.restoreSessionFromToken();

    return mappedUser;
  }

  async login(email: string, password: string): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(
        this.api.post<AuthData>(API_ENDPOINTS.auth.login, { email, password })
      );

      const payload = ('data' in response && (response as any).data ? (response as any).data : response) as AuthData;
      this.applyAuthData(payload);
      this.navigateByRole(this.user()?.role);

      return true;
    } catch (err: unknown) {
      this.error.set(this.getErrorMessage(err));
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async register(
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(
        this.api.post<AuthData>(API_ENDPOINTS.auth.register, { email, password, name, role })
      );

      const payload = ('data' in response && (response as any).data ? (response as any).data : response) as AuthData;
      this.applyAuthData(payload);

      if (this.isAuthenticated()) {
        this.navigateByRole(this.user()?.role);
      } else {
        this.router.navigate(['/login'], {
          queryParams: { message: 'check-email' },
        });
      }

      return true;
    } catch (err: unknown) {
      this.error.set(this.getErrorMessage(err));
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async logout(): Promise<void> {
    this.loading.set(true);

    try {
      this.clearAuthState();
      this.router.navigate(['/']);
    } finally {
      this.loading.set(false);
    }
  }

  async forgotPassword(_email: string): Promise<boolean> {
    this.error.set('Password reset is not available yet.');
    return false;
  }

  async resetPassword(_newPassword: string): Promise<boolean> {
    this.error.set('Password reset is not available yet.');
    return false;
  }

  async updateProfile(profile: Partial<User>): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await firstValueFrom(
        this.api.put<AuthData>(API_ENDPOINTS.auth.updateProfile, profile)
      );

      const payload = ('data' in response && (response as any).data ? (response as any).data : response) as AuthData;
      
      const backendUser = this.extractUser(payload);
      if (backendUser) {
        this.user.set(mapBackendUser(backendUser));
      }

      return true;
    } catch (err: unknown) {
      this.error.set(this.getErrorMessage(err));
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async uploadAvatar(file: File): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await firstValueFrom(
        this.api.patch<{ data: { avatar: string } } | { avatar: string }>(
          API_ENDPOINTS.uploads.userAvatar,
          formData
        )
      );

      const payload = ('data' in response && (response as any).data ? (response as any).data : response) as any;
      
      const currentUser = this.user();
      if (currentUser && payload.avatar) {
        this.user.set({ ...currentUser, avatar: payload.avatar });
      }

      return true;
    } catch (err: unknown) {
      this.error.set(this.getErrorMessage(err));
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  hasStoredToken(): boolean {
    return this.tokenService.hasToken();
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    const currentRole = this.user()?.role;
    return Array.isArray(role) ? role.includes(currentRole as UserRole) : currentRole === role;
  }

  redirectPathForRole(role?: UserRole): string {
    if (role === 'provider') {
      return '/provider/dashboard';
    }

    return '/customer/dashboard';
  }

  private applyAuthData(data: AuthData): void {
    const token = data.token || data.accessToken || data.access_token;
    const backendUser = this.extractUser(data);

    if (!token) {
      throw new Error('Authentication token was not returned by the server.');
    }

    if (!backendUser) {
      throw new Error('User data was not returned by the server.');
    }

    this.tokenService.saveToken(token);
    this.session.set({ access_token: token });
    this.user.set(mapBackendUser(backendUser));
  }

  private extractUser(data: AuthData | MeData | undefined): BackendUser | null {
    if (!data) {
      return null;
    }

    if ('user' in data && data.user) {
      return data.user;
    }

    if ('email' in data || '_id' in data || 'id' in data) {
      return data as BackendUser;
    }

    return null;
  }

  private restoreSessionFromToken(): void {
    const token = this.tokenService.getToken();

    if (token) {
      this.session.set({ access_token: token });
    }
  }

  private clearAuthState(): void {
    this.tokenService.clearToken();
    this.user.set(null);
    this.session.set(null);
  }

  private navigateByRole(role?: UserRole): void {
    this.router.navigate([this.redirectPathForRole(role)]);
  }

  private getErrorMessage(err: unknown): string {
    const apiError = err as ApiError;

    if (apiError?.message) {
      return apiError.message;
    }

    return err instanceof Error ? err.message : 'An error occurred';
  }
}
