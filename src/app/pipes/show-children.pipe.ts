import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showChildren',
  standalone: true
})
export class ShowChildrenPipe implements PipeTransform {

  transform(children: any[]): unknown {
    return null;
  }

}
