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
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }

  getRecordsTotal(){
    return this.#http.get(`${this.#baseUrl}/posts/total`)
    .pipe(
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }

  getOne(slug: string){
    return this.#http.get(`${this.#baseUrl}/posts/search?slug=${slug}`)
    .pipe(
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }

  createOne(post: IPost | Partial<IPost>, postFatherId?: number){
    return this.#http.post(`${this.#baseUrl}/posts?father=${postFatherId}`, post)
    .pipe(
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }

  editOne(post: Partial<IPost>){
    return this.#http.patch(`${this.#baseUrl}/posts/${post.id}`, post)
    .pipe(
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }

  saveLike(idUser: number, idPost: number){
    return this.#http.post(`${this.#baseUrl}/posts/like`, {idUser, idPost})
    .pipe(
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }
  
}
