import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, catchError, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import { UtilService } from './util.service';
import { IResponse } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  #http = inject(HttpClient);
  #utils = inject(UtilService);
  #baseUrl = environment.apiUrl;

  isNewUser(email: any){
    return this.#http.post(`${this.#baseUrl}/users/isnew`, {email}).pipe(
      map((res) => res as IResponse)
    );
  }

  saveOne(user: any){
    return this.#http.post(`${this.#baseUrl}/users`, user).pipe(
      map((res) => res as IResponse)
    );

  }

  getOne(email: string){
    return this.#http.get(`${this.#baseUrl}/users/search?email=${email}`)
    .pipe(
      map(this.#utils.successExtract),
      catchError(this.#utils.errorExtract),
      delay(3000)
    );
  }
}
