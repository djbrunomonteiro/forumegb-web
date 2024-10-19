import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  #http = inject(HttpClient);
  #baseUrl = environment.apiUrl;
  #utils = inject(UtilService);

  constructor() { }

  savePreview(file: File, start = 0, end = 30): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('start', String(start));
    formData.append('end', String(end));
    return this.#http.post(`${this.#baseUrl}/preview`, formData)
    .pipe(
      map((res) => this.#utils.successExtract(res)),
      catchError((err) => this.#utils.errorExtract(err)),
    );
  }

  getPreview(id: string){
    return this.#http.get(`${this.#baseUrl}/preview?id=${id}`, { responseType: 'blob' })

  }
}
