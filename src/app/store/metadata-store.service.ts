import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MetadataStoreService {

  #listenPost = signal(false);
  #listenUser = signal(false);
  #ListenErrorPost = signal({error: false, message: ''});
  #ListenErrorUser = signal({error: false, message: ''});
  loadingPost = computed(() => this.#listenPost())
  loadingUser = computed(() => this.#listenUser())
  errorUser = computed(() => this.#ListenErrorUser())

  setLoading(type = 'post', value = true){
    switch(type) {
      case 'post': 
      this.#listenPost.update(() => value)
      return
      case 'user': 
      this.#listenUser.update(() => value)
      return
    }
  }

  setError(type = 'post', error = true, message: any = 'ocorreu um error ao tentar carregar dados'){
    switch(type) {
      case 'post': 
      this.#ListenErrorPost.update(() => ({error, message}))
      return
      case 'user': 
      this.#ListenErrorUser.update(() => ({error, message}))
      return
    }

  }
}
