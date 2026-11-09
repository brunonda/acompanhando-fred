import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NotificationContainerComponent } from './shared/components/notification-container/notification-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NotificationContainerComponent],
  templateUrl: './app.html'
})
export class App {}
