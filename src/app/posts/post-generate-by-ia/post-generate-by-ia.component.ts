import {Component} from '@angular/core';
import {TheNewsApiService} from "../../services/the-news-api/the-news-api.service";
import {CommonModule} from "@angular/common";
import {OpenaiService} from "../../services/openai/openai.service";
import {WeaterMeteoService} from "../../services/open-meteo/weater-meteo.service";
import {SupabaseService} from "../../services/supabase/supabase.service";


@Component({
  selector: 'app-post-generate-by-ia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-generate-by-ia.component.html',
  styleUrl: './post-generate-by-ia.component.css'
})
export class PostGenerateByIaComponent {
  newsData: any;
  selectedArticle: any;

  constructor(private theNewsApiService: TheNewsApiService,
              private openaiService: OpenaiService,
              private weaterMeteoService: WeaterMeteoService,
              private supabaseService: SupabaseService) {
  }

  clickToGenerate() {
    this.theNewsApiService.getNewsApi().subscribe((news) => {
      this.newsData = news.data.map((article: any) => {
        return {
          url: article.url,
          image_url: article.image_url
        };
      });
      // Appel à OpenAI pour la sélection des articles
      this.openaiService.callMainOpenAiSelectArticleFromNewsApi(this.newsData).then(response => {
        try {
          const responseData = typeof response === 'string' ? JSON.parse(response) : response;
          if (responseData && typeof responseData === 'object' && 'valide' in responseData) {
            if (responseData.valide === true) {
              this.selectedArticle = responseData;
              console.log('Article valide trouvé:', responseData);
              this.weaterMeteoService.callWeatherMeteoAndOpenAi(responseData.url, responseData.image_url).then((data: any) => {
                try {
                  let dataJson = JSON.parse(data);
                  if (typeof dataJson !== 'object' || dataJson === null) {
                    throw new Error('Le format de la réponse est incorrect');
                  }
                  this.supabaseService.setNewPostForm(dataJson).then(r => {
                    console.log(r)
                  })
                  console.log("dataJson= ", dataJson);
                } catch (error: any) {
                  console.error('Erreur lors du parsing ou du format des données:', error);
                }
              }).catch((error) => {
                console.log("error= ", error);
              });
            } else {
              console.log("L'article reçu n'est pas valide.");
            }
          } else {
            console.error("Structure JSON incorrecte ou clé 'valide' manquante.");
          }
        } catch (error) {
          console.error("Erreur lors de la vérification ou du parsing de la réponse:", error);
        }
      });


    });
  }


}
