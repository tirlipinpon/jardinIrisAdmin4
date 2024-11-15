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
    canActivate: [userIsAuth]
  },
  {
    path: 'auth',
    children: authRoutes
  },
  { path: 'add-new-post',
    loadComponent: () => import('./posts/post-add/post-add.component').then(m => m.PostAddComponent), title: 'ajouter un post'},
  { path: 'get-all-post',
    loadComponent: () => import('./posts/post-all/post-all.component').then(m => m.PostAllComponent), title: 'tous les posts'},
  { path: 'edit-old-post/:postId',
    loadComponent: () => import('./posts/post-edit/post-edit.component').then(m => m.PostEditComponent), title: 'éditer un post'},
  { path: 'generate-post',
    loadComponent: () => import('./posts/post-by-openai/post-generate-by-ia.component').then(m => m.PostGenerateByIaComponent), title: 'générer un post'},
  { path: 'asking-post',
    loadComponent: () => import('./posts/post-by-perplexity/post-by-perplexity.component').then(m => m.PostByPerplexityComponent), title: 'chercher un post'},
  { path: 'general-post',
    loadComponent: () => import('./posts/post-general/post-general.component').then(m => m.PostGeneralComponent), title: 'post automatique'},
  { path: '**',
    redirectTo: 'auth/login',
    pathMatch: "full"
  }
];
