import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="card not-found-card">
        <div class="error-code">404</div>
        <h1 class="error-title">Page Not Found</h1>
        <p class="error-desc">The clinical dashboard route or patient record URL you requested does not exist or has been relocated.</p>
        <div class="error-actions">
          <a routerLink="/dashboard" class="btn btn-primary">Return to Dashboard</a>
          <a routerLink="/patients" class="btn btn-secondary">Browse Patients</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .not-found-card {
      max-width: 480px;
      padding: 3rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .error-code {
      font-size: 4rem;
      font-weight: 900;
      color: var(--color-primary);
      line-height: 1;
      margin-bottom: 0.5rem;
      letter-spacing: -0.05em;
    }

    .error-title {
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .error-desc {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 1.75rem;
      line-height: 1.45;
    }

    .error-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      justify-content: center;
    }
  `]
})
export class NotFoundComponent {}
