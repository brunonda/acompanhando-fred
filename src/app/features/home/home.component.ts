import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/components/card/card.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-home',
  imports: [CardComponent, ModalComponent, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  isModalOpen = signal(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}