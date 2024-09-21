import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'add-new-post',
    loadComponent: () => import('./posts/post-add/post-add.component').then(m => m.PostAddComponent), title: 'add-new-post'},
  { path: 'get-all-post',
    loadComponent: () => import('./posts/post-all/post-all.component').then(m => m.PostAllComponent), title: 'get-all-post'},
  { path: 'edit-old-post/:postId',
    loadComponent: () => import('./posts/post-edit/post-edit.component').then(m => m.PostEditComponent), title: 'get-all-post'},
  { path: '**',
    loadComponent: () => import('./posts/post-all/post-all.component').then(m => m.PostAllComponent)
  }
];
