import { UtilService } from './../services/util.service';
import { IPost } from './../interfaces/posts';
import { computed, inject, Injectable, signal } from '@angular/core';
import { delay, filter, first, firstValueFrom, from, of, tap } from 'rxjs';
import { PostService } from '../services/post.service';
import { MetadataStoreService } from './metadata-store.service';
import { ETypeStage } from '../enums/enums';
import dayjs from 'dayjs';
import { IResponse } from '../interfaces/response';

@Injectable({
  providedIn: 'root'
})
export class PostsStoreService {

  #postServices = inject(PostService);
  #metadataStoreService = inject(MetadataStoreService);
  #utils = inject(UtilService);
  #posts = signal<IPost[]>([]);

  #state = signal<any[]>([]);
  #loading = signal<boolean>(false);
  #currentPost = signal<IPost | undefined>(undefined);
  currentState = computed(() => this.#posts());
  backupState = signal<any[]>([]);
  recordTotal = signal<number>(0);
  currentPosts = signal<IPost[]>([])
  homeState = signal<any>(undefined);

  select = {
    state: computed(() => this.#state()),
    isLoading: computed(() => this.#loading()),
    resume: (start: number = 0, limit: number = 25)  => this.#extractByQtd(start, limit),
    current: computed(() => this.#currentPost()),
    recordTotal: this.recordTotal
  }



  async actionLoadHome(start = 0, limit=25){
    this.#loading.set(true);
    this.#metadataStoreService.setLoading('post', true);
    const res$ = this.#postServices.getHome(start, limit).pipe(
      tap(res => {
        this.#loading.set(false)
        this.setInState(res)

      })

    );
    return await firstValueFrom(res$)
  }

  actionLoadAll(type = '' ,start = 1, limit = 20, pageIndex = 0, order = 'recentes',){
    this.#metadataStoreService.setLoading('post', true);
    return this.#postServices.getAll(type, start, limit, order).pipe(
      tap(res => {
        this.#metadataStoreService.setLoading('post', false);
        this.setInState(res)
      })
    )
  }

  async getRecordTotal(){
    const {error, results} = await firstValueFrom(this.#postServices.getRecordsTotal());
    if(error){return}
    this.recordTotal.set(results?.recordsTotal ?? 0)
  }



  // setMany(newPosts: IPost[]){
  //   if(!newPosts.length){return}
  //   this.#posts.update(currentState => {
  //     let newState = [...currentState, ...newPosts]; //merge
  //     newState = Array.from(new Map(newState.map(item => [item['id'], item])).values()); //remove duplicados
  //     return newState
  //   })
  // }

  async actionLoadOne(slug: string, type: 'summary' | 'full' = 'full'){
    this.#loading.set(true);
    const res$ = this.#postServices.getOne(slug, type).pipe(
      tap(res => {
        this.#loading.set(false);
        this.setInState(res);
      })
    )

    return await firstValueFrom(res$)
  }

  async actionSaveOne(post: IPost | Partial<IPost>, postFatherId?: number){
    this.#loading.set(true);
    const res$ = this.#postServices.createOne(post, postFatherId).pipe(
      tap(res => {
        this.#loading.set(false);
        this.setInState(res);
      })
    );
    return await firstValueFrom(res$)
  }

  editOneApi(post: Partial<IPost>){
    this.#metadataStoreService.setLoading('post', true);
    return this.#postServices.editOne(post).pipe(
      tap(res => {
        this.#metadataStoreService.setLoading('post', false);
        this.setInState(res);
      })
    )
  }

  #extractByQtd(start: number = 0, limit = 25){
    const length = start+limit;
    return computed(() => this.select.state().filter((_, i) => {
      if(this.select.state().length < length){
        return i >=  (this.select.state().length - 25)
      }
      const matchIndex = i >= start && i<= length;
      return matchIndex

    }))
  }


  async setCurrentPost(slug: string | undefined, ignoreLoad = false){
    if(!slug){return}
    const post = this.#state().filter(post => post.id && post.slug === slug)[0] ?? undefined;
    this.#currentPost.set(post);

  }

  async setCurrentPosts(slug: string | undefined, start = 0, limit = 20){
    if(!slug){return}
    const posts = this.currentState().filter((post, i) => post.slug === slug && i <= limit);
    this.currentPosts.set(posts);
    return await this.actionLoadOne(slug)
  }

  setLike(idUser: number, idPost: number){
    return this.#postServices.saveLike(idUser, idPost)
  }

  setInState(res: IResponse, replaceAll = false) {
    const { error, results } = res;
    if (error) { return }
    const entity = Array.isArray(results) ? results : [results];
    this.#state.update((current) => {
      if (replaceAll) {
        return entity.map(elem => this.#utils.paramsJsonParse(elem));

      } else {
        // Evita duplicações baseadas no ID
        const entityMap = new Map(entity.map(item => [item.id, item]));
        // Atualiza os itens existentes e adiciona os novos
        const updatedList = (current ?? []).map(item => entityMap.get(item.id) || item);
        const existingIds = new Set(updatedList.map(item => item.id));
        const newItems = entity.filter(item => !existingIds.has(item.id));
        const res = [...updatedList, ...newItems].map(elem => this.#utils.paramsJsonParse(elem));
        return res;
      }
    });

    this.#currentPost.update((current) =>  entity.length === 1 ? entity[0] : current);
  }


}
