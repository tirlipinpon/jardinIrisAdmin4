import { Injectable } from '@angular/core';
import {formatCurrentDateUs} from "../../utils/getFormattedDate";
import {CathegorieJardinage} from "../../shared/types/cathegorie";

@Injectable({
  providedIn: 'root'
})
export class GetPromptService {

  constructor() { }

  getPromptSelectArticle(newsApiData: any): any {
    return {
      systemRole: {
        "role": "system",
        "content": `Tu es un assistant expert en évaluation d'articles pour un blog de jardinier paysagiste en Belgique.
        Ta tâche est d'analyser une liste d'articles pour déterminer s'il y a un article pertinent pour un blog spécialisé dans les thèmes du jardinage,
        ou de la nature, ou de l'écologie, ou des plantes, ou du potager, ou aux arbres, ou aux fleurs. Le blog est destiné à un public en Belgique.

        Critères de pertinence :
        - Le contenu doit être lié au jardinage, à l'écologie, aux plantes, ou au potager.
        - L'article doit être adapté au contexte belge.
        - Le ton et le style doivent être informatifs ou pédagogiques, adaptés à des amateurs ou professionnels.

        Si tu trouves un article, retourne **un seul objet JSON** avec les champs suivants :
        Ta réponse doit être en JSON valide strict et où chaque clé/valeur du JSON est sur une ligne (commence par la parenthèse ouvrante et fini par la parenthèse fermante et rien d'autre,
        “Do not wrap the JSON codes in JSON markers or added texte by yourself comments”): just that !->
        {"valide": boolean,"explication":{"raison-article-1":"Pourquoi cet article est pertinent ou non pertinent pour le blog de jardinier en Belgique."},"url":"URL de l'article validé","image_url":"URL de l'image de l'article validé"}
        L'explication doit inclure une raison pour chaque article analysé, qu'il soit retenu ou non. Le champ 'explication' doit donc contenir des clés de justification pour **chaque article**.
        Par exemple :
        "raison-article-1": "Non pertinent car il parle de... .",
        "raison-article-2": "Pertinent car il parle de... ."
        `
      },
      userRole: {
        "role": "user",
        "content": `Voici la liste des articles à évaluer : ${JSON.stringify(newsApiData)}.
      Tu dois retourner un objet JSON avec un seul article valide s'il y en a un, avec un tableau 'explication' contenant la raison de pertinence ou non pertinence pour chaque article analysé.
      `
      }
    }
  }

  getPerplexityPromptFindArticle(precisionArticle: any, morePromptInfo: any, returnPickerDate: any, dateSelected: any): any {
    return {
      systemRole: {
        role: "system",
        content: this.getPerplexityPromptSystemFindArticle(precisionArticle, morePromptInfo, returnPickerDate, dateSelected)
      },
      userRole: {
        role: "user",
        content: this.getPerplexityPromptUserFindArticle(morePromptInfo, returnPickerDate, dateSelected)
      }
    }
  }
  getPerplexityPromptSystemFindArticle(precisionArticle: any, morePromptInfo: any, returnPickerDate: any, dateSelected: any) {
    const prompt =   `Tu es un expert jardinier paysagiste en Belgique qui vas écrire sur son blog,
    sur les thématiques de la nature, l'écologie, les plantes, jardin, potager, fleurs ou tout ce qui peut intéresser comme sujet pour un jardinier paysagiste.
    ${precisionArticle.description.length ? precisionArticle.description : ''}
    Trouve moi un article de la date  ${(morePromptInfo.get('datePickerStart')?.value&&morePromptInfo.get('datePickerEnd')?.value)? returnPickerDate : dateSelected}
    et réécris le blog le plus fidèlement possible en gardant les infos techniques dates et informations.
    Ta réponse doit être professionnelle, complète et avec une touche d'humour en plus dans le paragraphe 1
    le contenu du message pour ta réponse doit contenir juste le json formaté en inline et valide et rien d'autre.
    et où chaque clé/valeur du JSON est sur une ligne (commence par la parenthèse ouvrante et fini par la parenthèse fermante et rien d'autre.
     `;
    // console.log("get System PromptUpdated = " + JSON.stringify(test, null, 2))
    return prompt
  }
  getPerplexityPromptUserFindArticle(morePromptInfo: any, returnPickerDate: any, dateSelected: any, article?: any, image_url?: string) {
    const prompt = `
  ${article?' Voici l article que tu dois utiliser pour remplir les données ci-dessous' + article :''}
  Tu vas me renvoyer ce JSON valide rempli avec les informations du post. Assure-toi de bien comprendre chaque instruction et d'adapter les réponses au contexte spécifique sans copier les exemples textuels.
  Ne change pas la structure du json rempli juste les valeurs de chaque clefs presente.
  {"titre":"Titre pertinent pour le post.","description_meteo":"Recherche sur internet pour donner une description de la météo d'aujourd hui à Bruxelles en 40 mots pour la période du ${(morePromptInfo?.get('datePickerStart')?.value && morePromptInfo?.get('datePickerEnd')?.value) ? returnPickerDate : dateSelected}.","phrase_accroche":"Propose une phrase accrocheuse d'environ 35 mots qui incite à lire l'article.","article":"${article? article : 'Rédige ici l article en HTML valide minifié en une ligne sans espace, selon la structure détaillée ci-dessous pour les paragraphes du post.'}","citation":"Trouve une citation célèbre en lien avec le titre du post.","image_url":"${image_url}","lien_url_article":{"lien1":"Premier lien utilisé pour rédiger le post.","lien2":"Deuxième lien utilisé pour rédiger le post."},"categorie":"Choisis une catégorie pertinente parmi:${CathegorieJardinage.NATURE +', '+ CathegorieJardinage.POTAGER+', '+ CathegorieJardinage.PLANTE+', '+CathegorieJardinage.JARDIN+', '+CathegorieJardinage.FLEUR+', '+CathegorieJardinage.ARBRE+', '+CathegorieJardinage.ECOLOGIE}."}

  Structure du contenu pour la clé "article" :

  - **Nombre de paragraphes** : L'article doit comporter 6 paragraphes distincts, chacun d'au moins 100 mots.
  - **Structure détaillée de chaque paragraphe** :
    1. '<h4>Ecris un titre accrocheur du paragraphe {n}</h4>'
    2. '<ul><li>Trouve une question en sous-titre du paragraphe {n} (environ 10 mots)</li></ul>'
    3. '<div id="paragraphe-{n}"><p>Rédige un texte du paragraphe {n} avec minimum 100 mots et pas moins !</p></div>'

  **Assure-toi que le JSON soit bien valide et respecte cette structure pour la clé "article". Ne copie pas les exemples textuels donnés, mais suis-les comme modèle de structure.**
`;
    // console.log("ge User PromptUpdated = " + JSON.stringify(test, null, 2))
    return prompt
  }

