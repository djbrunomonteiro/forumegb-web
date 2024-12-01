import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { UserStoreService } from "../store/user-store.service";
import { AuthService } from "../services/auth.service";


export const UserResolver: ResolveFn<any> = async (route, state) => {
    const auth = inject(AuthService);
    await auth.checkAuth();
}