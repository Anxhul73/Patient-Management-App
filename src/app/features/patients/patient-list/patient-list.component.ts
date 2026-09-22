import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { PatientService } from '../../../core/services/patient.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { ToastService } from '../../../core/services/toast.service';
import { Patient, PatientFilterCriteria, PatientSortCriteria, PatientStatus } from '../../../core/models/patient.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { AgePipe } from '../../../shared/pipes/age.pipe';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    StatusBadgeComponent,
    EmptyStateComponent,
    SkeletonLoaderComponent,
    AgePipe
  ],
  template: `
    <div class="patients-page">
      <!-- Header Area -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Patient Records</h1>
          <p class="page-subtitle">Manage, search, and monitor synthetic clinical patient profiles.</p>
        </div>
        <div class="header-action-buttons">
          <button type="button" class="btn btn-secondary" (click)="patientService.resetToMockData()" title="Restore default demo records">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
            <span class="desktop-only">Reset Mock Data</span>
          </button>

          <div class="export-dropdown-wrapper">
            <button type="button" class="btn btn-secondary" (click)="showExportMenu.set(!showExportMenu())">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Export</span>
            </button>
            @if (showExportMenu()) {
              <div class="export-menu">
                <button type="button" class="export-menu-item" (click)="exportCSV()">
                  Export as CSV (.csv)
                </button>
                <button type="button" class="export-menu-item" (click)="exportJSON()">
                  Export as JSON (.json)
                </button>
              </div>
            }
          </div>

          <a routerLink="/patients/add" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Patient</span>
          </a>
        </div>
      </div>

      <!-- Search & Filters Control Bar -->
      <div class="card filter-card">
        <div class="filter-controls-row">
          <!-- Client Search Input with RxJS Debounce -->
          <div class="search-input-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              class="form-control"
              placeholder="Search by name, ID, phone, email..."
              [ngModel]="filters.searchQuery"
              (ngModelChange)="onSearchChanged($event)"
            />
          </div>

          <!-- Status Filter -->
          <div class="filter-select-wrapper">
            <select class="form-select" [(ngModel)]="filters.status" (change)="onFilterChanged()">
              <option value="All">Status: All</option>
              <option value="Active">Status: Active</option>
              <option value="Inactive">Status: Inactive</option>
            </select>
          </div>

          <!-- Gender Filter -->
          <div class="filter-select-wrapper">
            <select class="form-select" [(ngModel)]="filters.gender" (change)="onFilterChanged()">
              <option value="All">Gender: All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <!-- Age Group Filter -->
          <div class="filter-select-wrapper">
            <select class="form-select" [(ngModel)]="filters.ageGroup" (change)="onFilterChanged()">
              <option value="All">Age: All</option>
              <option value="0-18">0-18 yrs (Pediatric)</option>
              <option value="19-30">19-30 yrs</option>
              <option value="31-45">31-45 yrs</option>
              <option value="46-60">46-60 yrs</option>
              <option value="61-75">61-75 yrs</option>
              <option value="76+">76+ yrs (Geriatric)</option>
            </select>
          </div>

          @if (isFiltered()) {
            <button type="button" class="btn btn-ghost btn-sm" (click)="clearFilters()">
              Clear Filters
            </button>
          }
        </div>
      </div>

      <!-- Patient Data Table -->
      <div class="table-container">
        @if (isLoading()) {
          <app-skeleton-loader type="table" [count]="6"></app-skeleton-loader>
        } @else if (paginatedPatients().length === 0) {
          <app-empty-state
            title="No matching patient records"
            description="No patients match your current search query or filter selection."
            actionLabel="Reset Search & Filters"
            (actionClicked)="clearFilters()"
          ></app-empty-state>
        } @else {
          <table class="data-table">
            <thead>
              <tr>
                <th class="sortable" (click)="setSort('id')">
                  <div class="th-content">
                    <span>Patient ID</span>
                    <span class="sort-indicator">{{ getSortIcon('id') }}</span>
                  </div>
                </th>
                <th class="sortable" (click)="setSort('name')">
                  <div class="th-content">
                    <span>Patient Full Name</span>
                    <span class="sort-indicator">{{ getSortIcon('name') }}</span>
                  </div>
                </th>
                <th class="sortable" (click)="setSort('dateOfBirth')">
                  <div class="th-content">
                    <span>DOB / Age</span>
                    <span class="sort-indicator">{{ getSortIcon('dateOfBirth') }}</span>
                  </div>
                </th>
                <th>Gender</th>
                <th>Contact Phone</th>
                <th class="sortable" (click)="setSort('status')">
                  <div class="th-content">
                    <span>Status</span>
                    <span class="sort-indicator">{{ getSortIcon('status') }}</span>
                  </div>
                </th>
                <th class="sortable" (click)="setSort('lastUpdated')">
                  <div class="th-content">
                    <span>Last Updated</span>
                    <span class="sort-indicator">{{ getSortIcon('lastUpdated') }}</span>
                  </div>
                </th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (patient of paginatedPatients(); track patient.id; let i = $index) {
                <tr class="row-enter" [style.--row-index]="i">
                  <td>
                    <span class="patient-id-tag">{{ patient.id }}</span>
                  </td>
                  <td>
                    <div class="patient-row-name">
                      <div class="name-avatar">{{ patient.firstName.charAt(0) }}{{ patient.lastName.charAt(0) }}</div>
                      <div>
                        <div class="full-name">{{ patient.firstName }} {{ patient.lastName }}</div>
                        <div class="email-subtext">{{ patient.contact.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{{ patient.dateOfBirth }}</div>
                    <div class="age-hint">{{ patient.dateOfBirth | age }}</div>
                  </td>
                  <td>{{ patient.gender }}</td>
                  <td>{{ patient.contact.phone }}</td>
                  <td>
                    <app-status-badge [status]="patient.status"></app-status-badge>
                  </td>
                  <td>{{ patient.updatedAt | date:'mediumDate' }}</td>
                  <td style="text-align: right;">
                    <div class="actions-group">
                      <a [routerLink]="['/patients', patient.id]" class="btn-action-icon" title="View Patient Details">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </a>
                      <a [routerLink]="['/patients', patient.id, 'edit']" class="btn-action-icon" title="Edit Patient">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </a>
                      <button
                        type="button"
                        class="btn-action-icon"
                        [title]="patient.status === 'Active' ? 'Deactivate Patient' : 'Activate Patient'"
                        (click)="confirmToggleStatus(patient)"
                      >
                        @if (patient.status === 'Active') {
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="10" y1="15" x2="10" y2="9"></line>
                            <line x1="14" y1="15" x2="14" y2="9"></line>
                          </svg>
                        } @else {
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        }
                      </button>
                      <button
                        type="button"
                        class="btn-action-icon btn-action-danger"
                        title="Delete Patient Record"
                        (click)="confirmDelete(patient)"
                      >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <!-- Table Pagination Footer -->
          <div class="pagination-footer">
            <div class="pagination-info">
              Showing <strong>{{ (currentPage() - 1) * pageSize() + 1 }}</strong> to
              <strong>{{ Math.min(currentPage() * pageSize(), filteredPatients().length) }}</strong> of
              <strong>{{ filteredPatients().length }}</strong> patient records
            </div>

            <div class="pagination-controls">
              <div class="page-size-selector">
                <span>Rows:</span>
                <select [ngModel]="pageSize()" (ngModelChange)="onPageSizeChange($event)">
                  <option [value]="5">5</option>
                  <option [value]="10">10</option>
                  <option [value]="25">25</option>
                </select>
              </div>

              <div class="page-buttons">
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  [disabled]="currentPage() === 1"
                  (click)="setPage(currentPage() - 1)"
                >
                  Previous
                </button>
                <span class="page-number-label">Page {{ currentPage() }} of {{ totalPages() || 1 }}</span>
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  [disabled]="currentPage() >= totalPages()"
                  (click)="setPage(currentPage() + 1)"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .patients-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .page-subtitle {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-top: 0.2rem;
    }

    .header-action-buttons {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      position: relative;
    }

    .export-dropdown-wrapper {
      position: relative;
    }

    .export-menu {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      background-color: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      padding: 0.35rem;
      z-index: 100;
      width: 180px;
    }

    .export-menu-item {
      display: block;
      width: 100%;
      text-align: left;
      padding: 0.55rem 0.75rem;
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--text-primary);
      background: transparent;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;

      &:hover {
        background-color: var(--bg-surface-muted);
        color: var(--color-primary);
      }
    }

    .filter-card {
      padding: 1rem 1.25rem;
    }

    .filter-controls-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-input-box {
      flex: 1;
      min-width: 240px;
      position: relative;

      .search-icon {
        position: absolute;
        left: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-muted);
        pointer-events: none;
      }

      .form-control {
        padding-left: 2.3rem;
      }
    }

    .filter-select-wrapper {
      min-width: 140px;
    }

    .th-content {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .sort-indicator {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .patient-id-tag {
      font-family: monospace;
      font-weight: 700;
      font-size: 0.8125rem;
      color: var(--color-primary);
      background-color: var(--color-primary-light);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-xs);
    }

    .patient-row-name {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .name-avatar {
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

    .full-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .email-subtext {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .age-hint {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .actions-group {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .btn-action-icon {
      background: transparent;
      border: 1px solid transparent;
      border-radius: var(--radius-sm);
      padding: 0.4rem;
      color: var(--text-secondary);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);

      &:hover {
        background-color: var(--bg-surface-muted);
        color: var(--color-primary);
        border-color: var(--border-default);
      }

      &.btn-action-danger:hover {
        background-color: var(--status-inactive-bg);
        color: #ef4444;
        border-color: var(--status-inactive-border);
      }
    }

    .pagination-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.25rem;
      background-color: var(--bg-surface-muted);
      border-top: 1px solid var(--border-subtle);
      flex-wrap: wrap;
      gap: 1rem;
    }

    .pagination-info {
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .page-size-selector {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);

      select {
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-default);
        background-color: var(--bg-surface);
        color: var(--text-primary);
        font-size: 0.8125rem;
      }
    }

    .page-buttons {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .page-number-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .desktop-only { display: none; }
    }
  `]
})
export class PatientListComponent implements OnInit {
  Math = Math;

