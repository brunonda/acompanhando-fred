import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  title = input<string>('Modal');
  closed = output<void>();

  onClose() {
    this.closed.emit();
  }
}
