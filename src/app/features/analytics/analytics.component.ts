import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { AnalyticsService } from '../../core/services/analytics.service';
import { ThemeService } from '../../core/services/theme.service';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, KpiCardComponent],
  template: `
    <div class="analytics-page">
      <!-- Header -->
      <div class="analytics-header">
        <div>
          <h1 class="page-title">Healthcare Analytics & Clinical Intelligence</h1>
          <p class="page-subtitle">Real-time demographic breakdowns, registration trends, and population distribution metrics.</p>
        </div>
        <div class="date-badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Live Clinical Cohort • 2026 Analysis</span>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="card analytics-filters-card">
        <div class="filter-row">
          <div class="filter-item">
            <label>Time Horizon</label>
            <select class="form-select" [(ngModel)]="selectedHorizon" (change)="onFilterChange()">
              <option value="12m">Trailing 12 Months (Full Cohort)</option>
              <option value="6m">Last 6 Months</option>
              <option value="ytd">Year to Date (2026)</option>
            </select>
          </div>

          <div class="filter-item">
            <label>Patient Status Filter</label>
            <select class="form-select" [(ngModel)]="selectedStatus" (change)="onFilterChange()">
              <option value="All">All Records (Active & Inactive)</option>
              <option value="Active">Active Enrolled Only</option>
              <option value="Inactive">Inactive / Archived Only</option>
            </select>
          </div>

          <div class="filter-item">
            <label>Gender Segment</label>
            <select class="form-select" [(ngModel)]="selectedGender" (change)="onFilterChange()">
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other / Non-binary</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Top Metric Cards -->
      <div class="metrics-grid">
        <app-kpi-card
          title="Total Registered Population"
          [value]="metrics().totalPatients"
          changeText="+14.8% growth"
          [changePositive]="true"
          iconColorClass="icon-blue"
          [isHighlight]="true"
        >
          <svg kpi-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
        </app-kpi-card>

        <app-kpi-card
          title="Active Care Retention"
          [value]="metrics().retentionRate + '%'"
          changeText="High compliance"
          [changePositive]="true"
          iconColorClass="icon-green"
        >
          <svg kpi-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </app-kpi-card>

        <app-kpi-card
          title="Monthly Intake Velocity"
          [value]="metrics().newPatientsThisMonth"
          subtitle="Registrations in last 30d"
          iconColorClass="icon-teal"
        >
          <svg kpi-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </app-kpi-card>

        <app-kpi-card
          title="Triage & Care Alerts"
          [value]="metrics().criticalAlerts"
          changeText="Attention required"
          [changePositive]="false"
          iconColorClass="icon-amber"
        >
          <svg kpi-icon width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
          </svg>
        </app-kpi-card>
      </div>

      <!-- Charts Section 1: Growth & Monthly Registration -->
      <div class="charts-2col">
        <div class="card chart-card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Patient Intake & Trajectory (Line Chart)</h3>
              <p class="card-subtitle">Trajectory tracking of intake and active care consultations</p>
            </div>
            <span class="badge badge-info">12-Month Curve</span>
          </div>
          <div class="card-body chart-body">
            <canvas #growthCanvas></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Monthly Registrations (Bar Chart)</h3>
              <p class="card-subtitle">Volume of newly enrolled synthetic patient records by calendar month</p>
            </div>
            <span class="badge badge-neutral">Intake Volume</span>
          </div>
          <div class="card-body chart-body">
            <canvas #monthlyCanvas></canvas>
          </div>
        </div>
      </div>

      <!-- Charts Section 2: Demographics, Age & Insurance Distribution -->
      <div class="charts-3col">
        <div class="card chart-card">
          <div class="card-header">
            <h3 class="card-title">Gender Distribution</h3>
          </div>
          <div class="card-body doughnut-chart-body">
            <canvas #demoCanvas></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="card-header">
            <h3 class="card-title">Age Tier Distribution</h3>
          </div>
          <div class="card-body chart-body">
            <canvas #ageCanvas></canvas>
          </div>
        </div>

        <div class="card chart-card">
          <div class="card-header">
            <h3 class="card-title">Insurance Carrier Distribution</h3>
          </div>
          <div class="card-body doughnut-chart-body">
            <canvas #insuranceCanvas></canvas>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-page {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .analytics-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 800;
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-top: 0.2rem;
    }

    .date-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-full);
      padding: 0.4rem 0.85rem;
      font-size: 0.775rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .analytics-filters-card {
      padding: 1rem 1.25rem;
    }

    .filter-row {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .filter-item {
      flex: 1;
      min-width: 200px;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      label {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--text-muted);
      }
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.25rem;
    }

    .charts-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;

      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
    }

    .charts-3col {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;

      @media (max-width: 1100px) {
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .chart-card {
      min-height: 320px;
      display: flex;
      flex-direction: column;
    }

    .chart-body {
      flex: 1;
      min-height: 230px;
      position: relative;
      padding: 1.25rem 1.5rem;

      canvas {
        max-height: 240px;
        width: 100% !important;
      }
    }

    .doughnut-chart-body {
      flex: 1;
      min-height: 230px;
      position: relative;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;

      canvas {
        max-height: 220px;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('growthCanvas') growthCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('monthlyCanvas') monthlyCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('demoCanvas') demoCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ageCanvas') ageCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('insuranceCanvas') insuranceCanvasRef!: ElementRef<HTMLCanvasElement>;

  private analyticsService = inject(AnalyticsService);
  private themeService = inject(ThemeService);

  selectedHorizon = '12m';
  selectedStatus = 'All';
  selectedGender = 'All';

  metrics = this.analyticsService.metrics;
  private charts: Chart[] = [];

  constructor() {
    effect(() => {
      const isDark = this.themeService.isDark();
      setTimeout(() => this.rebuildAllCharts(isDark), 50);
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.buildAllCharts();
  }

  ngOnDestroy(): void {
    this.destroyAllCharts();
  }

  onFilterChange(): void {
    this.rebuildAllCharts(this.themeService.isDark());
  }

  private getChartTextColor(): string {
    return this.themeService.isDark() ? '#94a3b8' : '#64748b';
  }

  private getGridBorderColor(): string {
    return this.themeService.isDark() ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  }

  private destroyAllCharts(): void {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  }

  private rebuildAllCharts(isDark: boolean): void {
    this.destroyAllCharts();
    this.buildAllCharts();
  }

  private buildAllCharts(): void {
    const isDark = this.themeService.isDark();
    const textColor = this.getChartTextColor();
    const gridColor = this.getGridBorderColor();

    // 1. Growth Line
    if (this.growthCanvasRef) {
      const ctx = this.growthCanvasRef.nativeElement.getContext('2d');
      if (ctx) {
        const data = this.analyticsService.getGrowthChartData(isDark);
        const chart = new Chart(ctx, {
          type: 'line',
          data: data as any,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top', labels: { color: textColor } }
            },
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textColor } },
              y: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
          }
        });
        this.charts.push(chart);
      }
    }

    // 2. Monthly Registrations Bar
    if (this.monthlyCanvasRef) {
      const ctx = this.monthlyCanvasRef.nativeElement.getContext('2d');
      if (ctx) {
        const data = this.analyticsService.getMonthlyRegistrationsData();
        const chart = new Chart(ctx, {
          type: 'bar',
          data: data as any,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: textColor } },
              y: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
          }
        });
        this.charts.push(chart);
      }
    }

    // 3. Gender Demographics Doughnut
    if (this.demoCanvasRef) {
      const ctx = this.demoCanvasRef.nativeElement.getContext('2d');
      if (ctx) {
        const data = this.analyticsService.getDemographicsData();
        const chart = new Chart(ctx, {
          type: 'doughnut',
          data: data as any,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { color: textColor } }
            },
            cutout: '65%'
          }
        });
        this.charts.push(chart);
      }
    }

    // 4. Age Distribution Bar
    if (this.ageCanvasRef) {
      const ctx = this.ageCanvasRef.nativeElement.getContext('2d');
      if (ctx) {
        const data = this.analyticsService.getAgeDistributionData();
        const chart = new Chart(ctx, {
          type: 'bar',
          data: data as any,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: textColor } },
              y: { grid: { color: gridColor }, ticks: { color: textColor, stepSize: 1 } }
            }
          }
        });
        this.charts.push(chart);
      }
    }

    // 5. Insurance Carrier Distribution
    if (this.insuranceCanvasRef) {
      const ctx = this.insuranceCanvasRef.nativeElement.getContext('2d');
      if (ctx) {
        const data = this.analyticsService.getInsuranceDistributionData();
        const chart = new Chart(ctx, {
          type: 'doughnut',
          data: data as any,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { color: textColor, font: { size: 10 } } }
            },
            cutout: '60%'
          }
        });
        this.charts.push(chart);
      }
    }
  }
}
