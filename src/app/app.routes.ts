import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { CadastroComponent } from './components/pages/sigin-register/cadastro.component';
import { authGuard } from './guard/auth.guard';
import { postEditGuard } from './guard/post-edit.guard';
import { postGuard } from './guard/post.guard';
import { UserResolver } from './resolvers/user';
import { PoliticaComponent } from './components/pages/politica/politica.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';


export const routes: Routes = [
    {
        path: '',
        component: HomeComponent 
    },
    {
        path: 'politica-de-privacidade-e-termos-de-uso',
        component: PoliticaComponent 
    },
    {
        path: 'login-cadastro',
        loadComponent: () => import('./components/pages/sigin-register/cadastro.component').then(c => c.CadastroComponent)
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
                canActivate: [authGuard],
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
    {
        path: 'checkout/:status',
        redirectTo: 'perfil',
        pathMatch: 'full'
    },
    { path: '**', component: NotFoundComponent }
];
