import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'patients',
        loadComponent: () => import('./features/patients/patient-list/patient-list.component').then((m) => m.PatientListComponent)
      },
      {
        path: 'patients/add',
        loadComponent: () => import('./features/patients/patient-wizard/patient-wizard.component').then((m) => m.PatientWizardComponent)
      },
      {
        path: 'patients/:id',
        loadComponent: () => import('./features/patients/patient-details/patient-details.component').then((m) => m.PatientDetailsComponent)
      },
      {
        path: 'patients/:id/edit',
        loadComponent: () => import('./features/patients/patient-edit/patient-edit.component').then((m) => m.PatientEditComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./features/analytics/analytics.component').then((m) => m.AnalyticsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then((m) => m.SettingsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent)
  }
];
