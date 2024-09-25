import { Injectable } from '@angular/core';
import { IResponse } from '../interfaces/response';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  successExtract(res: any){
    const response: IResponse = {error: false, results: res?.results ?? undefined, message: res?.message}
    return response;
    ;
  }

  errorExtract(res: any){
    const response: IResponse = {error: true, results: res?.results ?? undefined, message: res?.message}
    return of(response);

  }
}
