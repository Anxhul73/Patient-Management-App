import { Injectable, signal } from '@angular/core';
import { ToastNotification, ToastType } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<ToastNotification[]>([]);
  public toasts = this.toastsSignal.asReadonly();

  show(type: ToastType, title: string, message: string, durationMs: number = 4500): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastNotification = {
      id,
      type,
      title,
      message,
      durationMs,
      timestamp: Date.now()
    };

    this.toastsSignal.update((current) => [...current, newToast]);

    if (durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
    }

    return id;
  }

  success(title: string, message: string, durationMs: number = 4500): string {
    return this.show('success', title, message, durationMs);
  }

  error(title: string, message: string, durationMs: number = 6000): string {
    return this.show('error', title, message, durationMs);
  }

  warning(title: string, message: string, durationMs: number = 5000): string {
    return this.show('warning', title, message, durationMs);
  }

  info(title: string, message: string, durationMs: number = 4500): string {
    return this.show('info', title, message, durationMs);
  }

  dismiss(id: string): void {
    this.toastsSignal.update((current) => current.filter((t) => t.id !== id));
  }

  clearAll(): void {
    this.toastsSignal.set([]);
  }
}
