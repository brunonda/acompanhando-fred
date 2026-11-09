import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-container',
  templateUrl: './notification-container.component.html',
  styles: [`
    .notification-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
      width: calc(100% - 3rem);
      pointer-events: none;
    }
    .notification {
      pointer-events: auto;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      margin-bottom: 0 !important;
    }
  `]
})
export class NotificationContainerComponent {
  notificationService = inject(NotificationService);
}
