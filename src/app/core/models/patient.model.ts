export type PatientStatus = 'Active' | 'Inactive';

export type PatientType = 'Inpatient' | 'Outpatient' | 'Admitted';

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Separated';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';

export interface Allergy {
  id?: string;
  name: string;
  severity?: 'Mild' | 'Moderate' | 'Severe';
}

export interface Medication {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
}

export interface Vitals {
  bloodPressure?: string;
  heightCm?: number | null;
  weightKg?: number | null;
  bmi?: number | null;
  pulseRate?: number | null;
  temperature?: number | null;
}

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  alternatePhone?: string;
  address: Address;
}

export interface MedicalInfo {
  primaryPhysician: string;
  insuranceProvider: string;
  insuranceId: string;
  allergies: Allergy[];
  currentMedications: Medication[];
  existingConditions: string[];
  vitals: Vitals;
  smokingStatus: 'Never' | 'Former' | 'Current' | 'Not Specified';
  emergencyMedicalNotes?: string;
}

export interface EmergencyContact {
  firstName: string;
  lastName: string;
  relationship: 'Parent' | 'Spouse' | 'Sibling' | 'Child' | 'Friend' | 'Guardian' | 'Other';
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
}

export interface PatientActivity {
  id: string;
  action: 'Created' | 'Updated' | 'Status Changed' | 'Note Added';
  description: string;
  timestamp: string;
  performedBy: string;
}

export interface Patient {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  patientType?: PatientType;
  maritalStatus: MaritalStatus;
  bloodGroup?: BloodGroup;
  nationality: string;
  preferredLanguage: string;
  profilePhoto?: string;
  contact: ContactInfo;
  medical: MedicalInfo;
  emergencyContact: EmergencyContact;
  status: PatientStatus;
  createdAt: string;
  updatedAt: string;
  activities?: PatientActivity[];
}

export interface PatientFilterCriteria {
  searchQuery: string;
  status: 'All' | 'Active' | 'Inactive';
  patientType?: 'All' | PatientType;
  gender: 'All' | Gender;
  ageGroup: 'All' | '0-18' | '19-30' | '31-45' | '46-60' | '61-75' | '76+';
}

export interface PatientSortCriteria {
  column: keyof Patient | 'name' | 'lastUpdated';
  direction: 'asc' | 'desc';
}
