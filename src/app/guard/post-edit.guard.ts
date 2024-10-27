import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { firstValueFrom } from 'rxjs';
import { UserStoreService } from '../store/user-store.service';
import { UtilService } from '../services/util.service';

export const postEditGuard: CanActivateFn = async (route, state) => {
  const slug = route.params['slug'];
  const utils = inject(UtilService);
  const router = inject(Router);
  const postService = inject(PostService);
  const userStore = inject(UserStoreService);
  const user = userStore.currentState();
  const owner_id = user?.id ? user.id : 0
  let valid = false
  if(slug){
  const {results} = await firstValueFrom(postService.isAuthor(slug, +owner_id));
  valid = results?.isOwner ?? false
  }

  if(!valid){
    utils.showMsg('Não permitido, você não é o author!')
  }

  return valid;
};
