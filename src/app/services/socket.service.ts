import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, share } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationSocketService {
  private socket: Socket;
  private reservationCreated$: Observable<any>;

  constructor() {
    this.socket = io('wss://nostraitalia.ch', {
      transports: ['websocket'],
      autoConnect: false,
    });

    // Create a shared observable for reservation events
    this.reservationCreated$ = new Observable((subscriber) => {
      this.socket.on('reservationCreated', (data) => {
        subscriber.next(data);
      });
    }).pipe(share()); // ensures multiple subscribers share one listener
  }

  connect(): void {
    this.socket.connect();
  }

  onReservationCreated(): Observable<any> {
    return this.reservationCreated$;
  }

  sendMessage(event: string, payload: any) {
    this.socket.emit(event, payload);
  }
}
