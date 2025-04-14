import { Routes } from '@angular/router';
import {authRoutes} from "./features/auth/components/login-with-form/auth.routes";
import {userIsAuth} from "./features/auth/guard/auth.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: "full"
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'auth',
    children: authRoutes
  },
  { path: 'home/add-new-post',
    loadComponent: () => import('./posts/post-add/post-add.component').then(m => m.PostAddComponent), title: 'ajouter un post', canActivate: [userIsAuth]},
  { path: 'home/get-all-post',
    loadComponent: () => import('./posts/post-all/post-all.component').then(m => m.PostAllComponent), title: 'tous les posts'},
  { path: 'home/edit-old-post/:postId',
    loadComponent: () => import('./posts/post-edit/post-edit.component').then(m => m.PostEditComponent), title: 'éditer un post'},
  { path: 'home/generate-post',
    loadComponent: () => import('./posts/post-by-openai/post-generate-by-ia.component').then(m => m.PostGenerateByIaComponent), title: 'générer un post', canActivate: [userIsAuth]},
  { path: 'home/asking-post',
    loadComponent: () => import('./posts/post-by-perplexity/post-by-perplexity.component').then(m => m.PostByPerplexityComponent), title: 'chercher un post', canActivate: [userIsAuth]},
  { path: 'home/general-post',
    loadComponent: () => import('./posts/post-general/post-general.component').then(m => m.PostGeneralComponent), title: 'post automatique',canActivate: [userIsAuth]},
  { path: '**',
    redirectTo: 'auth/login',
    pathMatch: "full"
  }
];
