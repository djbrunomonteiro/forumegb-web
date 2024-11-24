import { UtilService } from './../services/util.service';
import { IPost } from './../interfaces/posts';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, mergeMap, of, tap, map } from 'rxjs';
import { PostService } from '../services/post.service';
import { MetadataStoreService } from './metadata-store.service';
import { ETypeStage } from '../enums/enums';

@Injectable({
  providedIn: 'root'
})
export class PostsStoreService {

  #postServices = inject(PostService);
  #metadataStoreService = inject(MetadataStoreService);
  #utils = inject(UtilService);
  #posts = signal<IPost[]>([]);

  currentState = computed(() => this.#posts());
  mainStageState = computed(() => this.#posts().filter(elem => elem.parent_id === null && elem.type_stage === ETypeStage.MAINSTAGE));
  floorStageState = computed(() => this.#posts().filter(elem => elem.parent_id === null && elem.type_stage === ETypeStage.FLOORSTAGE));
  backStageState = computed(() => this.#posts().filter(elem => elem.parent_id === null && elem.type_stage === ETypeStage.BACKSTAGE));
  currentPost = signal<IPost | undefined>(undefined);
  homeState = signal<any>(undefined);

  getHome(){
    this.#metadataStoreService.setLoading('post', true);
    return this.#postServices.getHome().pipe(
      tap(res => {
        this.#metadataStoreService.setLoading('post', false);
        const {results} = res
        if(!results){return }
        this.homeState.set(results)
      })

    )

  }
 
  getAllAPI(type = '' ,start = 1, limit = 200, order = 'recentes',){
    return this.#postServices.getRecordsTotal().pipe(
      mergeMap((res ) => {
        const countPostsParent = this.#posts().filter(elem => elem.parent_id === null).length;
        const {error, results} = res;
        if(!error && countPostsParent !== 0 && countPostsParent  === results.recordsTotal){
          return of({error: false, results: this.#utils.sortArrayByKey(this.#posts(), 'id', 'desc') }) 
        }

        this.#metadataStoreService.setLoading('post', true)
        return this.#postServices.getAll(type, start, limit, order).pipe(
          tap(res => {
            this.#metadataStoreService.setLoading('post', false);
            const {results} = res
            if(!results){return }
            this.setMany(results);
          })
        )

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

  setOneApi(post: IPost | Partial<IPost>, postFatherId?: number){
    this.#metadataStoreService.setLoading('post', true);
    return this.#postServices.createOne(post, postFatherId).pipe(
      tap(res => {
        this.#metadataStoreService.setLoading('post', false);
        const {results} = res
        if(!results){return }
        this.setMany([results]);
        this.setCurrentPost(results?.slug);
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


  async setCurrentPost(slug: string | undefined, ignoreLoad = false){
    if(!slug){return}
    const post = this.currentState().filter(post => post.id && post.slug === slug)[0] ?? undefined;
    this.currentPost.set(post);
    if(ignoreLoad){return}
    await firstValueFrom(this.getOneApi(slug));
  }

  setLike(idUser: number, idPost: number){
    return this.#postServices.saveLike(idUser, idPost)
  }


}
