import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStoreService } from '../store/user-store.service';
import { AuthService } from '../services/auth.service';
import { firstValueFrom, from, map, mergeMap, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const userStore = inject(UserStoreService);
  const router = inject(Router);
  const user = userStore.currentState();

  if(user){return true}

  return from(auth.checkAuth()).pipe(
    switchMap((value) => {
      const user = value?.results;
      if(user){
        return of(true);
      }

      router.navigate(['/login-cadastro'])
      return of(false);
    })
  );

};