import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from '../interfaces/user';
import dayjs from 'dayjs';

@Pipe({
  name: 'checkRecentPlanEligibility',
  standalone: true
})
export class CheckRecentPlanEligibilityPipe implements PipeTransform {

  transform(user: IUser) {
    const plan_start = user?.plan?.plan_start;
    if(!plan_start){return true}
    const current = dayjs(); // Data atual
    const planStartDate = dayjs(plan_start); // Data de início do plano
    const diffInDays = current.diff(planStartDate, 'day');
    return diffInDays >= 10;
  }

}
