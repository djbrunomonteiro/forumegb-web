import { inject, Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup,  signOut } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';
import { UserStoreService } from '../store/user-store.service';
import { MetadataStoreService } from '../store/metadata-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #auth = inject(Auth);
  #googleAuthProvider = new GoogleAuthProvider();
  #userStore = inject(UserStoreService);
  #metaStore = inject(MetadataStoreService);


  async signInWithPopup(){
     return signInWithPopup(this.#auth, this.#googleAuthProvider)
  }

  async getToken(){
    return (await this.#auth.currentUser?.getIdTokenResult())?.token
  }

  async logout(){
    return await signOut(this.#auth);
  }

  checkAuth(){
    return new Observable<any>(observer => {
      this.#metaStore.setLoading('user', true)
      this.#auth.onAuthStateChanged(async () => {
        const email = this.#auth.currentUser?.email ?? undefined;
        if(!email){
          this.#userStore.setState(undefined);
          this.#metaStore.setLoading('user', false)
          return observer.next(undefined);
        }
        const res = await firstValueFrom(this.#userStore.getOne(email));
        observer.next(res)
      })

    })
    
  }


}
