import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState, LoginCredentials, User } from '../models/auth.model';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/app.constants';
import { ToastService } from './toast.service';

const DEMO_USER: User = {
  id: 'USR-ADMIN-01',
  name: 'Dr. Katherine Reynolds',
  email: 'admin@medicare360.demo',
  role: 'Admin',
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  department: 'Clinical Operations & Administration',
  lastLogin: new Date().toISOString()
};

const DEFAULT_AUTH_STATE: AuthState = {
  isAuthenticated: false,
  user: null
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSignal = signal<AuthState>(DEFAULT_AUTH_STATE);

  public readonly authState = this.authStateSignal.asReadonly();
  public readonly isAuthenticated = computed(() => this.authStateSignal().isAuthenticated);
  public readonly currentUser = computed(() => this.authStateSignal().user);

  constructor(
    private storage: StorageService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.restoreSession();
  }

  private restoreSession(): void {
    const savedState = this.storage.getSession<AuthState>(STORAGE_KEYS.AUTH_STATE, DEFAULT_AUTH_STATE);
    if (savedState && savedState.isAuthenticated && savedState.user) {
      this.authStateSignal.set(savedState);
    } else {
      // Fallback check local storage if remember me was used
      const localState = this.storage.getLocal<AuthState>(STORAGE_KEYS.AUTH_STATE, DEFAULT_AUTH_STATE);
      if (localState && localState.isAuthenticated && localState.user) {
        this.authStateSignal.set(localState);
      }
    }
  }

  login(credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cleanEmail = credentials.email?.trim().toLowerCase();
        const cleanPassword = credentials.password?.trim();

        // Valid demo credentials check
        const isValid =
          (cleanEmail === 'admin@medicare360.demo' && cleanPassword === 'Admin@123') ||
          (cleanEmail === 'doctor@medicare360.demo' && cleanPassword === 'Doctor@123');

        if (isValid) {
          const user: User = {
            ...DEMO_USER,
            email: cleanEmail,
            name: cleanEmail.includes('doctor') ? 'Dr. Marcus Thorne' : 'Dr. Katherine Reynolds',
            role: cleanEmail.includes('doctor') ? 'Physician' : 'Admin',
            lastLogin: new Date().toISOString()
          };

          const newAuthState: AuthState = {
            isAuthenticated: true,
            user,
            token: `demo-jwt-${Date.now()}`,
            expiresAt: Date.now() + 8 * 60 * 60 * 1000 // 8 hours
          };

          this.authStateSignal.set(newAuthState);

          if (credentials.rememberMe) {
            this.storage.setLocal(STORAGE_KEYS.AUTH_STATE, newAuthState);
          }
          this.storage.setSession(STORAGE_KEYS.AUTH_STATE, newAuthState);

          this.toastService.success('Authentication Successful', `Welcome back, ${user.name}`);
          this.router.navigate(['/dashboard']);
          resolve({ success: true });
        } else {
          this.toastService.error('Authentication Failed', 'Invalid credentials. Use admin@medicare360.demo / Admin@123');
          resolve({ success: false, message: 'Invalid credentials provided.' });
        }
      }, 500);
    });
  }

  logout(): void {
    this.authStateSignal.set(DEFAULT_AUTH_STATE);
    this.storage.removeSession(STORAGE_KEYS.AUTH_STATE);
    this.storage.removeLocal(STORAGE_KEYS.AUTH_STATE);
    this.toastService.info('Signed Out', 'You have been safely logged out of MediCare360.');
    this.router.navigate(['/login']);
  }
}