  getPromptResumeArticle(linkArticle: string) {
    return {
      systemRole: {
        "role": "system",
        "content": `Tu es un expert en redaction d'articles pour un blog de jardinier paysagiste situé à Bruxelles. Lors de la réécriture,
     veille à inclure un maximum de détails issus de l'article original, notamment sur les aspects techniques (comme les caractéristiques des plantes, les méthodes de jardinage, etc.),
     ainsi que les informations précises concernant les lieux, les dates et autres éléments contextuels. Permet toi une seule touche d'humour.
     L article doit être clair précis et détaillé, cite des exemples ou des cas réél , avec une attention particulière aux enjeux écologiques et aux spécificités locales liées au jardinage en Belgique.
    Si l'article d'origine manque de détails sur certains aspects, cherche des informations supplémentaires pertinentes pour enrichir le contenu.
        `
      },
      userRole: {
        "role": "user",
        "content": `"Réécris l'article disponible ici : "${linkArticle}",  structure le texte en 6 chapitres minimum 100 mots chacun avec un titre pour chaque chapitre de +- 10 mots qui donne une accroche."

    `
      }
    }

  }

  getPerplexityPromptSystemFillArticle(){
    const prompt = ` Tu dois remplir des informations en francais, dans un json sur base d'un article qui te sera fourni.`
    return prompt;
  }
  getPromptFillArticlePostData(article: any, image_url: string){
    return {
      systemRole: {
        role: "system",
        content: this.getPerplexityPromptSystemFillArticle()
      },
      userRole: {
        role: "user",
        content: this.getPerplexityPromptUserFindArticle(null, null, formatCurrentDateUs(), article, image_url)
      }
    }
  }

  getPromptSystemUserArticleInHtmlGeneric(article: any): any {
    return {
      systemRole: {
        role: "system",
        content: this.getPromptSystemFormatArticleInHtml()
      },
      userRole: {
        role: "user",
        content: this.getPromptUserFormatArticleInHtml(article)
      }
    }
  }

  getPromptSystemFormatArticleInHtml(){
    const prompt = `tu es un expert en integration html et en mise en page html pour des blogs design`
    return prompt;
  }
  getPromptUserFormatArticleInHtml(article: string): string {
    const prompt: string = `"Pour cet article : ${article}, structure le texte de chaque partie en utilisant les balises HTML suivantes :
      1. Entoure chaque partie avec une balise <span> pour faciliter le style et l'accessibilité.
      2. Insère une balise <br id='link_to_service'> entre le troisième et la quatrième partie pour créer une séparation visuelle.
      3. Chaque partie doit commencer par un titre accrocheur dans une balise <h4>, avec un emoji qui illustre le sujet du paragraphe.
      4. Mette en évidence une phrase clé dans chaque paragraphe en l'entourant avec des balises <b> pour attirer l'attention.
      5. Utilise une mise en forme adaptée à chaque paragraphe pour améliorer la lisibilité :
         - Si le contenu est une liste, utilise les balises <ul><li></li></ul>.
         - Si des informations spécifiques doivent être soulignées, utilise la balise <u>.
         - Pour des termes importants, utilise la balise <em>.
         - Si des informations se prêtent à un format tabulaire, organise-les avec des balises <table><tr><td></td></tr></table>.
      6. Adapte la mise en forme de chaque paragraphe en fonction du contenu, pour rendre le texte plus compréhensible, aéré et agréable à lire."
      Attention le tout doit être dans un html valide. pour pouvoir le rajouter sur ma page html, donc ne rajoute rien d'autre.
`
    return prompt;
  }

}
