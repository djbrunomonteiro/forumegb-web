import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { map, catchError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  #http = inject(HttpClient);
  #utils = inject(UtilService);
  #baseUrl = environment.apiUrl;
  platformId = inject(PLATFORM_ID);
  #sdkMP: any;

  constructor(){
    this.initMP();
  }
  
  private async initMP(){
    if(!isPlatformBrowser(this.platformId)){return}
    this.#sdkMP = (window as any).mercadoPagoInstance;
  }

  getPref(form: any){
    return this.#http.post(`${this.#baseUrl}/payment`, form)
    .pipe(
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }


  initCheckout(preferenceId: string) {
    this.#sdkMP.checkout({
      preference: {
        id: preferenceId,
      },
      autoOpen: true,
    });
  }
}
