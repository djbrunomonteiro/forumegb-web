import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, delay, map } from 'rxjs';
import { IResponse } from '../interfaces/response';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  #http = inject(HttpClient);
  #utils = inject(UtilService);
  #baseUrl = environment.apiUrl;

  getAll(start = 1, limit = 50){
    return this.#http.get(`${this.#baseUrl}/posts?start=${start}&limit=${limit}`)
    .pipe(
      map(this.#utils.successExtract),
      catchError(this.#utils.errorExtract),
      delay(3000)
    );
  }
  
}
