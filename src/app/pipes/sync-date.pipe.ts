import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Pipe({
  name: 'syncDate',
  standalone: true
})
export class SyncDatePipe implements PipeTransform {

  transform(value: any) {
    if(dayjs(value).isValid()){
      value = dayjs.utc(value).subtract(6, 'hour').format('DD/MM/YY HH:mm');
    }
    return value;
  }

}
