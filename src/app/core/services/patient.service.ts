import { Injectable, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject, of, delay } from 'rxjs';
import {
  Patient,
  PatientStatus
} from '../models/patient.model';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/app.constants';
import { MOCK_PATIENTS_DATA } from '../constants/mock-patients.data';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  public patients$ = this.patientsSubject.asObservable();

  private patientsSignal = signal<Patient[]>([]);
  public patients = this.patientsSignal.asReadonly();

  public totalCount = computed(() => this.patientsSignal().length);
  public activeCount = computed(() => this.patientsSignal().filter((p) => p.status === 'Active').length);
  public inactiveCount = computed(() => this.patientsSignal().filter((p) => p.status === 'Inactive').length);

  constructor(
    private storage: StorageService,
    private toastService: ToastService
  ) {
    this.initializePatients();
  }

  private initializePatients(): void {
    const saved = this.storage.getLocal<Patient[]>(STORAGE_KEYS.PATIENTS, []);
    if (saved && saved.length > 0) {
      this.updateState(saved);
    } else {
      this.updateState(MOCK_PATIENTS_DATA);
      this.storage.setLocal(STORAGE_KEYS.PATIENTS, MOCK_PATIENTS_DATA);
    }
  }

  private updateState(patients: Patient[]): void {
    this.patientsSignal.set(patients);
    this.patientsSubject.next(patients);
    this.storage.setLocal(STORAGE_KEYS.PATIENTS, patients);
  }

  getPatients(): Observable<Patient[]> {
    return this.patients$;
  }

  getPatientById(id: string): Patient | undefined {
    return this.patientsSignal().find((p) => p.id.toLowerCase() === id.toLowerCase());
  }

  createPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'activities'>): Promise<Patient> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const nextNumber = 1000 + this.patientsSignal().length + 1;
        const newId = `PAT-${nextNumber}`;
        const now = new Date().toISOString();

        const newPatient: Patient = {
          ...patientData,
          id: newId,
          createdAt: now,
          updatedAt: now,
          activities: [
            {
              id: `ACT-${Date.now()}`,
              action: 'Created',
              description: 'Patient record created in MediCare360 onboarding wizard.',
              timestamp: now,
              performedBy: 'Admin (System)'
            }
          ]
        };

        const updated = [newPatient, ...this.patientsSignal()];
        this.updateState(updated);
        this.toastService.success('Patient Created', `${newPatient.firstName} ${newPatient.lastName} (${newId}) was registered successfully.`);
        resolve(newPatient);
      }, 400);
    });
  }

  updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const currentList = this.patientsSignal();
        const index = currentList.findIndex((p) => p.id.toLowerCase() === id.toLowerCase());

        if (index === -1) {
          this.toastService.error('Update Failed', `Patient record ${id} was not found.`);
          reject(new Error('Patient not found'));
          return;
        }

        const now = new Date().toISOString();
        const existing = currentList[index];

        const updatedPatient: Patient = {
          ...existing,
          ...updates,
          id: existing.id, // Preserve ID
          createdAt: existing.createdAt,
          updatedAt: now,
          activities: [
            {
              id: `ACT-${Date.now()}`,
              action: 'Updated',
              description: 'Patient record details updated by clinical staff.',
              timestamp: now,
              performedBy: 'Admin (Staff)'
            },
            ...(existing.activities || [])
          ]
        };

        const updatedList = [...currentList];
        updatedList[index] = updatedPatient;
        this.updateState(updatedList);

        this.toastService.success('Patient Updated', `Record for ${updatedPatient.firstName} ${updatedPatient.lastName} was saved.`);
        resolve(updatedPatient);
      }, 400);
    });
  }

  togglePatientStatus(id: string): Promise<Patient> {
    return new Promise((resolve, reject) => {
      const currentList = this.patientsSignal();
      const patient = currentList.find((p) => p.id.toLowerCase() === id.toLowerCase());

      if (!patient) {
        this.toastService.error('Error', 'Patient record not found.');
        reject(new Error('Patient not found'));
        return;
      }

      const newStatus: PatientStatus = patient.status === 'Active' ? 'Inactive' : 'Active';
      const actionText = newStatus === 'Active' ? 'Activated' : 'Deactivated';

      this.updatePatient(id, { status: newStatus }).then((updated) => {
        this.toastService.info(`Patient ${actionText}`, `${patient.firstName} ${patient.lastName} status changed to ${newStatus}.`);
        resolve(updated);
      });
    });
  }

  deletePatient(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const patient = this.getPatientById(id);
        const filtered = this.patientsSignal().filter((p) => p.id.toLowerCase() !== id.toLowerCase());
        this.updateState(filtered);

        if (patient) {
          this.toastService.warning('Patient Deleted', `Record for ${patient.firstName} ${patient.lastName} (${id}) has been removed.`);
        }
        resolve(true);
      }, 300);
    });
  }

  getRecentPatients(limit: number = 5): Patient[] {
    return [...this.patientsSignal()]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }

  resetToMockData(): void {
    this.updateState(MOCK_PATIENTS_DATA);
    this.toastService.info('Dataset Reset', 'Synthetic patient database restored to default mock data.');
  }

  exportToJSON(): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.patientsSignal(), null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `medicare360_patients_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.toastService.success('Export Successful', 'Patient records exported as JSON.');
  }

  exportToCSV(): void {
    const patients = this.patientsSignal();
    const headers = ['Patient ID', 'First Name', 'Last Name', 'Type', 'DOB', 'Gender', 'Phone', 'Email', 'Status', 'Insurance', 'Physician', 'Created At'];
    
    const rows = patients.map((p) => [
      `"${p.id}"`,
      `"${p.firstName}"`,
      `"${p.lastName}"`,
      `"${p.patientType || 'Outpatient'}"`,
      `"${p.dateOfBirth}"`,
      `"${p.gender}"`,
      `"${p.contact?.phone || ''}"`,
      `"${p.contact?.email || ''}"`,
      `"${p.status}"`,
      `"${p.medical?.insuranceProvider || ''}"`,
      `"${p.medical?.primaryPhysician || ''}"`,
      `"${p.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `medicare360_patients_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.toastService.success('Export Successful', 'Patient records exported as CSV.');
  }
}