  filters: PatientFilterCriteria = {
    searchQuery: '',
    status: 'All',
    gender: 'All',
    ageGroup: 'All'
  };

  sort: PatientSortCriteria = {
    column: 'lastUpdated',
    direction: 'desc'
  };

  private searchSubject = new Subject<string>();

  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  isLoading = signal<boolean>(false);
  showExportMenu = signal<boolean>(false);

  constructor(
    public patientService: PatientService,
    private confirmService: ConfirmDialogService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Set up search debounce
    this.searchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe((query) => {
      this.filters.searchQuery = query;
      this.currentPage.set(1);
    });
  }

  onSearchChanged(query: string): void {
    this.searchSubject.next(query);
  }

  onFilterChanged(): void {
    this.currentPage.set(1);
  }

  isFiltered(): boolean {
    return (
      this.filters.searchQuery.trim() !== '' ||
      this.filters.status !== 'All' ||
      this.filters.gender !== 'All' ||
      this.filters.ageGroup !== 'All'
    );
  }

  clearFilters(): void {
    this.filters = {
      searchQuery: '',
      status: 'All',
      gender: 'All',
      ageGroup: 'All'
    };
    this.currentPage.set(1);
  }

  filteredPatients = computed(() => {
    let list = this.patientService.patients();
    const query = this.filters.searchQuery.toLowerCase().trim();
    const now = new Date();

    // 1. Text Search Filter
    if (query) {
      list = list.filter((p) =>
        p.firstName.toLowerCase().includes(query) ||
        p.lastName.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.contact.phone.includes(query) ||
        p.contact.email.toLowerCase().includes(query)
      );
    }

    // 2. Status Filter
    if (this.filters.status !== 'All') {
      list = list.filter((p) => p.status === this.filters.status);
    }

    // 3. Gender Filter
    if (this.filters.gender !== 'All') {
      list = list.filter((p) => p.gender === this.filters.gender);
    }

    // 4. Age Group Filter
    if (this.filters.ageGroup !== 'All') {
      list = list.filter((p) => {
        const birth = new Date(p.dateOfBirth);
        const age = now.getFullYear() - birth.getFullYear();
        switch (this.filters.ageGroup) {
          case '0-18': return age <= 18;
          case '19-30': return age >= 19 && age <= 30;
          case '31-45': return age >= 31 && age <= 45;
          case '46-60': return age >= 46 && age <= 60;
          case '61-75': return age >= 61 && age <= 75;
          case '76+': return age >= 76;
          default: return true;
        }
      });
    }

    // 5. Column Sorting
    const sorted = [...list].sort((a, b) => {
      let comparison = 0;
      switch (this.sort.column) {
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'dateOfBirth':
          comparison = new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'lastUpdated':
        default:
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return this.sort.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredPatients().length / this.pageSize());
  });

  paginatedPatients = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredPatients().slice(start, start + this.pageSize());
  });

