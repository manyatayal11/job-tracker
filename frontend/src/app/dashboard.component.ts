import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="card">
      <h2>Welcome, {{ auth.getName() }}</h2>
      <p>Your applications will appear here soon.</p>
      <button (click)="logout()">Log out</button>
    </div>
  `,
})
export class DashboardComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}