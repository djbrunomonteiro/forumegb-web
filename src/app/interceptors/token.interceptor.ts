import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return from(auth.getToken()).pipe(
    switchMap((token) => {
      const newReq = req.clone({
        headers: req.headers.append('Authorization', `Bearer ${token}`), // Corrigido para "Authorization"
      });
      return next(newReq); // Passa a nova requisição para o próximo handler
    })
  );
};
