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

  async  callMainOpenAiResumeArticle(weatherData: any, url_post: string, urlImage?: string) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          "role": "system",
          "content": "Vous êtes un expert jardinier en rédaction de blogs spécialisés en format json, avec une solide expérience en SEO et jardinier paysagiste. " +
            "Vous avez accès à des données spécifiques concernant la période actuelle, et un article que vous devrez réecrire pour le site."+
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
            "Rédige une réponse en JSON, d’un article de blog détaillé avec une touche d'humour comme si tu étais un jardinier paysagiste sur base de ce lien : (" + url_post + "). " +
            "1. La created_at = " + getFormattedDate() + "" +
            "2. Un titre de +- 10 mots, " +
            "3. Description météo à Bruxelles de +- 35 mots, " +
            "4. Une phrase d'accroche de +- 40 mots, avec les 3 mots les plus importants entre les balises html <b></b> " +
            "5. **L'article doit impérativement comporter un minimum de 500 mots**, sans aucun retour à la ligne excepté entre les 5 parties. " +
            "   Utilise des balises <span> pour entourer chaqune des 5 parties, et insère une balise <br id='link_to_service'> entre le troisieme et la quatrieme  parties. " +
            "   Chacune des 5 parties doit absolument contenir un titre d'accroche de paragraphe <h4></h4> et sous le titre une phrase de question dans un <ul><li> sur le context du chapitre " +
            "et une phrase entièrre importante mise en évidence avec des balises html <b></b>. " +
            "   **L'article ne doit pas être inférieur à 500 mots**, il doit respecter les exigences strictement et chaque contenu de chapitre doit etre tres detaiilé et precis sur le sujet, avec des information technique," +
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

  async callMainOpenAiSelectArticleFromNewsApi(newsApiData: any[]) {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          "role": "system",
          "content":
            "Tu es un assistant expert en évaluation d'articles pour un blog de jardinier paysagiste en Belgique. "+
            "Ta tâche est d'analyser une liste d'articles pour déterminer s'il y a un article pertinent pour un blog spécialisé dans les thèmes du jardinage, "+
            "ou de la nature, ou de l'écologie, ou des plantes, ou du potager, ou aux arbres, ou aux fleurs. Le blog est destiné à un public en Belgique."+
            "\n\nCritères de pertinence :\n"+
            "- Le contenu doit être lié au jardinage, à l'écologie, aux plantes, ou au potager.\n"+
            "- L'article doit être adapté au contexte belge.\n"+
            "- Le ton et le style doivent être informatifs ou pédagogiques, adaptés à des amateurs ou professionnels."+
            "\n\nSi tu trouves un article, retourne **un seul objet JSON** avec les champs suivants :\n"+
            "Ta réponse doit être en JSON valide strict " +
            "et où chaque clé/valeur du JSON est sur une ligne (commence par la parenthèse ouvrante et fini par la parenthèse fermante et rien d'autre, " +
            "“Do not wrap the JSON codes in JSON markers or added texte by yourself comments”): just that !->" +
            "{\n"+
            "  \"valide\": true,\n"+
            "  \"explication\": {\n"+
            "    \"raison-article-1\": \"Pourquoi cet article est pertinent ou non pertinent pour un blog de jardinier en Belgique.\",\n"+
            "    \"raison-article-2\": \"Pourquoi cet article est pertinent ou non pertinent, etc.\"\n"+
            "  },\n"+
            "  \"url\": \"URL de l'article validé\",\n"+
            "  \"image_url\": \"URL de l'image de l'article validé\"\n"+
            "}\n"+
            "\nL'explication doit inclure une raison pour chaque article analysé, qu'il soit retenu ou non. Le champ 'explication' doit donc contenir des clés de justification pour **chaque article**. "+
            "Par exemple :\n"+
            "\"raison-article-1\": \"Non pertinent car il parle de... .\",\n"+
            "\"raison-article-2\": \"Pertinent car il parle de... .\"\n"+
            "\nSi aucun article n'est pertinent, retourne un tableau vide []."
        },
        {
          "role": "user",
          "content":
            "Voici la liste des articles à évaluer : " + JSON.stringify(newsApiData) + ". " +
            "Tu dois retourner un objet JSON avec un seul article valide s'il y en a un, avec un tableau 'explication' contenant la raison de pertinence ou non pertinence pour chaque article analysé. "+
            "Si aucun article n'est pertinent, retourne un tableau vide []."
        }
      ],
      model: "gpt-4"
    });

    console.log('newsApiData= '+ JSON.stringify(newsApiData));
    console.log('completion.choices[0]= '+ JSON.stringify(completion.choices[0]));
    return completion.choices[0].message.content
  }

}
