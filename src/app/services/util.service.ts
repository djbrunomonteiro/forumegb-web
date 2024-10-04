import { inject, Injectable } from '@angular/core';
import { IResponse } from '../interfaces/response';
import { of } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  #snackBar = inject(MatSnackBar)

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

  showMsg(msg: string = '', action= 'X', config: MatSnackBarConfig = {duration: 4000, panelClass: 'default-snackbar'}){
    this.#snackBar.open(msg, action, config)
  }
}
