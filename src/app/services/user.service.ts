import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, catchError, delay, retry } from 'rxjs';
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
      retry(5),
      map((res) => res as IResponse)
    );
  }

  saveOne(user: any){
    return this.#http.post(`${this.#baseUrl}/users`, user).pipe(
      retry(5),
      map((res) => res as IResponse)
    );

  }

  updateOne(user: any){
    return this.#http.patch(`${this.#baseUrl}/users/${user.id}`, user).pipe(
      retry(5),
      map((res) => res as IResponse)
    );

  }

  getOne(email: string){
    return this.#http.get(`${this.#baseUrl}/users/search?email=${email}`)
    .pipe(
      retry(5), // Tenta a requisição novamente até três vezes em caso de erro
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }
}
