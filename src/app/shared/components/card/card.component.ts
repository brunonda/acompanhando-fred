import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styles: [`.h-100 { height: 100%; }`]
})
export class CardComponent {
  title = input<string>('');
  icon = input<string>('');
}
