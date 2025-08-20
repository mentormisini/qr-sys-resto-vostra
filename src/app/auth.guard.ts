import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const language = localStorage.getItem('authToken');

    if (language) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
