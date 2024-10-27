import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStoreService } from '../store/user-store.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStoreService);
  const user = userStore.currentState();
  const router = inject(Router);
  if(!user){
    router.navigate(['/login-cadastro']);
  }
  return user ? true : false;
};
