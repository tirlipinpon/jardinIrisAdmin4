import { Routes } from '@angular/router';
import {PostGenerateByIaComponent} from "./posts/post-generate-by-ia/post-generate-by-ia.component";

export const routes: Routes = [
  { path: 'add-new-post',
    loadComponent: () => import('./posts/post-add/post-add.component').then(m => m.PostAddComponent), title: 'ajouter un post'},
  { path: 'get-all-post',
    loadComponent: () => import('./posts/post-all/post-all.component').then(m => m.PostAllComponent), title: 'tous les posts'},
  { path: 'edit-old-post/:postId',
    loadComponent: () => import('./posts/post-edit/post-edit.component').then(m => m.PostEditComponent), title: 'editer un post'},
  { path: 'generate-post',
    loadComponent: () => import('./posts/post-generate-by-ia/post-generate-by-ia.component').then(m => m.PostGenerateByIaComponent), title: 'generer un post'},
  { path: '**',
    loadComponent: () => import('./posts/post-all/post-all.component').then(m => m.PostAllComponent)
  }
];
