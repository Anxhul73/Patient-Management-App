export interface DashboardMetrics {
  totalPatients: number;
  activePatients: number;
  inactivePatients: number;
  newPatientsThisMonth: number;
  scheduledAppointments: number;
  criticalAlerts: number;
  growthPercentage: number;
  retentionRate: number;
}

export interface ChartSeriesData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
}

export interface UserSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  securityAlerts: boolean;
  patientUpdates: boolean;
  theme: 'light' | 'dark' | 'system';
  sessionTimeoutMinutes: number;
}
