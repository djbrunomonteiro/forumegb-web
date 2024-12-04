import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { UserStoreService } from "../store/user-store.service";
import { AuthService } from "../services/auth.service";


export const UserResolver: ResolveFn<any> = async (route, state) => {
    const auth = inject(AuthService);
    const userStore = inject(UserStoreService);
    const user = userStore.currentState()
    console.log(user);
    
    return user
}