import { inject, Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup,  } from '@angular/fire/auth';
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

  #baseUrl = environment.apiUrl;
  
  async signInWithPopup(){
     return signInWithPopup(this.#auth, this.#googleAuthProvider)
  }

  async getToken(){
    return (await this.#auth.currentUser?.getIdTokenResult())?.token
  }

  checkAuth(){
    this.#auth.onAuthStateChanged(async () => {
      const email = this.#auth.currentUser?.email ?? undefined;
      if(!email){
        this.#userStore.setState(undefined)
        return
      }
      this.#userStore.setState({...this.#auth.currentUser} as any)
      const {results} = await firstValueFrom(this.#userStore.getOne(email));
      console.log(results);
      
    })
    
  }


}
