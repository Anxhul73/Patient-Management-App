import { Injectable, signal, computed } from '@angular/core';
import { AppNotification } from '../models/notification.model';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/app.constants';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-1',
    title: 'New Patient Intake',
    message: '5 new patient registrations completed today in Endocrinology & Cardiology.',
    type: 'success',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    isRead: false,
    actionUrl: '/patients'
  },
  {
    id: 'NOTIF-2',
    title: 'Clinical Record Updated',
    message: 'Dr. Vance updated the medication protocol for Arthur Pendleton (PAT-1007).',
    type: 'info',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isRead: false,
    actionUrl: '/patients/PAT-1007'
  },
  {
    id: 'NOTIF-3',
    title: 'Critical Lab Review Required',
    message: '12 patient records require primary physician review before discharge.',
    type: 'alert',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    isRead: false,
    actionUrl: '/patients'
  },
  {
    id: 'NOTIF-4',
    title: 'Scheduled System Maintenance',
    message: 'Demo environment security patch scheduled for Sunday 02:00 AM UTC.',
    type: 'warning',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    isRead: true
  }
];

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<AppNotification[]>([]);
  public notifications = this.notificationsSignal.asReadonly();

  public unreadCount = computed(() => {
    return this.notificationsSignal().filter((n) => !n.isRead).length;
  });

  constructor(private storage: StorageService) {
    const saved = this.storage.getLocal<AppNotification[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      INITIAL_NOTIFICATIONS
    );
    this.notificationsSignal.set(saved);
  }

  markAsRead(id: string): void {
    this.notificationsSignal.update((list) => {
      const updated = list.map((item) => (item.id === id ? { ...item, isRead: true } : item));
      this.storage.setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  }

  markAllAsRead(): void {
    this.notificationsSignal.update((list) => {
      const updated = list.map((item) => ({ ...item, isRead: true }));
      this.storage.setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  }

  deleteNotification(id: string): void {
    this.notificationsSignal.update((list) => {
      const updated = list.filter((item) => item.id !== id);
      this.storage.setLocal(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  }
}
