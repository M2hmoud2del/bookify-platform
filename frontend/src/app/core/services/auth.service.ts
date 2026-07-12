import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../config/supabase.config';
import { User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  user = signal<User | null>(null);
  session = signal<{ access_token: string } | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  isAuthenticated = computed(() => !!this.user() && !!this.session());
  isProvider = computed(() => this.user()?.role === 'provider');
  isCustomer = computed(() => this.user()?.role === 'customer');

  async checkSession(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        this.session.set(session);
        await this.loadUserProfile(session.user.id);
      }
    } catch (err) {
      console.error('Session check error:', err);
    }
  }

  private async loadUserProfile(userId: string): Promise<void> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error loading user profile:', error);
      return;
    }

    this.user.set(data);
  }

  async login(email: string, password: string): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      this.session.set(data.session);
      await this.loadUserProfile(data.user.id);

      const user = this.user();
      if (user?.role === 'provider') {
        this.router.navigate(['/provider/dashboard']);
      } else {
        this.router.navigate(['/customer/dashboard']);
      }

      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      this.error.set(errorMessage);
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          email,
          name,
          role,
        });

        if (data.session) {
          this.session.set(data.session);
          await this.loadUserProfile(data.user.id);
        }

        if (!data.session) {
          this.router.navigate(['/login'], {
            queryParams: { message: 'check-email' },
          });
        } else if (role === 'provider') {
          this.router.navigate(['/provider/dashboard']);
        } else {
          this.router.navigate(['/customer/dashboard']);
        }

        return true;
      }

      return false;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      this.error.set(errorMessage);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async logout(): Promise<void> {
    this.loading.set(true);

    try {
      await supabase.auth.signOut();
      this.user.set(null);
      this.session.set(null);
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async forgotPassword(email: string): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      this.error.set(errorMessage);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async resetPassword(newPassword: string): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      this.error.set(errorMessage);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  async updateProfile(profile: Partial<User>): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const currentUser = this.user();
      if (!currentUser) throw new Error('No user logged in');

      const { error } = await supabase
        .from('user_profiles')
        .update(profile)
        .eq('id', currentUser._id);

      if (error) throw error;

      this.user.update((u) => (u ? { ...u, ...profile } : u));

      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      this.error.set(errorMessage);
      return false;
    } finally {
      this.loading.set(false);
    }
  }
}
