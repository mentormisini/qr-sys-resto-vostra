// src/app/components/toaster/toaster.component.ts
import { Component } from '@angular/core';
import { ToastService } from '../toast.service';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
// src/app/models/toast.model.ts
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // in ms
}
@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div [ngClass]="toast.type" [@fadeInOut] class="toast">
          <span>{{ toast.message }}</span>
          <button class="close-btn" (click)="remove(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 9999;
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      padding: 1rem 1.5rem;
      border-radius: 4px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      min-width: 200px;
      max-width: 300px;
      will-change: opacity; /* optimized for fade animation */
    }
.success { 
  background: linear-gradient(135deg, #0dd14eff, #0c7965ff); /* green gradient */
}

.error { 
  background: linear-gradient(135deg, #f85032, #e73827); /* red gradient */
}

.info { 
  background: linear-gradient(135deg, #36d1dc, #5b86e5); /* blue gradient */
}

.warning { 
  background: linear-gradient(135deg, #f6d365, #fda085); /* orange gradient */
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem; /* bigger size */
  font-weight: bold;
  cursor: pointer;
  margin-left: 1rem; /* space from the message */
  line-height: 1; /* prevents extra vertical space */
}
  `]
})
export class ToasterComponent {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.toasts$.subscribe(toasts => this.toasts = toasts);
  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}
