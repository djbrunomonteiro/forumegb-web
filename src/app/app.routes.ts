import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { CadastroComponent } from './components/pages/sigin-register/cadastro.component';

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
                loadComponent: () => import('./components/pages/post-editor/post-editor.component').then(c => c.PostEditorComponent)
            },
            {
                path: ':slug',
                loadComponent: () => import('./components/pages/post/post.component').then(c => c.PostComponent)
            }
        ]
    },
];
