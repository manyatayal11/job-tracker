import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { extractError } from './api-error';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card">
      <h2>Create account</h2>
      <form (ngSubmit)="submit()">
        <input type="text" name="name" placeholder="Name" [(ngModel)]="name" required />
        <input type="email" name="email" placeholder="Email" [(ngModel)]="email" required />
        <input type="password" name="password" placeholder="Password (min 8 characters)" [(ngModel)]="password" required />
        @if (error) { <p class="error">{{ error }}</p> }
        <button type="submit" [disabled]="loading">{{ loading ? 'Creating...' : 'Register' }}</button>
      </form>
      <p>Already have an account? <a routerLink="/login">Log in</a></p>
    </div>
  `,
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  submit() {
    this.error = '';
    this.loading = true;
    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/applications']),
      error: (err) => {
        this.error = extractError(err);
        this.loading = false;
      },
    });
  }
}