import { ETypeStage } from './../enums/enums';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, delay, firstValueFrom, map, retry } from 'rxjs';
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


  getHome(start = 0, limit = 25){
    return this.#http.get(`${this.#baseUrl}/posts/home?start=${start}&limit=${limit}`)
    .pipe(
      retry(5),
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }

  search(type: string = '', term: string){
    return this.#http.get(`${this.#baseUrl}/posts/query?type=${type}&term=${term}`)
    .pipe(
      retry(5),
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }


  getAll(type: string = '', start = 1, limit = 200, order = 'recentes'){
    const params = type ? `type=${type}&start=${start}&limit=${limit}&order=${order}` : `start=${start}&limit=${limit}&order=${order}`
    return this.#http.get(`${this.#baseUrl}/posts?${params}`)
    .pipe(
      retry(5),
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

  getOne(slug: string, type: 'summary' | 'full' = 'full'){
    let url = (type === 'full') ? `${this.#baseUrl}/posts/search?slug=${slug}` : `${this.#baseUrl}/posts/summary?slug=${slug}`
    return this.#http.get(url)
    .pipe(
      retry(5),
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }

  createOne(post: IPost | Partial<IPost>, postFatherId?: number){
    return this.#http.post(`${this.#baseUrl}/posts?father=${postFatherId}`, post)
    .pipe(
      retry(5),
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }

  editOne(post: Partial<IPost>){
    return this.#http.patch(`${this.#baseUrl}/posts/${post.id}`, post)
    .pipe(
      retry(5),
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }

  saveLike(idUser: number, idPost: number){
    return this.#http.post(`${this.#baseUrl}/posts/like`, {idUser, idPost})
    .pipe(
      retry(5),
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }

  isAuthor(slug: string, owner_id: number){
    return this.#http.get(`${this.#baseUrl}/posts/${slug}/author/${owner_id}`)
    .pipe(
      retry(5),
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }
}
