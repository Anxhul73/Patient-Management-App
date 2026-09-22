import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;
  let storageSpy: jasmine.SpyObj<StorageService>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    storageSpy = jasmine.createSpyObj('StorageService', ['getSession', 'setSession', 'getLocal', 'setLocal', 'removeSession', 'removeLocal']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error', 'info', 'warning']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: StorageService, useValue: storageSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate valid admin credentials', async () => {
    const result = await service.login({
      email: 'admin@medicare360.demo',
      password: 'Admin@123',
      rememberMe: true
    });

    expect(result.success).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.currentUser()?.role).toBe('Admin');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should reject invalid credentials and display error toast', async () => {
    const result = await service.login({
      email: 'wrong@medicare360.demo',
      password: 'InvalidPassword'
    });

    expect(result.success).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
    expect(toastSpy.error).toHaveBeenCalled();
  });

  it('should logout user and clear session state', () => {
    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.currentUser()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
