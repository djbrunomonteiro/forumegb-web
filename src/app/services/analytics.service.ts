import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import {Analytics, logEvent } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  #platformId = inject(PLATFORM_ID);

  analytics = inject(Analytics);


  setLog(name: string, opts: any){
    if(isPlatformBrowser(this.#platformId)){
      logEvent(this.analytics, name, opts);

    }
  }
}