  setSort(column: keyof Patient | 'name' | 'lastUpdated'): void {
    if (this.sort.column === column) {
      this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sort.column = column;
      this.sort.direction = 'asc';
    }
  }

  getSortIcon(column: string): string {
    if (this.sort.column !== column) return '↕';
    return this.sort.direction === 'asc' ? '▲' : '▼';
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(Number(size));
    this.currentPage.set(1);
  }

  async confirmToggleStatus(patient: Patient): Promise<void> {
    const action = patient.status === 'Active' ? 'Deactivate' : 'Activate';
    const confirmed = await this.confirmService.confirm({
      title: `${action} Patient Record?`,
      message: `Are you sure you want to ${action.toLowerCase()} the chart for ${patient.firstName} ${patient.lastName} (${patient.id})?`,
      confirmText: action,
      type: patient.status === 'Active' ? 'warning' : 'primary'
    });

    if (confirmed) {
      await this.patientService.togglePatientStatus(patient.id);
    }
  }

  async confirmDelete(patient: Patient): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Delete Patient Record?',
      message: `This action cannot be undone. Are you sure you want to permanently remove synthetic record ${patient.id} (${patient.firstName} ${patient.lastName})?`,
      confirmText: 'Delete Record',
      type: 'danger'
    });

    if (confirmed) {
      await this.patientService.deletePatient(patient.id);
    }
  }

  exportCSV(): void {
    this.showExportMenu.set(false);
    this.patientService.exportToCSV();
  }

  exportJSON(): void {
    this.showExportMenu.set(false);
    this.patientService.exportToJSON();
  }
}
