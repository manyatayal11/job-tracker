import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { extractError } from './api-error';
import {
  Application,
  ApplicationRequest,
  ApplicationService,
  STATUSES,
  Status,
} from './application.service';
import { AuthService } from './auth.service';

function emptyForm() {
  return {
    company: '',
    role: '',
    status: 'APPLIED' as Status,
    appliedDate: '',
    source: '',
    notes: '',
  };
}

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  template: `
    <div class="page">
      <div class="topbar">
        <h2>Welcome, {{ auth.getName() }}</h2>
        <div>
          <button (click)="openForm()">+ Add application</button>
          <button class="secondary" (click)="logout()">Log out</button>
        </div>
      </div>

      @if (error()) { <p class="error">{{ error() }}</p> }

      @if (showForm()) {
        <form class="form-box" (ngSubmit)="save()">
          <h3>{{ editingId() ? 'Edit application' : 'New application' }}</h3>
          <div class="form-grid">
            <input name="company" placeholder="Company *" [(ngModel)]="form.company" required />
            <input name="role" placeholder="Role *" [(ngModel)]="form.role" required />
            <select name="status" [(ngModel)]="form.status">
              @for (s of statuses; track s.value) {
                <option [value]="s.value">{{ s.label }}</option>
              }
            </select>
            <input type="date" name="appliedDate" [(ngModel)]="form.appliedDate" />
            <input name="source" placeholder="Source (Referral, Portal...)" [(ngModel)]="form.source" />
            <input name="notes" placeholder="Notes" [(ngModel)]="form.notes" />
          </div>
          <div>
            <button type="submit" [disabled]="saving()">{{ saving() ? 'Saving...' : 'Save' }}</button>
            <button type="button" class="secondary" (click)="closeForm()">Cancel</button>
          </div>
        </form>
      }

      <div class="board">
        @for (s of statuses; track s.value) {
          <div class="column">
            <h4>{{ s.label }} ({{ forStatus(s.value).length }})</h4>
            @for (app of forStatus(s.value); track app.id) {
              <div class="app-card">
                <strong>{{ app.company }}</strong>
                <span>{{ app.role }}</span>
                @if (app.appliedDate) { <small>Applied: {{ app.appliedDate }}</small> }
                @if (app.source) { <small>Source: {{ app.source }}</small> }
                @if (app.notes) { <small>{{ app.notes }}</small> }
                <select (change)="changeStatus(app, $any($event.target).value)">
                  @for (opt of statuses; track opt.value) {
                    <option [value]="opt.value" [selected]="opt.value === app.status">{{ opt.label }}</option>
                  }
                </select>
                <div class="card-actions">
                  <button class="small" (click)="edit(app)">Edit</button>
                  <button class="small danger" (click)="remove(app)">Delete</button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private router = inject(Router);
  private api = inject(ApplicationService);

  statuses = STATUSES;
  applications = signal<Application[]>([]);
  error = signal('');
  showForm = signal(false);
  saving = signal(false);
  editingId = signal<number | null>(null);
  form = emptyForm();

  ngOnInit() {
    this.api.getAll().subscribe({
      next: (list) => this.applications.set(list),
      error: (err) => this.error.set(extractError(err)),
    });
  }

  forStatus(status: Status) {
    return this.applications().filter((a) => a.status === status);
  }

  openForm() {
    this.form = emptyForm();
    this.editingId.set(null);
    this.error.set('');
    this.showForm.set(true);
  }

  edit(app: Application) {
    this.form = {
      company: app.company,
      role: app.role,
      status: app.status,
      appliedDate: app.appliedDate ?? '',
      source: app.source ?? '',
      notes: app.notes ?? '',
    };
    this.editingId.set(app.id);
    this.error.set('');
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  save() {
    const body: ApplicationRequest = {
      company: this.form.company.trim(),
      role: this.form.role.trim(),
      status: this.form.status,
      appliedDate: this.form.appliedDate || null,
      source: this.form.source.trim() || null,
      notes: this.form.notes.trim() || null,
    };
    const id = this.editingId();
    const request = id ? this.api.update(id, body) : this.api.create(body);

    this.error.set('');
    this.saving.set(true);
    request.subscribe({
      next: (saved) => {
        this.applications.update((list) =>
          id ? list.map((a) => (a.id === id ? saved : a)) : [...list, saved]
        );
        this.saving.set(false);
        this.closeForm();
      },
      error: (err) => {
        this.error.set(extractError(err));
        this.saving.set(false);
      },
    });
  }

  changeStatus(app: Application, status: Status) {
    const { id, ...body } = app;
    this.api.update(id, { ...body, status }).subscribe({
      next: (saved) =>
        this.applications.update((list) => list.map((a) => (a.id === id ? saved : a))),
      error: (err) => this.error.set(extractError(err)),
    });
  }

  remove(app: Application) {
    if (!confirm(`Delete ${app.company} - ${app.role}?`)) return;
    this.api.remove(app.id).subscribe({
      next: () => this.applications.update((list) => list.filter((a) => a.id !== app.id)),
      error: (err) => this.error.set(extractError(err)),
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}