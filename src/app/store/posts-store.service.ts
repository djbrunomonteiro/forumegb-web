import { IPost } from './../interfaces/posts';
import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { catchError, firstValueFrom, mergeMap, of, tap } from 'rxjs';
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
  currentPost = signal<IPost | undefined>(undefined);
 
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

  getOneApi(slug: string){
    this.#metadataStoreService.setLoading('post', true);
    return this.#postServices.getOne(slug).pipe(
      tap(res => {
        this.#metadataStoreService.setLoading('post', false);
        const {results} = res
        if(!results){return }
        this.setMany([results]);
        this.currentPost.set(results);
      })
    )
  }

  setOneApi(post: IPost | Partial<IPost>, postFather?: IPost){
    this.#metadataStoreService.setLoading('post', true);
    return this.#postServices.createOne(post).pipe(
      tap(res => {
        this.#metadataStoreService.setLoading('post', false);
        const {results} = res
        if(!results){return }
        let newPost = results
        if(postFather){
          let newChildren = postFather.children ?? [];
          newChildren.push(newPost)
          newPost = {...postFather, children: newChildren}
        }

        this.setMany([newPost]);
      })
    )
  }

  editOneApi(post: Partial<IPost>){
    this.#metadataStoreService.setLoading('post', true);
    return this.#postServices.editOne(post).pipe(
      tap(res => {
        this.#metadataStoreService.setLoading('post', false);
        const {results} = res
        if(!results){return }
        this.setMany([results]);
      })
    )
  }


  async setCurrentPost(slug: string | undefined){
    if(!slug){return}
    const post = this.currentState().filter(post => post.slug === slug)[0] ?? undefined;
    this.currentPost.set(post);
    await firstValueFrom(this.getOneApi(slug));
  }


}
