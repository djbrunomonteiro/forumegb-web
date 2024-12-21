import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { UserStoreService } from "../store/user-store.service";

export const UserResolver: ResolveFn<any> = async (route, state) => {
    const userStore = inject(UserStoreService);
    const user = userStore.currentState()
    return user
}