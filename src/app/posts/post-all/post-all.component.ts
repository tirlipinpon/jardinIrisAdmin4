import {AfterViewChecked, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SupabaseService} from "../../services/supabase/supabase.service";
import {MatDialog} from "@angular/material/dialog";
import {
  DialogDeletePostConfirmComponent
} from "../../shared/dialog/delete-post-confirm/dialog-delete-post-confirm.component";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {
  DialogDeleteCommentConfirmComponent
} from "../../shared/dialog/delete-comment-confirm/dialog-delete-comment-confirm.component";

@Component({
  selector: 'app-post-all',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, RouterModule, FormsModule,
    ReactiveFormsModule, MatOption, MatFormFieldModule, MatSelectModule],
  templateUrl: './post-all.component.html',
  styleUrl: './post-all.component.css'
})
export class PostAllComponent implements OnInit, AfterViewChecked {
  postsWithComments: any[] = [];
  readonly dialogDeleteConfirm = inject(MatDialog);
  matSelectedOption = "";

  constructor(private supabaseService: SupabaseService, private router: Router, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.refreshDataGetManyPosts()
  }

  ngAfterViewChecked() {
    this.addClickEventAccordionArticle('accordion')
    this.addClickEventAccordionArticle('accordionComments')
  }

  addClickEventAccordionArticle(classSelectorName: string) {
    // Récupérer tous les éléments ayant la classe "accordion"
    const acc: NodeListOf<HTMLElement> = document.querySelectorAll("."+classSelectorName);

    acc.forEach((button) => {
      button.addEventListener("click", () => {
        // Fermer tous les autres panels
        acc.forEach((otherButton) => {
          const otherPanel = otherButton.nextElementSibling as HTMLElement;
          if (otherButton !== button) {
            otherButton.classList.remove("active");
            otherPanel.style.display = "none";
          }
        });

        // Toggle la classe active sur l'élément cliqué
        button.classList.toggle("active");

        // Récupérer l'élément suivant dans le DOM (le panel)
        const panel = button.nextElementSibling as HTMLElement;

        // Vérifier si le panel est affiché et le masquer ou l'afficher
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    });
  }

  async refreshDataGetManyPosts() {
    try {
      // Récupérer les posts et les commentaires
      const responsePost = await this.supabaseService.getOneOrManyPostForm(0, this.matSelectedOption);
      const responseComments = await this.supabaseService.getAllComments();
      // Attacher les commentaires à chaque post
      const postsWithComments = responsePost.map(post => {
        return {
          ...post,
          comments: responseComments.filter(comment => comment.fk_post === post.id) // Associer les commentaires liés
        };
      });
      // Mettre à jour les données locales avec les posts modifiés
      this.postsWithComments = postsWithComments;
      this.cdRef.detectChanges();
      console.log('Posts with Comments:', this.postsWithComments);
    } catch (error) {
      console.error('Erreur lors de la récupération des données', error);
    }
  }


  openDialogDeletePost(post: any) {
    const dialogRef = this.dialogDeleteConfirm.open(DialogDeletePostConfirmComponent, {
      data: {
        post: post,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.callDeleteAndRefreshPosts(post.id)
      }
    });
  }

  deletePost(post: any) {
    this.openDialogDeletePost(post)
  }

  callDeleteAndRefreshPosts(postId: number) {
    this.supabaseService.deletePostByIdForm(postId).then(r => {
      this.refreshDataGetManyPosts();
    })
  }
  callDeleteCommentAndRefreshPosts(commentId: number) {
    this.supabaseService.deleteCommentById(commentId).then(r => {
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
    this.refreshDataGetManyPosts();
  }

  openDialogDeleteComment(comment: any) {
    const dialogRef = this.dialogDeleteConfirm.open(DialogDeleteCommentConfirmComponent, {
      data: {
        comment: comment,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.callDeleteCommentAndRefreshPosts(comment.id)
      }
    });
  }

  deleteCommentById(comment: any) {
    this.openDialogDeleteComment(comment)
  }

  valideCommentById(comment: any) {
    this.supabaseService.valideCommentById(comment.id).then(r => {
      this.refreshDataGetManyPosts();
    })
  }

  getValidCommentsCount(post: any): number {
    return post.comments ? post.comments.filter((comment: any) => comment.valide).length : 0;
  }


}
