import { Component, inject, signal } from '@angular/core';
import { CardComponent } from '../../shared/components/card/card.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-home',
  imports: [CardComponent, ModalComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private notifications = inject(NotificationService);
  isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  notify() {
    this.notifications.show('Notificação de sucesso!', 'is-success');
  }
}
