import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  transform(phone: string | undefined | null): string {
    if (!phone) return '—';
    return phone;
  }
}
