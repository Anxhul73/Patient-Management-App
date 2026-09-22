import { BloodGroup, Gender, MaritalStatus, PatientType } from '../models/patient.model';
import { UserSettings } from '../models/analytics.model';

export const STORAGE_KEYS = {
  AUTH_STATE: 'medicare360_auth_state',
  PATIENTS: 'medicare360_synthetic_patients_v1',
  PATIENT_FORM_DRAFT: 'patientFormDraft',
  USER_SETTINGS: 'medicare360_user_settings',
  NOTIFICATIONS: 'medicare360_notifications',
  THEME_PREFERENCE: 'medicare360_theme',
  HIPAA_BANNER_DISMISSED: 'medicare360_hipaa_banner_dismissed'
} as const;

export const PATIENT_TYPE_OPTIONS: PatientType[] = ['Outpatient', 'Inpatient', 'Admitted'];

export const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say'];

export const MARITAL_STATUS_OPTIONS: MaritalStatus[] = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];

export const BLOOD_GROUP_OPTIONS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

export const EMERGENCY_RELATIONSHIPS = [
  'Parent',
  'Spouse',
  'Sibling',
  'Child',
  'Friend',
  'Guardian',
  'Other'
] as const;

export const SMOKING_STATUS_OPTIONS = ['Never', 'Former', 'Current', 'Not Specified'] as const;

export const INSURANCE_PROVIDERS = [
  'BlueCross BlueShield',
  'Aetna Healthcare',
  'UnitedHealthcare',
  'Cigna Health',
  'Humana Choice',
  'Kaiser Permanente',
  'Medicare Advantage',
  'Medicaid Standard',
  'Self-Pay / None'
];

export const PRIMARY_PHYSICIANS = [
  'Dr. Eleanor Vance, MD (Cardiology)',
  'Dr. Marcus Thorne, MD (Internal Medicine)',
  'Dr. Sarah Chen, MD (Pediatrics)',
  'Dr. Alan Montgomery, MD (Family Medicine)',
  'Dr. Priya Patel, DO (Endocrinology)',
  'Dr. Robert Sterling, MD (Neurology)'
];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  language: 'English (US)',
  timezone: 'UTC-05:00 (Eastern Time)',
  dateFormat: 'YYYY-MM-DD',
  emailNotifications: true,
  securityAlerts: true,
  patientUpdates: true,
  theme: 'light',
  sessionTimeoutMinutes: 30
};
