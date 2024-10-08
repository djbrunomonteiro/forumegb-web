import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, delay, map } from 'rxjs';
import { IResponse } from '../interfaces/response';
import { UtilService } from './util.service';
import { IPost } from '../interfaces/posts';

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
    );
  }

  getOne(slug: string){
    return this.#http.get(`${this.#baseUrl}/posts/search?slug=${slug}`)
    .pipe(
      map(this.#utils.successExtract),
      catchError(this.#utils.errorExtract),
    );
  }

  createOne(post: IPost | Partial<IPost>, postFatherId?: number){
    return this.#http.post(`${this.#baseUrl}/posts?father=${postFatherId}`, post)
    .pipe(
      map(this.#utils.successExtract),
      catchError(this.#utils.errorExtract),
    );
  }

  editOne(post: Partial<IPost>){
    return this.#http.patch(`${this.#baseUrl}/posts/${post.id}`, post)
    .pipe(
      map(this.#utils.successExtract),
      catchError(this.#utils.errorExtract),
    );
  }
  
}
