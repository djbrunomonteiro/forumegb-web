import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStoreService } from '../store/user-store.service';
import { ETypeStage } from '../enums/enums';

export const postGuard: CanActivateFn = (route, state) => {

  const userStore = inject(UserStoreService);
  const user = userStore.currentState();
  const router = inject(Router);
  const type = route.params['type'];
  let habilited = true;
  if(type !== ETypeStage.MAINSTAGE){return habilited}
  console.log(user);
  
  if(!user){
    router.navigate(['/login-cadastro']);
    habilited = false;
  }else{
    habilited = user?.plan?.valid ?? false
  }

  return habilited
};
