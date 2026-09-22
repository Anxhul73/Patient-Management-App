import { Injectable, signal } from '@angular/core';
import { ConfirmDialogOptions } from '../models/notification.model';

export interface ActiveConfirmDialog {
  options: ConfirmDialogOptions;
  resolve: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private activeDialogSignal = signal<ActiveConfirmDialog | null>(null);
  public activeDialog = this.activeDialogSignal.asReadonly();

  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.activeDialogSignal.set({
        options: {
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          type: 'primary',
          ...options
        },
        resolve: (result: boolean) => {
          this.activeDialogSignal.set(null);
          resolve(result);
        }
      });
    });
  }

  handleConfirm(): void {
    const dialog = this.activeDialogSignal();
    if (dialog) {
      dialog.resolve(true);
    }
  }

  handleCancel(): void {
    const dialog = this.activeDialogSignal();
    if (dialog) {
      dialog.resolve(false);
    }
  }
}
