import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  isMenuOpen = signal(false);
  isDark = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleTheme() {
    this.isDark.update(dark => {
      const next = !dark;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      return next;
    });
  }
}
