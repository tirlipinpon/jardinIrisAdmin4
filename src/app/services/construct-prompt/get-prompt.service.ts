import { Injectable } from '@angular/core';
import {formatCurrentDateUs} from "../../utils/getFormattedDate";
import {afficherCategories} from "../../utils/afficherCategories";

@Injectable({
  providedIn: 'root'
})
export class GetPromptService {

  constructor() { }

  // évaluer une liste d'articles provenant d'une API de news.
  // retourne un objet avec des instructions pour analyser chaque article selon des critères spécifiques liés au jardinage en Belgique.
  getPromptSelectArticle(newsApiData: any): any {
    return {
      systemRole: {
        "role": "system",
        "content": `Tu es un assistant expert en évaluation d'articles pour un blog de jardinier paysagiste en Belgique.
        Ta tâche est d'analyser une liste d'articles pour déterminer s'il y a un article pertinent pour un blog spécialisé dans les thèmes qui se
        rapproche ou en lien indirect du ${afficherCategories(', ')}. Le blog est destiné à un public en Belgique.

        Critères de pertinence :
        - Adaptés à des amateurs ou professionnels.

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

  // rechercher un article spécifique avec l'API Perplexity.
  getPerplexityPromptGenericFindArticle(precisionArticle: any, morePromptInfo: any, returnPickerDate: any, dateSelected: any): any {
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

  // trouver un article pertinent en fonction des critères fournis.
  // Le message contient des instructions détaillées sur la manière de traiter la requête et d'inclure les informations pertinentes.
  getPerplexityPromptSystemFindArticle(precisionArticle: any, morePromptInfo: any, returnPickerDate: any, dateSelected: any) {
    const prompt =   `Tu es un expert jardinier paysagiste en Belgique qui vas écrire sur son blog,
    sur les thématiques de ${afficherCategories(', ')} ou tout ce qui peut intéresser comme sujet pour un jardinier paysagiste.
    ${precisionArticle.description.length ? precisionArticle.description : ''}
    Trouve moi un article de la date  ${(morePromptInfo.get('datePickerStart')?.value&&morePromptInfo.get('datePickerEnd')?.value)? returnPickerDate : dateSelected}
    et réécris le blog le plus fidèlement possible en gardant les infos techniques dates et informations.
    Ta réponse doit être professionnelle, complète et avec une touche d'humour en plus dans le paragraphe 1
    le contenu du message pour ta réponse doit contenir juste le json formaté en inline et valide et rien d'autre.
    et où chaque clé/valeur du JSON est sur une ligne (commence par la parenthèse ouvrante et fini par la parenthèse fermante et rien d'autre.
     `;
    return prompt
  }

  // remplir un JSON valide avec les informations d'un article,
  // basé sur les données d'un article déjà trouvé ou sélectionné.
  getPerplexityPromptUserFindArticle(morePromptInfo: any, returnPickerDate: any, dateSelected: any, article?: any, image_url?: string) {
    const prompt = `
  ${article ? ' Voici l article que tu dois utiliser pour remplir les données ci-dessous' + article : ''}
  Tu vas me renvoyer ce JSON valide rempli avec les informations du post. Assure-toi de bien comprendre chaque instruction et d'adapter les réponses au contexte spécifique sans copier les exemples textuels.
  Ne change pas la structure du json rempli juste les valeurs de chaque clef présente.
  {"titre":"Titre court pertinent pour le post.","description_meteo":"Recherche sur internet pour donner une description de la météo d'aujourd hui à Bruxelles en 40 mots pour
  la période du ${(morePromptInfo?.get('datePickerStart')?.value && morePromptInfo?.get('datePickerEnd')?.value) ? returnPickerDate : dateSelected}.",
  "phrase_accroche":"Propose une phrase accrocheuse d'environ 45 mots qui incite à lire l'article.","article":"${article ? article : 'Rédige ici l article en HTML valide minifié en une ligne sans espace, selon la structure détaillée ci-dessous pour les paragraphes du post.'}","citation":"Trouve une citation célèbre en lien avec le titre du post.","image_url":"${image_url}","lien_url_article":{"lien1":"Premier lien utilisé pour rédiger le post.","lien2":"Deuxième lien utilisé pour rédiger le post."},"categorie":"Choisis une catégorie pertinente parmi:${afficherCategories(', ')}."}

  Structure du contenu pour la clé "article" :

  - **Nombre de paragraphes** : L'article doit comporter 6 paragraphes distincts, chacun d'au moins 100 mots.
  - **Structure détaillée de chaque paragraphe** :
    1. '<h4>Ecris un titre accrocheur du paragraphe {n}</h4>'
    2. '<ul><li>Trouve une question en sous-titre du paragraphe {n} (environ 10 mots)</li></ul>'
    3. '<div id="paragraphe-{n}"><p>Rédige un texte du paragraphe {n} avec minimum 150 mots et pas moins !</p></div>'

  **Assure-toi que le JSON soit bien valide et respecte cette structure pour la clé "article". Ne copie pas les exemples textuels donnés, mais suis-les comme modèle de structure.**
`;
    // console.log("ge User PromptUpdated = " + JSON.stringify(test, null, 2))
    return prompt
  }

  getPerplexityPromptUserWithArticleToJSon(dateSelected: string, image_url: string, titleArticle?: any) {
    const prompt = `
    Voici la structure à utiliser :
    { "titre": "Titre pertinent pour le post sur base de ceci ${titleArticle}.","description_meteo": "Recherche sur internet la météo à Bruxelles en 40 mots pour la date du ${dateSelected}.","phrase_accroche":"Propose une phrase accrocheuse d'environ 35 mots qui incite à lire l'article sur base de ce titre ${titleArticle}.", "article": "NULL", "citation": "Trouve une citation célèbre en lien avec le titre du post:  "${titleArticle}" .", "image_url": "${image_url}", "lien_url_article": { "lien1": "Premier lien utilisé pour rédiger le post.", "lien2": "Deuxième lien utilisé pour rédiger le post." }, "categorie": "Choisis une catégorie pertinente parmi ceux ci: ${afficherCategories(', ')}." }
    Remarques :
    Validation automatique : Assure-toi que le JSON soit bien valide avant de l'envoyer.
    Modifications uniquement sur les valeurs : Ne modifie jamais la structure, change uniquement les valeurs.
    Éviter les erreurs de copie :  Excepté pour "article et image_url Ne copie pas les exemples textuels donnés, mais utilise-les comme modèle de structure."
    `;
    // console.log("ge User PromptUpdated = " + JSON.stringify(test, null, 2))
    return prompt
  }

  // réécrire un article en le résumant,
  // tout en conservant le maximum de détails et en l'adaptant à un blog de jardinier paysagiste en Belgique.
  getPromptResumeArticle(linkArticle: string) {
    return {
      systemRole: {
        "role": "system",
        "content": `Tu es un expert en rédaction d'articles pour un blog de jardinier paysagiste situé à Bruxelles. Lors de la réécriture,
     veille à inclure un maximum de détails issus de l'article original, notamment sur les aspects techniques (comme les caractéristiques des plantes, les méthodes de jardinage, chiffres, dates , lieus , statistiques , etc.),
     ainsi que les informations précises concernant les lieux, les noms, les dates et autres éléments contextuels. Permet toi une seule touche d'humour.
     L article doit être clair précis et trés détaillé; cite des exemples ou des cas réél , avec une attention particulière aux enjeux écologiques et aux spécificités locales liées à la nature en Belgique.
    Si l'article d'origine manque de détails sur certains aspects, cherche des informations supplémentaires pertinentes pour enrichir le contenu.
        `
      },
      userRole: {
        "role": "user",
        "content": `"Réécris en gardant toutes les informations de l'article disponible ici : "${linkArticle}",
        structure le texte en 6 chapitres minimum 150 mots chacun avec un titre pour chaque chapitre de +- 10 mots qui donne une accroche"
    `
      }
    }

  }


  // remplir des informations en français dans un format JSON.
  getPerplexityPromptSystemFillArticle(){
    const prompt = `  Tu vas recevoir un titre d'article de blog que tu dois utiliser pour remplir les données ci-dessous :.
      Tu vas me renvoyer un JSON valide rempli avec les informations du post.
      Assure-toi de bien comprendre chaque instruction et d'adapter les réponses au contexte spécifique sans copier les exemples textuels.
      Ne change pas la structure du JSON, modifie uniquement les valeurs de chaque clé.
      Prends soin d'échapper les caractères spéciaux (comme les guillemets, les backslashes, etc.) pour garantir un JSON valide.

      Exigences spécifiques :
      Structure du JSON : Conserve exactement la même structure. Assure-toi que le format respecte strictement le JSON.
      Caractères spéciaux : Échappe les caractères spéciaux comme les guillemets ("), les barres obliques inversées (\), et vérifie qu'aucun texte inséré ne corrompt la structure du JSON.
      Validité du JSON : Valide le JSON final pour garantir qu'il ne contient aucune erreur de syntaxe. Si une donnée pourrait invalider le JSON (par exemple, un caractère spécial),
      corrige-le automatiquement en respectant les bonnes pratiques d'échappement.
      `
    return prompt;
  }

  // remplir un JSON avec des informations sur un post d'article et une image associée.
  getPromptGenericFillArticlePostData(image_url: string, article?: any, ){
    return {
      systemRole: {
        role: "system",
        content: this.getPerplexityPromptSystemFillArticle()
      },
      userRole: {
        role: "user",
        content: this.getPerplexityPromptUserWithArticleToJSon(formatCurrentDateUs(), image_url, article)
      }
    }
  }


  // formater un article en HTML avec des balises spécifiques.
  getPromptGenericArticleInHtml(article: any): any {
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
  // formater l'article en HTML,
  getPromptSystemFormatArticleInHtml(){
    const prompt = `tu es un expert en integration html et en mise en page html pour des blogs design`
    return prompt;
  }
  // structurer un article en utilisant des balises HTML spécifiques.
  // <span>, <h4>, <b>, et <ul> pour une mise en forme efficace et lisible.
  getPromptUserFormatArticleInHtml(article: string): string {
    const prompt: string = `
      "Pour cet article : ${article}, structure chaque partie en utilisant les balises HTML suivantes, en veillant à respecter scrupuleusement chaque règle :
        1. Entoure chaque partie d'un paragraphe avec une balise <span> pour faciliter le style et l'accessibilité.
        2. Insère une balise <br id='link_to_service'> **précisément entre le troisième et quatrième paragraphe**, sans exception, pour créer une séparation visuelle.
        3. Chaque paragraphe commence par un titre accrocheur dans une balise <h4>, accompagné d'un emoji illustrant le sujet du paragraphe.
        4. Mette en évidence une phrase clé dans chaque paragraphe en l'entourant de balises <b> pour attirer l'attention.
        5. Adapte la mise en forme pour chaque type de contenu :
           - Pour une liste, utilise <ol><li></li></ol>.
           - Pour souligner des informations spécifiques, utilise <u>.
           - Pour des termes importants, utilise <em>.
           - Pour un format tabulaire, utilise <table><tr><td></td></tr></table>.
        6. La structure HTML doit être **parfaitement valide**, sans ajouter d'éléments superflus pour que l'intégration directe dans la page HTML soit possible.
        Respecte strictement toutes les consignes pour chaque paragraphe."
        `
      return prompt;
  }


  getPromptGenericArticleSearchByCriteria(precisionArticle: any): any {
    return {
      systemRole: {
        role: "system",
        content: this.getPromptSystemArticleSearchByCriteria()
      },
      userRole: {
        role: "user",
        content: this.getPromptUserArticleSearchByCriteria(precisionArticle)
      }
    }
  }
  getPromptSystemArticleSearchByCriteria(){
    const prompt = `Tu es un expert jardinier paysagiste en Belgique qui vas écrire sur son blog,
    sur les thématiques de ${afficherCategories(', ')} ou tout ce qui peut intéresser comme sujet pour un jardinier paysagiste.
    Trouve moi un article de la date  ${formatCurrentDateUs()}
    et réécris le blog le plus fidèlement possible en gardant les infos techniques dates et informations.
    Ta réponse doit être professionnelle, complète et avec une seul touche d'humour
    le contenu du message pour ta réponse doit contenir juste le json formaté en inline et valide et rien d'autre.
    et où chaque clé/valeur du JSON est sur une ligne (commence par la parenthèse ouvrante et fini par la parenthèse fermante et rien d'autre.`
    return prompt;
  }
  getPromptUserArticleSearchByCriteria(precisionArticle: any){
    const prompt = `${precisionArticle}`
    return prompt;
  }


  getPromptGenericAddInternalLinkInArticle(article: any, listTitreId: any): any {
    return {
      systemRole: {
        role: "system",
        content: this.getPromptSystemAddInternalLinkInArticle()
      },
      userRole: {
        role: "user",
        content: this.getPromptUserAddInternalLinkInArticle(article, listTitreId)
      }
    }
  }
  getPromptSystemAddInternalLinkInArticle() {
    const prompt = `Votre tâche est d'insérer des liens hypertextes spécifiques dans un article fourni, en suivant les directives énoncées ici.
              **Ne modifiez aucune portion du texte de l'article en dehors de l'insertion des liens hypertextes spécifiés**.

              - Toutes les balises de liens hypertextes doivent être placées exclusivement selon les règles décrites ci-dessous.

              1. **Source des Liens**:
                 - Utilisez le JSON fourni, qui contient une liste d'articles, chacun avec un 'id' et un 'titre'.

              2. **Insertion des Liens**:
                 - Parcourez le texte de l'article pour localiser les occurrences pertinentes des titres spécifiés dans le JSON.
                 - Pour chaque titre trouvé, insérez une balise HTML comme suit :
                   \`<a class=\\"myTooltip\\" href=\\"https://jardin-iris.be/blog-detail.html?post={id}\\" id=\\"{id}\\" title=\\"{titre}\\">{mot_clé}</a>\`.
                 - Remplissez correctement les placeholders \`{id}\`, \`{titre}\`, et \`{mot_clé}\` avec :
                   - \`{id}\` : l'identifiant unique de l'article,
                   - \`{titre}\` : le titre correspondant tiré du JSON,
                   - \`{mot_clé}\` : le mot ou l'expression de l'article qui correspond.

              3. **Règles de Placement** :
                 - **Un lien par article**: Un titre du JSON lié à un article spécifique ne peut être relié qu'une seule fois dans tout l'article; aucune répétition de liens pour le même contenu.
                 - **Limites par section :** Dans chaque section de l'article (exemple : paragraphes délimités), faites en sorte de ne pas insérer plus de trois liens pour éviter de surcharger la lecture.
                 - **Pas de redondance** : Ne créez pas de liens sur des mots multiples ou expressions qui apparaissent à plusieurs reprises. Privilégiez les occurrences qui sont les plus spécifiques ou représentatives du titre.

              4. **Exactitude et Non-Modification du Texte :**
                 - Le texte d’origine ne doit pas être modifié à d’autres fins (pas d’ajout ou de modification de contenu autre que celles mentionnées pour y insérer des liens).

              # Output Format

              Retournez l'article sous forme de texte, dans lequel les liens sont insérés conformément aux directives, **sans aucune modification ou adaptation supplémentaire à l'article original en dehors de
               l’insertion de liens hypertextes**. Assurez-vous que l'output soit proprement formaté et sans ajout d'informations externes.
`;
    return prompt;
  }

  getPromptUserAddInternalLinkInArticle(article: string, listTitreId: any): string {
    const prompt: string = `Voici un tableau JSON contenant des articles avec les champs 'titre' et 'id' : ${JSON.stringify(listTitreId)}.
    Voici l'article à traiter : ${JSON.stringify(article)}. Insérez les liens hypertextes conformément aux directives fournies, sans modifier le texte original
`;

    return prompt;
  }


  getPromptGenericSelectKeyWordsFromChapitresInArticle(titreArticle: string, chapitreKeyWordList: string[]) {
    return {
      systemRole: {
        role: "system",
        content: this.getPerplexityPromptSystemSelectKeyWordsFromChapitresInArticle()
      },
      userRole: {
        role: "user",
        content: this.getPerplexityPromptUserSelectKeyWordsFromChapitresInArticle(titreArticle, chapitreKeyWordList)
      }
    }
  }

  getPerplexityPromptSystemSelectKeyWordsFromChapitresInArticle(){
    const prompt = `Je vais effectuer une recherche d'image sur le site Unsplash.com en utilisant un mot-clé unique.
    Le texte de blog que je vais fournir  et il est crucial que ce mot-clé soit extrait de ce titre.
    Identifie un mot qui représente le mieux le sujet central ou l'atmosphère de ce titre afin de maximiser la pertinence des images.
    Ce mot doit résumer efficacement l'essence de ce titre.`
    return prompt;
  }

  getPerplexityPromptUserSelectKeyWordsFromChapitresInArticle(titreArticle: string, chapitreKeyWordList: string[]){
    const prompt = `Voici le titre: ${titreArticle}.
    Extrait un seul mot en anglais qui résume le mieux le contenu, en suivant ce format JSON: {"keyWord":"{mot}"}.
    Si la liste n'est pas vide : ( ${chapitreKeyWordList} ) , choisi un autre mot que ceux qui sont deja dans cette liste.`
    return prompt;
  }


  getPromptGenericSelectBestImageForChapitresInArticle(article: string, images: any) {
    return {
      systemRole: {
        role: "system",
        content: this.getPerplexityPromptSystemcSelectBestImageForChapitresInArticle()
      },
      userRole: {
        role: "user",
        content: this.getPerplexityPromptUserSelectBestImageForChapitresInArticle(article, images)
      }
    }
  }

  getPerplexityPromptSystemcSelectBestImageForChapitresInArticle(){
    const prompt = `Tu es une IA spécialisée dans l'analyse de textes et la sélection d'illustrations adaptées pour un blog de jardinier paysagiste.
            Ta tâche consiste à lire un texte.
            En analysant le contenu du texte, identifie les thèmes, le ton, et les éléments visuels ou concepts clés qui pourraient être illustrés.
            À partir d'une liste d'URL d'images, trouve celle qui représente le mieux le contenu de ce texte,
            en considérant l'aspect narratif et la cohérence avec le style du texte.
            Si tu ne trouve pas d'image adaptée ne donne pas de réponse`
    return prompt;
  }

  getPerplexityPromptUserSelectBestImageForChapitresInArticle(article: string, images: any){
    const prompt = `Voici le texte  : ${article}, ainsi qu'une liste d'URL d'images ${JSON.stringify(images)}.
            Analyse le contenu du texte pour en extraire les thèmes et concepts principaux, et choisis l'image la plus représentative de cette partie du texte destinée sur un blog de jardinier.
            Assure-toi que l'image sélectionnée illustre bien l'ambiance et les éléments visuels pertinents.
            Si il n y a pas d'image adapté renvoie une url vide.
            Donne l'url de l'image choisie en suivant ce format JSON: {"imageUrl":"{url}"}`
    return prompt;
  }



}
