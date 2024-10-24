import {Component, inject} from '@angular/core';
import {lastValueFrom, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";


import {environment} from "../../../../environment";
import {createClient, SupabaseClient} from "@supabase/supabase-js";
import OpenAI from "openai";




@Component({
  selector: 'app-post-general',
  standalone: true,
  imports: [
  ],
  templateUrl: './post-general.component.html',
  styleUrl: './post-general.component.css'
})



export class PostGeneralComponent {
  openai = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: environment.openAiApiKey
  });
  private supabase: SupabaseClient
  image_url: any = '';
  precisionArticle: any = '';
  textPromptImage = "créé moi une image avec peu d'éléments ', concentre toi sur le sujet que je vais te donner, car cette image vas allez comme illustration d'un blog, et ne met surtout aucun de texte sur l'image , voici le sujet : ";
  dataTitleSubjectArticle: string = '';
  formatedDataArticleForPost: string = '';
  dataToResume: any = null;
  private apiUrl = `https://api.thenewsapi.com/v1/news/all?api_token=${environment.newsApiToken}
    &search_fields=title,description,main_text
    &categories=general,tech,travel,entertainment,business,food,politics
    &exclude_categories=sports
    &published_on=${this.formatCurrentDateUs()}
    &search=belgique+(${this.afficherCategories('|')})
    &language=fr,nl,en
    &page=1`;



  http = inject(HttpClient);

  constructor() {

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)

  }
  getPromptGenericFillArticlePostData(image_url: string, titleArticle?: any, ){
    return {
      systemRole: {
        role: "system",
        content: `  Tu vas recevoir un titre d'article de blog que tu dois utiliser pour remplir les données ci-dessous :.
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
      },
      userRole: {
        role: "user",
        content: `
    Voici la structure à utiliser :
    { "titre": "Titre pertinent pour le post sur base de ceci ${titleArticle}.","description_meteo": "Recherche sur internet la météo à Bruxelles en 40 mots pour la date du ${this.formatCurrentDateUs()}.","phrase_accroche":"Propose une phrase accrocheuse d'environ 35 mots qui incite à lire l'article sur base de ce titre ${titleArticle}.", "article": "NULL", "citation": "Trouve une citation célèbre en lien avec le titre du post:  "${titleArticle}" .", "image_url": "${image_url}", "lien_url_article": { "lien1": "Premier lien utilisé pour rédiger le post.", "lien2": "Deuxième lien utilisé pour rédiger le post." }, "categorie": "Choisis une catégorie pertinente parmi ceux ci: ${this.afficherCategories(', ')}." }
    Remarques :
    Validation automatique : Assure-toi que le JSON soit bien valide avant de l'envoyer.
    Modifications uniquement sur les valeurs : Ne modifie jamais la structure, change uniquement les valeurs.
    Éviter les erreurs de copie :  Excepté pour "article et image_url Ne copie pas les exemples textuels donnés, mais utilise-les comme modèle de structure."
    `
      }
    }
  }
  getPromptGenericArticleInHtml(article: any): any {
    return {
      systemRole: {
        role: "system",
        content: `tu es un expert en integration html et en mise en page html pour des blogs design`

      },
      userRole: {
        role: "user",
        content: `Pour cet article : ${article}, structure le texte de chaque partie en utilisant les balises HTML suivantes :
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
      }
    }
  }
  getPromptResumeArticle(linkArticle: string) {
    return {
      systemRole: {
        "role": "system",
        "content": `Tu es un expert en rédaction d'articles pour un blog de jardinier paysagiste situé à Bruxelles. Lors de la réécriture,
     veille à inclure un maximum de détails issus de l'article original, notamment sur les aspects techniques (comme les caractéristiques des plantes, les méthodes de jardinage, etc.),
     ainsi que les informations précises concernant les lieux, les noms, les dates et autres éléments contextuels. Permet toi une seule touche d'humour.
     L article doit être clair précis et trés détaillé; cite des exemples ou des cas réél , avec une attention particulière aux enjeux écologiques et aux spécificités locales liées à la nature en Belgique.
    Si l'article d'origine manque de détails sur certains aspects, cherche des informations supplémentaires pertinentes pour enrichir le contenu.
        `
      },
      userRole: {
        "role": "user",
        "content": `"Réécris l'article disponible ici : "${linkArticle}",
        structure le texte en 6 chapitres minimum 100 mots chacun avec un titre pour chaque chapitre de +- 10 mots qui donne une accroche"
    `
      }
    }
  }
  getPromptSelectArticle(newsApiData: any): any {
    return {
      systemRole: {
        "role": "system",
        "content": `Tu es un assistant expert en évaluation d'articles pour un blog de jardinier paysagiste en Belgique.
        Ta tâche est d'analyser une liste d'articles pour déterminer s'il y a un article pertinent pour un blog spécialisé dans les thèmes qui se rapproche ou en lien indirect du ${this.afficherCategories(', ')}. Le blog est destiné à un public en Belgique.

        Critères de pertinence :
        - L'article doit être adapté au contexte belge.
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
  fetchData(prompt: any): Promise<any> {
    const jsonObject = {
      model: "llama-3.1-sonar-large-128k-online",
      messages: [
        prompt.systemRole,
        prompt.userRole
      ],
      max_tokens: 3000,
      temperature: 0.2,
      top_p: 0.9,
      return_citations: true,
      return_images: false,
      return_related_questions: true,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1
    };
    const jsonString = JSON.stringify(jsonObject, null, 2);
    const options = {
      method: 'POST',
      headers: {Authorization: 'Bearer '+environment.perplexcityApi , 'Content-Type': 'application/json'},
      body: jsonString
    };

    // return this.MockgetMessageContent()
    return fetch('https://api.perplexity.ai/chat/completions', options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(err => console.error(err));
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
  async updateIdeaPostById(id: number, fk_idPost: number) {
    try {
      const { data, error } = await this.supabase
        .from('ideaPost')
        .update({
          deleted: true,
          fk_id_post: fk_idPost
        })
        .eq('id', id)
      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
  async updateImageUrlPostByIdForm(idPost: number, json64: string) {
    try {
      const { data, error } = await this.supabase
        .from('post')
        .update({ image_url: json64 })
        .eq('id', idPost)
        .select()

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async setNewPostForm(value: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('post')
        .insert([value])
        .select();

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getFirstIdeaPostByMonth(month: number, year: number) {
    const { data, error } = await this.supabase
      .from('ideaPost')
      .select('id, description')
      .gte('created_at', `${year}-${month.toString().padStart(2, '0')}-01`) // Ajout de padStart pour le format
      .lt('created_at', `${year}-${(month + 1).toString().padStart(2, '0')}-01`) // Gestion du mois suivant
      .eq('deleted', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.log(' Erreur lors de la récupération des posts: ' + (error))
      return error
    } else {
      console.log("getFirstIdeaPostByMonth = " + JSON.stringify(data, null, 2))
      return data;
    }
  }

  afficherCategories(charactereJoin: string): string {
    enum CathegoriesBlog {
      ARBRE = "arbre",
      ECOLOGIE = "écologie",
      FLEUR = "fleur",
      JARDIN = "jardin",
      NATURE = "nature",
      PLANTE = "plante",
      POTAGER = "potager",
      FAUNE = "faune"
    }
    // On récupère les valeurs de l'enum sous forme de tableau
    return Object.values(CathegoriesBlog).join(charactereJoin);
  }


  getNewsApi(): Observable<any> {
    return this.http.get<any>(this.apiUrl)
  }
  mapperNewsApi(news: any): {url: string, image_url: string}[] {
    return news.data.map((article: any) => {
      return {
        url: article.url,
        image_url: article.image_url
      };
    });
  }

  formatCurrentDateUs() : string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0 donc on ajoute 1
    const day = String(date.getDate()).padStart(2, '0');
    // Formate la date au format YYYY-MM-DD
    return `${year}-${month}-${day}`;
  }

  extractJSONBlock(input: string): string {
    const regex = /```json\s([\s\S]*?)\s```/;
    const match = input.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return input; // Si aucun bloc JSON trouvé,
  }

  extractHTMLBlock(input: string): string {
    const regex = /```html\s([\s\S]*?)\s```/;
    const match = input.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return input; // Si aucun bloc JSON trouvé,
  }

  inLineString(chaine: string) {
    // Remplace les retours à la ligne (\n) et les espaces multiples par un seul espace
    return chaine.replace(/\s+/g, ' ').trim();
  }

  mapToPost(data: any): any {
    const post: any = {
      titre: data.titre || '',
      description_meteo: data.description_meteo || '',
      phrase_accroche: data.phrase_accroche || '',
      article: data.article || '',
      citation: data.citation || '',
      lien_url_article: data.lien_url_article || '',
      image_url: data.image_url || '',
      categorie: data.categorie || '',
      visite: data.visite || 0,
      valid: data.valid || false,
      deleted: data.deleted || false,
      video: data.video || ''
    };

    if (data.id) {
      post.id = data.id;
    }
    if (data.created_at) {
      post.created_at = data.created_at;
    }

    return post;
  }

  escapeHtmlForJson(html: string): string {
    const test =  html
      .replace(/\\/g, '\\\\')  // Échappe les backslashes
      .replace(/"/g, '\\"')     // Échappe les guillemets doubles
      // .replace(/'/g, "\\'")     // Échappe les guillemets simples
      // .replace(/’/g, "\\’")     // Échappe les apostrophes
      // .replace(/\n/g, '\\n')    // Échappe les sauts de ligne
      .replace(/\r/g, '\\r')    // Échappe les retours chariot
      .replace(/\t/g, '\\t');   // Échappe les tabulations
    return test;
  }

  compressImage(base64Str: any, maxWidth = 800, maxHeight = 600): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Si la chaîne ne contient pas de type MIME, on ajoute un préfixe par défaut
        if (!base64Str.startsWith('data:image/')) {
          // Supposons que c'est une image JPEG par défaut (tu peux adapter cela)
          base64Str = 'data:image/jpeg;base64,' + base64Str;
        }

        const matches = base64Str.match(/data:(.*?);base64,/);
        if (!matches || matches.length < 2) {
          reject("Erreur : Impossible de trouver le type MIME dans la chaîne base64.");
          return;
        }

        const mimeType = matches[1]; // Extraire le type MIME

        // Convertir la chaîne base64 en Blob
        const imageBlob = this.base64ToBlob(base64Str, mimeType);

        // Créer un objet URL pour l'image Blob
        const imageUrl = URL.createObjectURL(imageBlob);

        let img = new Image();
        img.src = imageUrl;

        img.onload = () => {
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');

          if (ctx) {
            // Calculer le ratio de redimensionnement
            let ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            let width = img.width * ratio;
            let height = img.height * ratio;

            // Redimensionner l'image
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Obtenir l'image redimensionnée au format base64
            resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compression à 70%
          } else {
            reject("Erreur : Impossible de récupérer le contexte 2D du canvas.");
          }
        };

        img.onerror = (error) => {
          reject("Erreur lors du chargement de l'image : " + error);
        };
      } catch (error) {
        reject("Erreur lors de la conversion : " + error);
      }
    });
  }

  base64ToBlob(base64: any, mimeType: any) {
    const byteString = atob(base64.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  }

  getRandomIntInclusive(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
  }

  async process() {
    try {
      await this.searchArticleValide();
    } catch (error) {
      console.error("Erreur lors du traitement initial : ", error);
    }
  }

  async searchArticleValide() {
    try {
      const dataMappedFromTheNewsApi = this.mapperNewsApi(await lastValueFrom(this.getNewsApi()));
      const dataFromOpenAiSelectionArticle: any = await this.fetchData(this.getPromptSelectArticle(dataMappedFromTheNewsApi));
      const resultMappedArticles = JSON.parse(this.extractJSONBlock(dataFromOpenAiSelectionArticle.choices[0].message.content));
      if (resultMappedArticles.valide) {
        await this.processArticle(resultMappedArticles);
      } else {
        this.getIdeaPost();
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de l'article valide : ", error);
    }
  }

  getIdeaPost() {
    this.getFirstIdeaPostByMonth(new Date().getMonth() + 1, new Date().getFullYear())
      .then((r: any) => {
        try {
          this.precisionArticle = r[0];
          this.processArticle(r[0].description);
        } catch (error) {
          console.error("Erreur lors de la récupération de l'idée de post : ", error);
        }
      })
      .catch((error: any) => {
        console.error("Erreur lors de l'appel Supabase pour récupérer l'idée de post : ", error);
      });
  }

  async processArticle(dataToResume: any) {
    try {
      this.dataToResume = dataToResume;
      this.image_url = dataToResume.image_url ? dataToResume.image_url : "https://picsum.photos/400/300";
      this.dataTitleSubjectArticle = dataToResume.url ? dataToResume.url : dataToResume;
      const resumedArticleFetch: any = await this.fetchData(this.getPromptResumeArticle(this.dataTitleSubjectArticle));
      const articleFormatedInHtml = await this.fetchData(this.getPromptGenericArticleInHtml(resumedArticleFetch.choices[0].message.content));
      this.formatedDataArticleForPost = this.formatDataForPost(articleFormatedInHtml.choices[0].message.content);
      this.processDataInJson();
    } catch (error) {
      console.error("Erreur lors du traitement de l'article : ", error);
    }
  }

  formatDataForPost(dataToFormat: any) {
    try {
      const extractedHTMLBlock = this.extractHTMLBlock(dataToFormat);
      const escapedHtmlForJson = this.escapeHtmlForJson(extractedHTMLBlock);
      const inLinedString = this.inLineString(escapedHtmlForJson);
      return inLinedString;
    } catch (error) {
      console.error("Erreur lors du formatage des données de l'article : ", error);
      return '';
    }
  }

  processDataInJson() {
    let parsedInJson: any = null;
    this.fetchData(this.getPromptGenericFillArticlePostData(this.image_url, this.dataTitleSubjectArticle))
      .then((resultArticleInPostData: any) => {
        try {
          parsedInJson = JSON.parse(this.extractJSONBlock(resultArticleInPostData.choices[0].message.content));
          parsedInJson.article = this.formatedDataArticleForPost;
          this.setNewPostForm(this.mapToPost(parsedInJson))
            .then(async (lastPost: any[]) => {
              await this.updateImageUrlResizedAndIdeaPost(lastPost[0].id);
            })
            .catch((error:any) => {
              console.error("Erreur lors de l'insertion du post dans Supabase : ", error);
            });
        } catch (error) {
          console.error('Erreur lors du parsing JSON ou traitement :', error);
          setTimeout(() => {
            this.processArticle(this.dataToResume);
          }, 1000);
        }
      })
      .catch((error: any) => {
        console.error("Erreur lors de la récupération des données de l'article : ", error);
      });
  }

  async updateImageUrlResizedAndIdeaPost(lastIdPost: number) {
    try {
      if (this.precisionArticle.id) {
        this.image_url = await this.imageGenerartor(this.textPromptImage + this.precisionArticle.description + ' dans ce style ci : ' + this.getStyleForToday(this.getRandomIntInclusive(1, 31)));
        this.image_url = await this.compressImage(this.image_url, 500, 300);
        await this.updateImageUrlPostByIdForm(lastIdPost, this.image_url);
        if (this.precisionArticle.id) {
          await this.updateIdeaPostById(this.precisionArticle.id, lastIdPost);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'URL de l'image ou de l'idée de post : ", error);
    }
  }

  getStyleForToday(randomNumber?: number): string {
    const styles = [
      "minimalist, flat color blocks, clear lines",
      "cartoonish, playful with soft edges",
      "geometric shapes with pastel tones",
      "line art with subtle watercolor touches",
      "bold outlines with a single accent color",
      "abstract with smooth gradients and curves",
      "vintage poster style with muted colors",
      "low-poly with simple facets",
      "monochrome, using light and shadow for contrast",
      "pop-art inspired, vibrant colors and patterns",
      "collage-inspired, mixed textures and cut-outs",
      "sketch style with rough pencil textures",
      "pixel art, blocky and retro",
      "neon outlines with a dark background",
      "paper cut-out effect with layered shapes",
      "silhouette style with a single color palette",
      "sci-fi digital interface look with glowing elements",
      "chalkboard drawing with hand-drawn chalk textures",
      "glossy 3D look with simple shapes and reflections",
      "modern vector art with clean, flowing lines",
      "isometric perspective with clean, 3D shapes",
      "childlike doodles with crayon texture",
      "graffiti-inspired with bold strokes and spray paint effect",
      "stencil-style with cutout shapes and solid colors",
      "claymation-inspired, soft textures and rounded edges",
      "retro pixel art with bright, contrasting colors",
      "gradient overlays with soft, blurry edges",
      "hand-painted brush strokes with rich texture",
      "comic book style with halftone shading and bold lines",
      "shadow play with strong contrasts and minimal shapes",
      "origami-inspired with folded paper textures"
    ];
    const currentDay = (randomNumber !== undefined && randomNumber > 0) ? randomNumber : new Date().getDate();
    return styles[(currentDay - 1) % styles.length];
  }
}
