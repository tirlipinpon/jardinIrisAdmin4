import { Routes } from '@angular/router';

export const routes: Routes = [
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
    loadComponent: () => import('./posts/post-all/post-all.component').then(m => m.PostAllComponent)
  }
];
