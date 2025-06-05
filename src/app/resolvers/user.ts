import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { UserStoreService } from "../store/user-store.service";
import { firstValueFrom } from "rxjs";
import { AuthService } from "../services/auth.service";

export const UserResolver: ResolveFn<any> = async (route, state) => {
  const userStore = inject(UserStoreService);
  const auth = inject(AuthService);
  const user = userStore.currentState();
  if(!user){
    await firstValueFrom(auth.checkAuth());
  }

  return user
}