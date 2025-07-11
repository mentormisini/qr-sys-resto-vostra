import {Component, ElementRef, ViewChild} from '@angular/core';
import {QRCodeComponent} from 'angularx-qrcode';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-qr-section',
  imports: [
    QRCodeComponent
  ],
  templateUrl: './qr-section.html',
  styleUrl: './qr-section.scss'
})
export class QrSection {
  qrData = 'DISCOUNT-20%-ONCE-ONLY';
  @ViewChild('card', { static: false }) card!: ElementRef;

  saveScreenshot() {
    if (!this.card) return;

    html2canvas(this.card.nativeElement).then(canvas => {
      canvas.toBlob(blob => {
        if (!blob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'discount-card.png';
        link.click();
        URL.revokeObjectURL(link.href);
      });
    });
  }
}
