import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {QRCodeComponent} from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-qr-section',
  imports: [
  ],
  templateUrl: './qr-section.html',
  styleUrl: './qr-section.scss'
})
export class QrSection {
  qrData = 'DISCOUNT-20%-ONCE-ONLY';
  @ViewChild('qrContainer', { static: false }) qrContainer!: ElementRef;
  http= inject(HttpClient)
  QrData:any;
  getQR():Observable<any>{
    return this.http.post(`http://localhost:3000/api/discount-qrcode`,{})
  }

  ngOnInit(){
    this.getQR().subscribe(resp=>{
      this.QrData = resp;
      this.triggerConfetti()
    })
  }


  triggerConfetti() {
    var end = Date.now() + (1000);


    const colors = ['#1e9304', '#e00909','#999'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }
}
