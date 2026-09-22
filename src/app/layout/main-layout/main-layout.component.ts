import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HipaaBannerComponent } from '../../shared/components/hipaa-banner/hipaa-banner.component';
import { ToastContainerComponent } from '../../shared/components/toast-container/toast-container.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent,
    HipaaBannerComponent,
    ToastContainerComponent,
    ConfirmDialogComponent
  ],
  template: `
    <div class="app-layout">
      <!-- Top Educational HIPAA Notice -->
      <app-hipaa-banner></app-hipaa-banner>

      <div class="app-body">
        <!-- Persistent / Drawer Sidebar -->
        <app-sidebar
          [isMobileOpen]="mobileSidebarOpen()"
          (closeMobileSidebar)="mobileSidebarOpen.set(false)"
        ></app-sidebar>

        <!-- Main Content Area -->
        <div class="app-main-content">
          <app-navbar
            (toggleMobileSidebar)="mobileSidebarOpen.set(!mobileSidebarOpen())"
          ></app-navbar>

          <main class="page-viewport">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>

      <!-- Global Modals and Notifications -->
      <app-confirm-dialog></app-confirm-dialog>
      <app-toast-container></app-toast-container>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-app);
    }

    .app-body {
      display: flex;
      flex: 1;
      position: relative;
    }

    .app-main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      background-color: var(--bg-app);
    }

    .page-viewport {
      flex: 1;
      padding: 1.75rem;
      max-width: 1440px;
      width: 100%;
      margin: 0 auto;

      @media (max-width: 768px) {
        padding: 1rem;
      }
    }
  `]
})
export class MainLayoutComponent {
  mobileSidebarOpen = signal<boolean>(false);
}
