import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MetadataStoreService {

  #listenPost = signal(false);
  loadingPost = computed(() => this.#listenPost() )

  setLoading(type = 'post', value = true){
    switch(type) {
      case 'post': 
      this.#listenPost.update(() => value)
      return
    }

  }
}
