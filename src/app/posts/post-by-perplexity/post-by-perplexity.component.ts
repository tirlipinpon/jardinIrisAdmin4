import { Component } from '@angular/core';
import {PerplexityService} from "../../services/perplexity/perplexity.service";
import {JsonPipe} from "@angular/common";
import {SupabaseService} from "../../services/supabase/supabase.service";
import {MapPostService} from "../../services/map-post/map-post.service";
import {Post} from "../../shared/types/post";
import {provideNativeDateAdapter} from "@angular/material/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";

@Component({
  selector: 'app-post-by-perplexity',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    JsonPipe,
    MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './post-by-perplexity.component.html',
  styleUrl: './post-by-perplexity.component.css'
})
export class PostByPerplexityComponent {
  response:string = ""
  precisionArticle: string = ""
  precisionArticleId: number = 0

  private readonly _currentYear = new Date().getFullYear();
  readonly maxDate = new Date(this._currentYear, new Date().getMonth(), new Date().getDate());
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  dateSelected: string = new Date().toLocaleDateString();

  returnPickerDate(): any {
    return ' entre le ' + this.range.get('start')?.value + ' et le' + this.range.get('end')?.value
  }

  getSystemPromptUpdated(){
    return  `Tu es un expert jardinier paysagiste en Belgique qui vas écrire sur son blog,
    sur les thématiques de la nature, l'écologie, les plantes, jardin, potager, fleurs ou tout ce qui peut intéresser comme sujet pour un jardinier paysagiste.
    ${this.precisionArticle.length ? this.precisionArticle : ''}
    Trouve moi un article de la date  ${(this.range.get('start')?.value&&this.range.get('end')?.value)? this.returnPickerDate() :  this.dateSelected} et réécris le blog le plus fidèlement possible en gardant les infos techniques dates et informations.
    Ta réponse doit être professionnelle, complète et avec une touche d'humour en plus dans le paragraphe 1`;
  }

  getUserPromptUpdated() {
  return `Remplis le json suivant avec les infos.
    {
      "titre": "",
      "description_meteo": "description meteo à Bruxelles du ${(this.range.get('start')?.value&&this.range.get('end')?.value)? this.returnPickerDate() :  this.dateSelected} de l'IRM",
      "phrase_accroche": "phrases qui donnent envie de lire l'article +-25 mots",
      "article": "",
      "citation": "une citation connue sur le thème de l'article",
      "lien_url_article":
        {
          "lien1": "le premiere lien que tu utilises pour écrire le post",
          "lien2": "le deuxième lien que tu utilises pour écrire le post",
          "lien3": "le troisième lien que tu utilises pour écrire le post"
        },
      "categorie": "une catégorie que tu choisis en fonction de l'article entre : jardin; écologie; potager; nature; fleur; événement"
    }
    Et le post de blog doit comprendre entre 4 et 6 paragraphes sous format HTML comme suit :

    <h4>icone + titre paragraphe 1 "+- 5 mots"</h4>
    <ul>
      <li>question sous-titre paragraphe 1 "+- 10 mots"</li>
    </ul>
    <div id="paragraphe-1">
      <p>paragraphe 1 texte (+-100 mots)</p>
    </div>
    Après le paragraphe 3, il doit y avoir une balise <br id="link_to_service">`;
  }

  constructor(private perplexityService: PerplexityService,
              private supabaseService: SupabaseService,
              private mapPostService: MapPostService) {}

  callPerplexityService() {
    this.supabaseService.getFirstIdeaPostByMonth(new Date().getMonth()+1, new Date().getFullYear()).then((r: any) => {
      if(r[0].description.length) {
        this.precisionArticle = r[0].description;
        this.precisionArticleId = r[0].id;
      }
      this.perplexityService.fetchData(this.getSystemPromptUpdated(), this.getUserPromptUpdated()).then((r: any) => {
        console.log("response from perplexity " + JSON.stringify(r, null, 2))
        this.response = r.choices[0].message.content
        this.supabaseService.setNewPostForm(this.mapPostService.mapToPost(this.response)).then((r: any) => {
          console.log('last post returned = ' + JSON.stringify(r))
          this.supabaseService.updateDeleteIdeaPostById(this.precisionArticleId, r[0].id)
        })
      })
    });
  }

}
