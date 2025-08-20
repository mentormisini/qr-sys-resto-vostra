import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {ZXingScannerComponent, ZXingScannerModule} from '@zxing/ngx-scanner';
import {AdminService} from '../../services/admin.service';
import {NgClass} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-qr-reader',
  imports: [
    ZXingScannerModule,
    NgClass,
    TranslatePipe
  ],
  templateUrl: './qr-reader.html',
  styleUrl: './qr-reader.scss'
})
export class QrReader {
  @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;

  qrResult: string | null = null;
  serverMessage: string | null = null;
  successMessage: boolean | null = null;
  scanned = false;
  currentDevice: MediaDeviceInfo | undefined;

  constructor(private adminService: AdminService) {}

  onCodeResult(result: string) {
    if (this.scanned) return;
    this.scanned = true;

    this.qrResult = result;
    this.serverMessage = null;
    this.successMessage = null;

    this.adminService.readQR(this.qrResult).subscribe({
      next: (res: any) => {
        this.successMessage = res.success;
        this.serverMessage = res.message;
        if(res?.success){
          this.triggerConfetti();
        }
        this.stopCamera();
      },
      error: (err) => {
        this.successMessage = false;
        this.serverMessage = "Server error. Please try again.";
        console.error(err);

        this.stopCamera();
      }
    });
  }

  stopCamera() {
    if (this.scanner && this.scanner.scanStop) {
      this.scanner.scanStop(); // built-in stop method from ngx-scanner
    }
  }

  startCamera() {
    this.scanned = false;
    this.qrResult = null;
    this.serverMessage = null;
    this.successMessage = null;

    if (this.scanner && this.scanner.scanStart) {
      this.scanner.scanStart();
    }
  }

  triggerConfetti() {
    const end = Date.now() + 1000;

    // Italian flag colors
    const colors = ['#008C45', '#FFFFFF', '#CD212A'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 90,
        spread: 100,
        origin: { x: Math.random() },
        colors: colors,
        shapes: ['circle', 'square'],  // simple shapes
        gravity: 0.4,
        drift: 0.5,
        scalar: Math.random() * 0.8 + 0.5,
        ticks: 150
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

}
