import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { CadastroComponent } from './components/pages/sigin-register/cadastro.component';
import { authGuard } from './guard/auth.guard';
import { postEditGuard } from './guard/post-edit.guard';


export const routes: Routes = [
    {
        path: '',
        component: HomeComponent 
    },
    {
        path: 'login-cadastro',
        component: CadastroComponent
    },
    {
        path: 'posts',
        children: [
            {
                path: 'publicar',
                canActivate: [authGuard],
                loadComponent: () => import('./components/pages/post-editor/post-editor.component').then(c => c.PostEditorComponent)
            },
            {
                path: 'publicar/:slug',
                canActivate: [postEditGuard],
                loadComponent: () => import('./components/pages/post-editor/post-editor.component').then(c => c.PostEditorComponent)            },
            {
                path: 'type/:type/:slug',
                loadComponent: () => import('./components/pages/post/post.component').then(c => c.PostComponent)
            },
            {
                path: 'type/:type',
                loadComponent: () => import('./components/pages/stage/stage.component').then(c => c.StageComponent)
            },
        ]
    },
    {
        path: 'perfil',
        children: [
            {
                path: '',
                loadComponent: () => import('./components/pages/perfil/perfil.component').then(c => c.PerfilComponent)
            },
        ]
    },
];
