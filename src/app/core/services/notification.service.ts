import { Injectable, signal } from '@angular/core';

export interface AppNotification {
  id: number;
  message: string;
  type?: 'is-primary' | 'is-link' | 'is-info' | 'is-success' | 'is-warning' | 'is-danger';
  durationMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private nextId = 1;
  notifications = signal<AppNotification[]>([]);

  show(message: string, type: AppNotification['type'] = 'is-info', durationMs = 4000) {
    const id = this.nextId++;
    const notification: AppNotification = { id, message, type, durationMs };

    this.notifications.update(list => [...list, notification]);

    if (durationMs > 0) {
      setTimeout(() => this.dismiss(id), durationMs);
    }
  }

  dismiss(id: number) {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }
}
