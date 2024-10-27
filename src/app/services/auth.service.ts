import { inject, Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup,  signOut } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { UserStoreService } from '../store/user-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #auth = inject(Auth);
  #googleAuthProvider = new GoogleAuthProvider();
  #userStore = inject(UserStoreService);


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
    this.#auth.onAuthStateChanged(async () => {
      const email = this.#auth.currentUser?.email ?? undefined;
      if(!email){
        this.#userStore.setState(undefined)
        return
      }
      await firstValueFrom(this.#userStore.getOne(email));
    })
    
  }


}
