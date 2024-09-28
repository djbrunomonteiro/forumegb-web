import { IPost } from './../interfaces/posts';
import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { catchError, mergeMap, of, tap } from 'rxjs';
import { PostService } from '../services/post.service';
import { MetadataStoreService } from './metadata-store.service';

@Injectable({
  providedIn: 'root'
})
export class PostsStoreService {

  #postServices = inject(PostService);
  #metadataStoreService = inject(MetadataStoreService);
  #posts = signal<IPost[]>([]);

  currentState = computed(() => this.#posts());


  getAllAPI(start = 1, limit = 50){
    this.#metadataStoreService.setLoading('post', true)
    return this.#postServices.getAll(start, limit).pipe(
      tap(res => {
        this.#metadataStoreService.setLoading('post', false);
        console.log(res);
        
        const {results} = res
        if(!results){return }
        this.setMany(results);
      })
    )
  }

  setMany(newPosts: IPost[]){
    if(!newPosts.length){return}
    this.#posts.update(currentState => {
      let newState = [...currentState, ...newPosts]; //merge
      newState = Array.from(new Map(newState.map(item => [item['id'], item])).values()); //remove duplicados
      return newState
    })
  }


}
