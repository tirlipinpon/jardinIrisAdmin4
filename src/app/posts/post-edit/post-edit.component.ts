import {Component, Input, OnInit, output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SupabaseService} from "../../services/supabase/supabase.service";

@Component({
  selector: 'app-post-edit',
  standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.css'
})
export class PostEditComponent implements OnInit{
  // @ts-ignore
  postForm: FormGroup;
  @Input() postId!: number;
  constructor(private fb: FormBuilder, private supabaseService: SupabaseService, private router: Router) {
  }
  ngOnInit() {
    this.postForm = this.fb.group({
      id: [0, Validators.required],
      created_at: ['', Validators.required],
      titre: ['', Validators.required],
      description_meteo: ['', Validators.required],
      phrase_accroche: ['', Validators.required],
      article: ['', Validators.required],
      citation: ['', Validators.required],
      lien_url_article: ['', Validators.required],
      categorie: ['', Validators.required],
      image_url: ['', Validators.required],
    });
    this.setPostFromId();
  }

  setPostFromId(){
    if(this.postId) {
      this.supabaseService.getOneOrManyPostForm(this.postId).then(r => {
        this.postForm.patchValue(r[0])
        window.scrollTo(0, 0)
      })
    }
  }
  get createdAtFormatted() {
    const createdAt = this.postForm.get('created_at')?.value;
    return createdAt ? new Date(createdAt).toLocaleDateString('fr-FR') : '';
  }
  onSubmit() {
    if (this.postForm.valid) {
      this.supabaseService.updatePostByIdForm(this.postForm.value).then((response) => {
        this.router.navigate(['/get-all-post']);
      })
    }
  }
}
