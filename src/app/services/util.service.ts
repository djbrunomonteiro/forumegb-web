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
    const results = this.paramsJsonParse(res.results);
    const response: IResponse = {error: false, results, message: res?.message}
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

  sortArrayByKey<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return array.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
  
      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  paramsJsonParse(itemRef: any[] | object): any[] | object {
    let result;
    if (!itemRef) {
      return itemRef;
    }
    if (Array.isArray(itemRef)) {
      result = itemRef.map((elem) => this.checkParamIsJson(elem));
    } else if (typeof itemRef === 'object') {
      result = this.checkParamIsJson(itemRef);
    } else {
      return itemRef;
    }

    return result;
  }

  checkParamIsJson(item: any) {
    for (const key in item) {
      if (this.validJsonStr(item[key])) {
        item[key] = JSON.parse(item[key]);
      }
    }
    return item;
  }

  validJsonStr(str: any) {
    if (str === null || str === 'null') return false;
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

}
