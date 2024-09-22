import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, AdditionalUserInfo,  } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { IResponse } from '../interfaces/response';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #http = inject(HttpClient);
  #auth = inject(Auth);
  #googleAuthProvider = new GoogleAuthProvider();

  #baseUrl = environment.apiUrl;

  async signInWithPopup(){
     return signInWithPopup(this.#auth, this.#googleAuthProvider)
  }

  isNewUser(email: any){
    return this.#http.post(`${this.#baseUrl}/user/isnew`, {email}).pipe(
      map((res) => res as IResponse)
    );
  }

  saveOne(user: any){
    return this.#http.post(`${this.#baseUrl}/user`, user).pipe(
      map((res) => res as IResponse)
    );

  }

  async getToken(){
    
    return (await this.#auth.currentUser?.getIdTokenResult())?.token

  }
}
