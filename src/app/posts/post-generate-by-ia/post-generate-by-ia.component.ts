import {Component} from '@angular/core';
import {TheNewsApiService} from "../../services/the-news-api/the-news-api.service";
import {CommonModule} from "@angular/common";
import {OpenaiService} from "../../services/openai/openai.service";
import {WeaterMeteoService} from "../../services/open-meteo/weater-meteo.service";
import {SupabaseService} from "../../services/supabase/supabase.service";
import {StepperCreateByIaComponent} from "../../shared/stepper-create-by-ia/stepper-create-by-ia.component";


@Component({
  selector: 'app-post-generate-by-ia',
  standalone: true,
  imports: [CommonModule, StepperCreateByIaComponent],
  templateUrl: './post-generate-by-ia.component.html',
  styleUrl: './post-generate-by-ia.component.css'
})
export class PostGenerateByIaComponent {
  stepValue: number = 0;
  messageToStepper: any = null

  constructor(private theNewsApiService: TheNewsApiService,
              private openaiService: OpenaiService,
              private weaterMeteoService: WeaterMeteoService,
              private supabaseService: SupabaseService) {
  }

  clickToGenerate() {
    this.theNewsApiService.getNewsApi().subscribe((news) => {
      let newsData = news.data.map((article: any) => {
        return {
          url: article.url,
          image_url: article.image_url
        };
      });
      // TODO: step 1
      this.stepValue = 1;
      console.log("getNewsApi OK = " + JSON.stringify(newsData))
      this.messageToStepper = "Recupération des articles réussies"
      // Appel à OpenAI pour la sélection des articles
      this.openaiService.callMainOpenAiSelectArticleFromNewsApi(newsData).then(response => {
        try {
          const responseData = typeof response === 'string' ? JSON.parse(response) : response;
          if (responseData && typeof responseData === 'object' && 'valide' in responseData) {
            if (responseData.valide === true) {
              console.log('Un Article validé par chat gpt trouvé:', responseData);
              // TODO: step 2
              this.stepValue = 2;
              this.messageToStepper = 'Un Article validé par chat gpt a été trouvé: '
              this.weaterMeteoService.callWeatherMeteoAndOpenAi(responseData.url, responseData.image_url).then((data: any) => {
                try {
                  let dataJson = JSON.parse(data);
                  console.log("dataJson= ", JSON.stringify(dataJson));
                  if (typeof dataJson !== 'object' || dataJson === null) {
                    // TODO: step ERROR
                    this.messageToStepper = 'ERROR : Le format de la réponse de chatGpt est incorrect' +dataJson
                    throw new Error('Le format de la réponse est incorrect'+ dataJson);
                  }
                  // TODO: step 3
                  this.stepValue = 3;
                  this.messageToStepper = 'L article validé par chat gpt a été résumé = ' + dataJson
                  this.supabaseService.setNewPostForm(dataJson).then(r => {
                    console.log('setNewPostForm response id ' + r[0].id)
                    // TODO: step 4
                    this.stepValue = 4;
                    this.messageToStepper = 'Un Nouveau post a été ajouté allez sur le bouton du menu éditer/supprimer -> pour le valider  = ' + r[0].id
                  })
                } catch (error: any) {
                  // TODO: step ERROR
                  this.messageToStepper = 'ERROR : Erreur lors du parsing ou du format des données = ' +error
                  console.error('Erreur lors du parsing ou du format des données:', error);
                }
              }).catch((error) => {
                // TODO: step ERROR
                this.messageToStepper = 'ERROR : Erreur inconnue de open ai = ' +error
                console.log("error= ", error);
              });
            } else {
              // TODO: step ERROR
              this.messageToStepper = 'ERROR : L\'article reçu n\'est pas valide '
              console.log("L'article reçu n'est pas valide.");
            }
          } else {
            // TODO: step ERROR
            this.messageToStepper = 'ERROR : Structure JSON incorrecte ou clé \'valide\' manquante. '
            console.error("Structure JSON incorrecte ou clé 'valide' manquante.");
          }
        } catch (error) {
          // TODO: step ERROR
          this.messageToStepper = 'ERROR : Erreur lors de la vérification ou du parsing de la réponse =  ' +error
          console.error("Erreur lors de la vérification ou du parsing de la réponse:", error);
        }
      });


    });
  }


}
