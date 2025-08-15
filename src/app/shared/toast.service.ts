// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// src/app/models/toast.model.ts
export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number; // in ms
}


@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
    toasts$ = this.toastsSubject.asObservable();
    private counter = 0;

    show(message: string, type: Toast['type'] = 'info', duration = 3000) {
        const toast: Toast = {
            id: ++this.counter,
            message,
            type,
            duration
        };

        this.toastsSubject.next([...this.toastsSubject.value, toast]);

        setTimeout(() => this.remove(toast.id), duration);
    }

    remove(id: number) {
        this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
    }
}
