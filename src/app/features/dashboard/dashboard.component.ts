import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  signal,
  inject,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../core/services/auth.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { PatientService } from '../../core/services/patient.service';
import { ThemeService } from '../../core/services/theme.service';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { Patient } from '../../core/models/patient.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, KpiCardComponent, StatusBadgeComponent],
  template: `
    <div class="dashboard-page">
      <!-- Header Banner -->
      <div class="dashboard-header">
        <div>
          <h1 class="header-title">Good morning, {{ authService.currentUser()?.name || 'Administrator' }}</h1>
          <p class="header-subtitle">Here's what's happening with your healthcare operations and synthetic patient records today.</p>
        </div>
        <div class="header-actions">
          <a routerLink="/patients/add" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Patient</span>
          </a>
          <a routerLink="/analytics" class="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <span>Full Analytics</span>
          </a>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid stagger-in">
        <app-kpi-card
          title="Total Patients"
          [value]="metrics().totalPatients"
          changeText="+14.8% vs last month"
          [changePositive]="true"
          iconColorClass="icon-blue"
          [isHighlight]="true"
        >
          <svg kpi-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </app-kpi-card>

        <app-kpi-card
          title="Active Patients"
          [value]="metrics().activePatients"
          changeText="91% retention rate"
          [changePositive]="true"
          iconColorClass="icon-green"
        >
          <svg kpi-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </app-kpi-card>

        <app-kpi-card
          title="Inactive Records"
          [value]="metrics().inactivePatients"
          subtitle="Archived / Discharged"
          iconColorClass="icon-red"
        >
          <svg kpi-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </app-kpi-card>

        <app-kpi-card
          title="New This Month"
          [value]="metrics().newPatientsThisMonth"
          changeText="+8% intake"
          [changePositive]="true"
          iconColorClass="icon-teal"
        >
          <svg kpi-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </app-kpi-card>

        <app-kpi-card
          title="Appointments"
          [value]="metrics().scheduledAppointments"
          subtitle="Scheduled this week"
          iconColorClass="icon-blue"
        >
          <svg kpi-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </app-kpi-card>

        <app-kpi-card
          title="Critical Alerts"
          [value]="metrics().criticalAlerts"
          changeText="Requires review"
          [changePositive]="false"
          iconColorClass="icon-amber"
        >
          <svg kpi-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </app-kpi-card>
      </div>

      <!-- Charts Section (Grid 2-column) -->
      <div class="dashboard-charts-grid">
        <!-- Chart 1: Growth Trend -->
        <div class="card chart-card">
          <div class="card-header">
            <div>
              <div class="card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                <span>Patient Intake & Growth Trajectory</span>
              </div>
              <div class="card-subtitle">Annual progression of registered synthetic patient cohorts</div>
            </div>
            <span class="badge badge-info">2025-2026 Trend</span>
          </div>
          <div class="card-body chart-body">
            <canvas #growthChartCanvas></canvas>
          </div>
        </div>

        <!-- Chart 2: Demographics -->
        <div class="card chart-card">
          <div class="card-header">
            <div>
              <div class="card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
                <span>Patient Gender Demographics</span>
              </div>
              <div class="card-subtitle">Distribution across active demo records</div>
            </div>
            <span class="badge badge-neutral">Current Cohort</span>
          </div>
          <div class="card-body chart-body doughnut-chart-body">
            <canvas #demographicsChartCanvas></canvas>
          </div>
        </div>
      </div>

      <!-- Secondary Charts Grid (Age Distribution & Status) -->
      <div class="dashboard-charts-grid secondary-charts-grid">
        <div class="card chart-card">
          <div class="card-header">
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
              <span>Age Group Distribution</span>
            </div>
            <div class="card-subtitle">Breakdown across 6 pediatric to geriatric tiers</div>
          </div>
          <div class="card-body chart-body">
            <canvas #ageChartCanvas></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="card-header">
            <div class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span>Active vs Inactive Status Ratio</span>
            </div>
            <div class="card-subtitle">Operational status breakdown</div>
          </div>
          <div class="card-body chart-body doughnut-chart-body">
            <canvas #statusChartCanvas></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Patients Section -->
      <div class="recent-patients-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Recently Updated Patients</h2>
            <p class="section-subtitle">Real-time feed of newly modified or enrolled patient charts</p>
          </div>
          <a routerLink="/patients" class="btn btn-outline btn-sm">
            <span>View All Patients</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Gender / Age</th>
                <th>Primary Physician</th>
                <th>Status</th>
                <th>Last Modified</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              @for (patient of recentPatients(); track patient.id; let i = $index) {
                <tr class="row-enter" [style.--row-index]="i">
                  <td>
                    <span class="patient-id-badge">{{ patient.id }}</span>
                  </td>
                  <td>
                    <div class="patient-name-cell">
                      <div class="avatar-circle">{{ patient.firstName.charAt(0) }}{{ patient.lastName.charAt(0) }}</div>
                      <div class="patient-full-name">{{ patient.firstName }} {{ patient.lastName }}</div>
                    </div>
                  </td>
                  <td>{{ patient.gender }}</td>
                  <td>{{ patient.medical.primaryPhysician }}</td>
                  <td>
                    <app-status-badge [status]="patient.status"></app-status-badge>
                  </td>
                  <td>{{ patient.updatedAt | date:'MMM d, y, h:mm a' }}</td>
                  <td style="text-align: right;">
                    <a [routerLink]="['/patients', patient.id]" class="btn btn-secondary btn-sm">
                      <span>Details</span>
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .header-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.025em;
    }

    .header-subtitle {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.25rem;
    }

    .dashboard-charts-grid {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 1.5rem;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .secondary-charts-grid {
      grid-template-columns: 1fr 1fr;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .chart-card {
      min-height: 340px;
      display: flex;
      flex-direction: column;
    }

    .chart-body {
      flex: 1;
      position: relative;
      min-height: 240px;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;

      canvas {
        max-height: 250px;
        width: 100% !important;
      }
    }

    .doughnut-chart-body {
      canvas {
        max-height: 220px;
      }
    }

    .recent-patients-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .section-subtitle {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .patient-id-badge {
      font-family: monospace;
      font-weight: 700;
      font-size: 0.8125rem;
      color: var(--color-primary);
      background-color: var(--color-primary-light);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-xs);
    }

    .patient-name-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .patient-full-name {
      font-weight: 600;
      color: var(--text-primary);
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('growthChartCanvas') growthChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('demographicsChartCanvas') demographicsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ageChartCanvas') ageChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statusChartCanvas') statusChartRef!: ElementRef<HTMLCanvasElement>;

  public authService = inject(AuthService);
  private analyticsService = inject(AnalyticsService);
  private patientService = inject(PatientService);
  private themeService = inject(ThemeService);

  private growthChart: Chart | null = null;
  private demographicsChart: Chart | null = null;
  private ageChart: Chart | null = null;
  private statusChart: Chart | null = null;

  metrics = this.analyticsService.metrics;
  recentPatients = signal<Patient[]>([]);

  constructor() {
    effect(() => {
      const isDark = this.themeService.isDark();
      setTimeout(() => this.rebuildCharts(isDark), 50);
    });
  }

  ngOnInit(): void {
    this.recentPatients.set(this.patientService.getRecentPatients(5));
  }

  ngAfterViewInit(): void {
    this.initAllCharts();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private initAllCharts(): void {
    const isDark = this.themeService.isDark();
    this.buildGrowthChart(isDark);
    this.buildDemographicsChart();
    this.buildAgeChart();
    this.buildStatusChart();
  }

  private rebuildCharts(isDark: boolean): void {
    if (!this.growthChartRef) return;
    this.destroyCharts();
    this.initAllCharts();
  }

  private destroyCharts(): void {
    if (this.growthChart) { this.growthChart.destroy(); this.growthChart = null; }
    if (this.demographicsChart) { this.demographicsChart.destroy(); this.demographicsChart = null; }
    if (this.ageChart) { this.ageChart.destroy(); this.ageChart = null; }
    if (this.statusChart) { this.statusChart.destroy(); this.statusChart = null; }
  }

  private getChartTextColor(): string {
    return this.themeService.isDark() ? '#94a3b8' : '#64748b';
  }

  private getGridBorderColor(): string {
    return this.themeService.isDark() ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  }

  private buildGrowthChart(isDark: boolean): void {
    if (!this.growthChartRef) return;
    const ctx = this.growthChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.analyticsService.getGrowthChartData(isDark);
    const textColor = this.getChartTextColor();
    const gridColor = this.getGridBorderColor();

    this.growthChart = new Chart(ctx, {
      type: 'line',
      data: data as any,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'inherit', size: 12, weight: 600 } }
          },
          tooltip: {
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor }
          }
        }
      }
    });
  }

  private buildDemographicsChart(): void {
    if (!this.demographicsChartRef) return;
    const ctx = this.demographicsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.analyticsService.getDemographicsData();
    const textColor = this.getChartTextColor();

    this.demographicsChart = new Chart(ctx, {
      type: 'doughnut',
      data: data as any,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: textColor, font: { family: 'inherit', size: 12 } }
          }
        },
        cutout: '70%'
      }
    });
  }

  private buildAgeChart(): void {
    if (!this.ageChartRef) return;
    const ctx = this.ageChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.analyticsService.getAgeDistributionData();
    const textColor = this.getChartTextColor();
    const gridColor = this.getGridBorderColor();

    this.ageChart = new Chart(ctx, {
      type: 'bar',
      data: data as any,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, stepSize: 1 } }
        }
      }
    });
  }

  private buildStatusChart(): void {
    if (!this.statusChartRef) return;
    const ctx = this.statusChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.analyticsService.getStatusData();
    const textColor = this.getChartTextColor();

    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: data as any,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: textColor, font: { family: 'inherit', size: 12 } }
          }
        },
        cutout: '72%'
      }
    });
  }
}
