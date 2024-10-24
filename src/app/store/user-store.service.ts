import { UserService } from './../services/user.service';
import { computed, inject, Injectable, signal } from '@angular/core';
import { mergeMap, of, catchError, take, tap } from 'rxjs';
import { IPost } from '../interfaces/posts';
import { PostService } from '../services/post.service';
import { MetadataStoreService } from './metadata-store.service';
import { IUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  #userService = inject(UserService);
  #metadataStoreService = inject(MetadataStoreService);
  #user = signal<IUser | undefined>(undefined);

  currentState = computed(() => this.#user());

  getOne(email: string){
    return this.#userService.getOne(email).pipe(
      tap(res => {
        const {results} = res
        if(!results){return }
        this.setState(results);
      })
    )
  }

  setState(user: IUser | undefined){
    this.#user.set(user)
  }

  saveOne(user: IUser | Partial<IUser>){
    return this.#userService.saveOne(user).pipe(
      tap((res) => {
        const {error, results} = res;
        if(error){return}
        this.setState(results)
    }))
  }
}
