import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // URLs and methods where token should NOT be added
  private skipRequests = [
    { url: '/login', method: 'POST' },
    { url: '/api/daily-plate/', method: 'GET' },

    // add more if needed
  ];

  getToken(): string | null {
    const authData = localStorage.getItem('authToken');
    if (!authData) return null;

    try {
      const parsed = JSON.parse(authData);
      return parsed.accessToken || null;
    } catch (e) {
      console.error('Failed to parse authToken from localStorage', e);
      return null;
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if request URL and method should skip token
    const shouldSkip = this.skipRequests.some(
      r => req.url.includes(r.url) && req.method === r.method
    );

    if (shouldSkip) {
      return next.handle(req); // send request as is
    }

    const token = this.getToken();
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
