import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { extractError } from './api-error';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card">
      <h2>Log in</h2>
      <form (ngSubmit)="submit()">
        <input type="email" name="email" placeholder="Email" [(ngModel)]="email" required />
        <input type="password" name="password" placeholder="Password" [(ngModel)]="password" required />
        @if (error) { <p class="error">{{ error }}</p> }
        <button type="submit" [disabled]="loading">{{ loading ? 'Logging in...' : 'Log in' }}</button>
      </form>
      <p>New here? <a routerLink="/register">Create an account</a></p>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  loading = false;

  submit() {
    this.error = '';
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/applications']),
      error: (err) => {
        this.error = extractError(err);
        this.loading = false;
      },
    });
  }
}