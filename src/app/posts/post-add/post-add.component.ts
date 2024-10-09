import {Component, inject, OnInit} from '@angular/core';
import {RouterModule} from "@angular/router";
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SupabaseService} from "../../services/supabase/supabase.service";
import {WeaterMeteoService} from "../../services/open-meteo/weater-meteo.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../shared/dialog/last-url-link/dialog.component";

@Component({
  selector: 'app-post-add',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgOptimizedImage, FormsModule, DialogComponent],
  templateUrl: './post-add.component.html',
  styleUrl: './post-add.component.css'
})
export class PostAddComponent implements OnInit{
  // @ts-ignore
  postForm: FormGroup;
  randomReadingTime: number = 0;
  url_post = "";
  isLoading = false;
  errorFromApi= "";
  showPostIa: boolean = false;
  linkToTheLastPost: string= ""
  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService, private weaterMeteoService: WeaterMeteoService) {
  }

  ngOnInit() {
    this.postForm = this.fb.group({
      created_at: ['', Validators.required],
      titre: ['', Validators.required],
      description_meteo: ['', Validators.required],
      phrase_accroche: ['', Validators.required],
      article: ['', Validators.required],
      citation: ['', Validators.required],
      lien_url_article: ['', Validators.required],
      categorie: ['', Validators.required],
      image_url: ['', Validators.required]
    });
  }

  onSubmit() {
    this.errorFromApi = "";
    if (this.postForm.valid) {
      this.isLoading = true;
      this.supabaseService.setNewPostForm(this.postForm.value).then((response) => {
        console.log(response)
        this.linkToTheLastPost = "https://jardin-iris.be/blog-detail.html?post="+ response[0].id;
        this.openDialog(this.linkToTheLastPost);
        this.showPostIa = false
        this.postForm.reset();
        this.isLoading = false;
      })
    } else {
      this.errorFromApi = "formulaire non valide";
      this.showErrorSnackBar("formulaire non valide");
    }
  }

  get createdAtFormatted() {
    const createdAt = this.postForm.get('created_at')?.value;
    return createdAt ? new Date(createdAt).toLocaleDateString('fr-FR') : '';
  }

  openDialog(urlToLastPost: string) {
    this.dialog.open(DialogComponent, {
      data: {
        link: urlToLastPost,
      },
    });
  }


  showErrorSnackBar(errorText: string) {
    if(this.errorFromApi.length) {
      this._snackBar.open(errorText, 'Undo', {
        // duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }
  }

  callApis(): void {
    this.showErrorSnackBar('errorText: string')
    if (this.url_post && this.url_post.length) {
      this.linkToTheLastPost = "";
      this.isLoading = true;
      this.errorFromApi = "";
      this.weaterMeteoService.callWeatherMeteoAndOpenAi(this.url_post).then((data: any) => {
        try {
          let dataJson = JSON.parse(data);
          if (typeof dataJson !== 'object' || dataJson === null) {
            throw new Error('Le format de la réponse est incorrect');
          }
          console.log("dataJson= ", dataJson);
          this.postForm.patchValue(dataJson);
          this.isLoading = false;
          this.showPostIa = true;
          this.url_post = "";
        } catch (error: any) {
          // Gestion des erreurs de parsing ou de format
          this.errorFromApi = 'Erreur de traitement des données : ' + error.message;
          this.showErrorSnackBar(this.errorFromApi);
          console.error('Erreur lors du parsing ou du format des données:', error);
          this.isLoading = false;
        }
      }).catch((error) => {
        this.errorFromApi = error
        this.showErrorSnackBar(this.errorFromApi);
        this.isLoading = false;
      });
    } else {
      this.errorFromApi = "lien article vide !"
      this.showErrorSnackBar(this.errorFromApi);
    }

  }

}
