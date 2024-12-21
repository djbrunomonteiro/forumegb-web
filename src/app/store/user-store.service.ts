import { UserService } from './../services/user.service';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap, Observable } from 'rxjs';
import { MetadataStoreService } from './metadata-store.service';
import { IUser } from '../interfaces/user';
import { IResponse } from '../interfaces/response';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  #userService = inject(UserService);
  #metadataStoreService = inject(MetadataStoreService);
  #user = signal<IUser | undefined>(undefined);

  currentState = computed(() => this.#user());
  user$ = toObservable(this.currentState);

  getOne(email: string) {
    this.#metadataStoreService.setLoading('user', true);
    return this.#userService.getOne(email).pipe(
      tap(res => {
        const { error, results, message } = res;
        this.#metadataStoreService.setLoading('user', false);
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
