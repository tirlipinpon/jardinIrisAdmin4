import { Injectable } from '@angular/core';
import OpenAI from "openai";
import {getFormattedDate} from "../../utils/getUTCFormattedDate";
@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  openai = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: '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'
  });
  constructor() { }

  async  callMainOpenAi(weatherData: any, url_post: string) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          "role": "system",
          "content": "Vous êtes un expert jardinier en rédaction de blogs spécialisés en format json, avec une solide expérience en SEO et jardinier paysagiste. " +
            "Vous avez accès à des données spécifiques concernant la période actuelle, et un article que vous devrez résumer."
        },
        {
          "role": "user",
          "content":
            "Rédige une réponse en JSON, d’un article de blog détaillé avec une touche d'humour comme si tu étais un jardinier paysagiste sur base de ce lien : (" + url_post + "). Ne rajoute aucune info de plus que ce qui est déjà écrit " +
            "Ta réponse doit être en JSON valide strict " +
            "et où chaque clé/valeur du JSON est sur une ligne (commence par la parenthèse ouvrante et fini par la parenthèse fermante et rien d'autre, “Do not wrap the JSON codes in JSON markers or added texte by yourself comments”): just that !->" +
            "{\n" +
            "  \"created_at\": \"\",\n" +
            "  \"titre\": \"\",\n" +
            "  \"description_meteo\": \"\",\n" +
            "  \"phrase_accroche\": \"\",\n" +
            "  \"article\": \"\",\n" +
            "  \"citation\": \"\",\n" +
            "  \"lien_url_article\": \"" + url_post + "\",\n" +
            "  \"image_url\": \"\",\n" +
            "  \"categorie\": \"\",\n" +
            "  \"visite\": \"" + Math.floor(Math.random() * (10 - 2) + 2) + "\"\n" +
            "}\n" +
            "Voici les données :" + weatherData + " La structure du blog doit avoir 6 parties distinctes: " +
            "1. La created_at = " + getFormattedDate() + "" +
            "2. Un titre de +- 10 mots, " +
            "3. Description météo à Bruxelles de +- 35 mots, " +
            "4. Une phrase d'accroche de +- 40 mots, avec les 3 mots les plus importants entre les balises html <b></b> " +
            "5. **L'article doit impérativement comporter un minimum de 300 mots**, sans aucun retour à la ligne excepté entre les deux parties. " +
            "   Utilise des balises <span> pour entourer chaque partie, et insère une balise <br id='link_to_service'> entre les deux parties. " +
            "   Chaquune des deux parties doit absolument contenir une phrase entièrre importante mise en évidence avec des balises html <b></b>. " +
            "   **L'article ne doit pas être inférieur à 300 mots**, il doit respecter les exigences strictement." +
            "6. Une citation connue en lien avec l'article et le nom de l'auteur. " +
            "7. Le lien que je t'ai donné : " + url_post + " " +
            "8. Laisse vide ce champ " +
            "9. Un choix de catégorie adapté entre jardin, nature, écologie et potager."
        }
      ],

      model: "gpt-4o"
    });


    console.log('weatherData= '+weatherData);
    console.log('completion.choices[0]= '+completion.choices[0]);
    return completion.choices[0].message.content
  }
}
