import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'utcTime'
})
export class UtcTimePipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';

    const date = new Date(value);
    // Get the UTC hours, minutes, and seconds
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');


    // Format: HH:mm:ss
    return `${hours}:${minutes}`;
  }
}
