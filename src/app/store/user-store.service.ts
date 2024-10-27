import { UserService } from './../services/user.service';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap, Observable } from 'rxjs';
import { MetadataStoreService } from './metadata-store.service';
import { IUser } from '../interfaces/user';
import { IResponse } from '../interfaces/response';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  #userService = inject(UserService);
  #metadataStoreService = inject(MetadataStoreService);
  #user = signal<IUser | undefined>(undefined);

  currentState = computed(() => this.#user());

  getOne(email: string) {
    return this.#userService.getOne(email).pipe(
      tap(res => {
        console.log(res);
        
        const { error, results, message } = res;

        this.#metadataStoreService.setError('user', error, message);
        if (error || !results) {return};
        this.setState(results);
      })
    );
  }

  setState(user: IUser | undefined){
    this.#user.set(user)
  }

  saveOne(user: IUser | Partial<IUser>){
    this.#metadataStoreService.setLoading('user', true);
    let request$: Observable<IResponse>;
    if(user.id){
      request$ = this.#userService.updateOne(user);
    }else{
      request$ = this.#userService.saveOne(user);
    }
    return request$.pipe(
      tap((res) => {
        const {error, results, message} = res;
        console.log(results);
        this.#metadataStoreService.setLoading('user', false);
        this.#metadataStoreService.setError('user', error, message);
        if(error){
          return 
        }
        this.setState(results);
    }),
  )
  }



}
