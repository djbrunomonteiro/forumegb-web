import { Pipe, PipeTransform, signal } from '@angular/core';

@Pipe({
  name: 'convertSignal',
  standalone: true
})
export class ConvertSignalPipe implements PipeTransform {

  transform(value: any) {
    return signal(value);
  }

}
