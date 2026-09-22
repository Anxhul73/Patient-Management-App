import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('Auth Guards', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('authGuard should allow access when user is authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeTrue();
  });

  it('authGuard should redirect unauthenticated user to /login', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    const dummyUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.and.returnValue(dummyUrlTree);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(dummyUrlTree);
  });

  it('guestGuard should redirect authenticated user to /dashboard', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    const dummyUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.and.returnValue(dummyUrlTree);

    const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    expect(result).toBe(dummyUrlTree);
  });
});
