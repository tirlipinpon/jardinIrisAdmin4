import { Injectable } from '@angular/core';
import OpenAI from "openai";
import {getFormattedFullDateTime} from "../../utils/getFormattedDate";
import {environment} from "../../../../environment";

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  openai = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: environment.openAiApiKey
  });
  constructor() { }

  async testAssistant(){
    const myAssistant = await this.openai.beta.assistants.retrieve(
      "asst_Zaby7oU07aPrFgtETtow6iS6"
    );

    console.log(myAssistant);
  }

  async  callMainOpenAiResumeArticle(weatherData: any, url_post: string, urlImage?: string) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          "role": "system",
          "content": "Vous êtes un expert jardinier en rédaction de blogs spécialisés en format json, avec une solide expérience en SEO et jardinier paysagiste. " +
            "Vous avez accès à des données spécifiques concernant un article que vous devrez réecrire pour le site."+
            "Ne rajoute aucune info de plus que ce qui est déjà écrit " +
            "Ta réponse doit être en JSON valide strict " +
            "et où chaque clé/valeur du JSON est sur une ligne (commence par la parenthèse ouvrante et fini par la parenthèse fermante et rien d'autre, " +
            "“Do not wrap the JSON codes in JSON markers or added texte by yourself comments”): just that !->" +
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
            "}\n"
        },
        {
          "role": "user",
          "content":
            "Voici les données :" + weatherData + " La structure du blog doit avoir ces parties distinctes: " +
            "Rédige une réponse en JSON, d’un article de blog détaillé précis et proffessionel avec une touche d'humour en etant le plus fidèle à ce texte : (" + url_post + "). " +
            "1. La created_at = " + getFormattedFullDateTime() + "" +
            "2. Un titre de +- 10 mots, " +
            "3. Description météo à Bruxelles de +- 35 mots, " +
            "4. Une phrase d'accroche de +- 40 mots, avec les 3 mots les plus importants entre les balises html <b></b> " +
            "5. **L'article doit impérativement comporter un minimum de 500 mots**, sans aucun retour à la ligne excepté entre les 5 parties. " +
            "   Utilise des balises <span> pour entourer chaqune des 5 parties, et insère une balise <br id='link_to_service'> entre le troisieme et la quatrieme  parties. " +
            "   Chacune des 5 parties doit absolument contenir un titre d'accroche de paragraphe <h4></h4> avec une icone illustratrice et sous le titre une phrase de question dans un <ul><li> sur le context du chapitre " +
            "et une phrase entièrre dans le paragraphe importante mise en évidence avec des balises html <b></b>. " +
            "   **L'article ne doit pas être inférieur à 700 mots**, il doit respecter les exigences strictement et chaque contenu de chapitre doit etre tres detaiilé et precis sur le sujet, avec des informations techniques," +
            "6. Une citation connue en lien avec l'article et le nom de l'auteur. " +
            "7. Le lien que je t'ai donné : " + url_post + " " +
            "8. image_url : " +( urlImage?.length?urlImage:null) +
            "9. Un choix de catégorie adapté entre jardin, nature, écologie et potager."
        }
      ],
      model: "gpt-4o",
      max_tokens: 1200,
      temperature: 0.8,
    });
    console.log('weatherData= '+weatherData);
    console.log('completion.choices[0]= '+completion.choices[0]);
    return completion.choices[0].message.content
  }

  async fetchData(prompt: any) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        prompt.systemRole,
        prompt.userRole
      ],
      model: "gpt-4o-mini"
    });

    // console.log('completion.choices[0]= '+ JSON.stringify(completion.choices[0]));
    return completion.choices[0].message.content
  }

  async imageGenerartor(promptText: any) {
    const image =
      await this.openai.images.generate({
        model: "dall-e-3",
        prompt: promptText,
        n:1,
        size:"1024x1024",
        response_format: "b64_json"
      });
    return image.data[0].b64_json

  }

}
