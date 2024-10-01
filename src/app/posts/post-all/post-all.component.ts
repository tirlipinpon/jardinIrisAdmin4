import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SupabaseService} from "../../services/supabase/supabase.service";
import {MatDialog} from "@angular/material/dialog";
import {
  DialogDeletePostConfirmComponent
} from "../../shared/dialog/delete-post-confirm/dialog-delete-post-confirm.component";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelectChange, MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";

@Component({
  selector: 'app-post-all',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, RouterModule, FormsModule, ReactiveFormsModule, MatOption, MatFormFieldModule, MatSelectModule],
  templateUrl: './post-all.component.html',
  styleUrl: './post-all.component.css'
})
export class PostAllComponent implements OnInit {
  posts: any[] = [];
  readonly dialogDeleteConfirm = inject(MatDialog);
  matSelectedOption = "";

  constructor(private supabaseService: SupabaseService, private router: Router) {
  }

  ngOnInit() {
    this.refreshDataGetManyPosts();
  }

  refreshDataGetManyPosts() {
    this.supabaseService.getOneOrManyPostForm(0, this.matSelectedOption).then((response) => {
      console.log(response)
      this.posts = response;
    })
  }

  openDialog(post: any) {
    const dialogRef = this.dialogDeleteConfirm.open(DialogDeletePostConfirmComponent, {
      data: {
        post: post,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.callDeleteAndRefresh(post.id)
      }
    });
  }

  deletePost(post: any) {
    this.openDialog(post)
  }

  callDeleteAndRefresh(postId: number) {
    this.supabaseService.deletePostByIdForm(postId).then(r => {
      console.log(r)
      this.refreshDataGetManyPosts();
    })
  }

  editPostById(postId: number) {
    this.router.navigate(['/edit-old-post', postId]);
  }

  validPostById(postId: number) {
    this.supabaseService.updateValidPostByIdForm(postId).then(r => {
      console.log(r)
      this.refreshDataGetManyPosts();
    })
  }

  triggerSelectChange(valueSelected: any) {
    this.matSelectedOption = valueSelected.value;
    console.log(this.matSelectedOption)
    this.refreshDataGetManyPosts();
  }


}
