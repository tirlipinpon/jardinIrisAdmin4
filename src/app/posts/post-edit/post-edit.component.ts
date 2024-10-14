import {Component, Input, OnDestroy, OnInit, output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SupabaseService} from "../../services/supabase/supabase.service";
import {Editor, NgxEditorModule, Toolbar} from "ngx-editor";

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgxEditorModule, FormsModule],
  templateUrl: './post-edit.component.html',
  styleUrl: './post-edit.component.css'
})
export class PostEditComponent implements OnInit, OnDestroy {
  // @ts-ignore
  postForm: FormGroup;
  // @ts-ignore
  editor: Editor;
  toolbar: Toolbar = [
    // default value
    ["bold", "italic"],
    ["underline", "strike"],
    ["code", "blockquote"],
    ["ordered_list", "bullet_list"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["link", "image"],
    ["text_color", "background_color"],
    ["align_left", "align_center", "align_right", "align_justify"],
  ];
  isEditorTextON: boolean = false;
  @Input() postId!: number;
  constructor(private fb: FormBuilder, private supabaseService: SupabaseService, private router: Router) {
  }
  ngOnInit() {
    this.editor = new Editor();
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

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  switchIsCode(event: any) {
    this.isEditorTextON = !this.isEditorTextON;
    event.preventDefault();
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
