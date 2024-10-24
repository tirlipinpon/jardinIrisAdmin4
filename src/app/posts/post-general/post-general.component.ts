import {Component} from '@angular/core';
import {lastValueFrom} from "rxjs";
import {DatePipe, NgIf} from "@angular/common";
import {TheNewsApiService} from "../../services/the-news-api/the-news-api.service";
import {PerplexityService} from "../../services/perplexity/perplexity.service";
import {OpenaiService} from "../../services/openai/openai.service";
import {GetPromptService} from "../../services/construct-prompt/get-prompt.service";
import {SupabaseService} from "../../services/supabase/supabase.service";
import {ChronometreComponent} from "../../shared/chronometre/chronometre/chronometre.component";
import {Post} from "../../shared/types/post";
import {extractHTMLBlock, extractJSONBlock} from "../../utils/cleanJsonObject";
import {mapToPost} from "../../utils/mapJsonToPost";
import {escapeHtmlForJson} from "../../utils/escapeHtmlForJson";
import {compressImage} from "../../utils/resizeB64JsonIMage";
import {getRandomIntInclusive} from "../../utils/randomBetweenTwooNumberInclusive";
import {inLineString} from "../../utils/inLineString";

@Component({
  selector: 'app-post-general',
  standalone: true,
  imports: [
    ChronometreComponent,
    NgIf,
    DatePipe
  ],
  templateUrl: './post-general.component.html',
  styleUrl: './post-general.component.css'
})

export class PostGeneralComponent {
  image_url: any = '';
  precisionArticle: any = '';
  textPromptImage = "créé moi une image avec peu d'éléments ', concentre toi sur le sujet que je vais te donner, car cette image vas allez comme illustration d'un blog, et ne met surtout aucun de texte sur l'image , voici le sujet : ";
  dataTitleSubjectArticle: string = '';
  formatedDataArticleForPost: string = '';
  dataToResume: any = null;

  constructor(private theNewsApiService: TheNewsApiService,
              private perplexityService: PerplexityService,
              private openaiService: OpenaiService,
              private getPromptService: GetPromptService,
              private supabaseService: SupabaseService) {}

  async process() {
    try {
      await this.searchArticleValide();
    } catch (error) {
      console.error("Erreur lors du traitement initial : ", error);
    }
  }

  async searchArticleValide() {
    try {
      const dataMappedFromTheNewsApi = this.theNewsApiService.mapperNewsApi(await lastValueFrom(this.theNewsApiService.getNewsApi()));
      const dataFromOpenAiSelectionArticle: any = await this.perplexityService.fetchData(this.getPromptService.getPromptSelectArticle(dataMappedFromTheNewsApi));
      const resultMappedArticles = JSON.parse(extractJSONBlock(dataFromOpenAiSelectionArticle.choices[0].message.content));
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
    this.supabaseService.getFirstIdeaPostByMonth(new Date().getMonth() + 1, new Date().getFullYear())
      .then((r: any) => {
        try {
          this.precisionArticle = r[0];
          this.processArticle(r[0].description);
        } catch (error) {
          console.error("Erreur lors de la récupération de l'idée de post : ", error);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de l'appel Supabase pour récupérer l'idée de post : ", error);
      });
  }

  async processArticle(dataToResume: any) {
    try {
      this.dataToResume = dataToResume;
      this.image_url = dataToResume.image_url ? dataToResume.image_url : "https://picsum.photos/400/300";
      this.dataTitleSubjectArticle = dataToResume.url ? dataToResume.url : dataToResume;
      const resumedArticleFetch: any = await this.perplexityService.fetchData(this.getPromptService.getPromptResumeArticle(this.dataTitleSubjectArticle));
      const articleFormatedInHtml = await this.perplexityService.fetchData(this.getPromptService.getPromptGenericArticleInHtml(resumedArticleFetch.choices[0].message.content));
      this.formatedDataArticleForPost = this.formatDataForPost(articleFormatedInHtml.choices[0].message.content);
      this.processDataInJson();
    } catch (error) {
      console.error("Erreur lors du traitement de l'article : ", error);
    }
  }

  formatDataForPost(dataToFormat: any) {
    try {
      const extractedHTMLBlock = extractHTMLBlock(dataToFormat);
      const escapedHtmlForJson = escapeHtmlForJson(extractedHTMLBlock);
      const inLinedString = inLineString(escapedHtmlForJson);
      return inLinedString;
    } catch (error) {
      console.error("Erreur lors du formatage des données de l'article : ", error);
      return '';
    }
  }

  processDataInJson() {
    let parsedInJson: any = null;
    this.perplexityService.fetchData(this.getPromptService.getPromptGenericFillArticlePostData(this.image_url, this.dataTitleSubjectArticle))
      .then((resultArticleInPostData: any) => {
        try {
          parsedInJson = JSON.parse(extractJSONBlock(resultArticleInPostData.choices[0].message.content));
          parsedInJson.article = this.formatedDataArticleForPost;
          this.supabaseService.setNewPostForm(mapToPost(parsedInJson))
            .then(async (lastPost: Post[]) => {
              await this.updateImageUrlResizedAndIdeaPost(lastPost[0].id);
            })
            .catch((error) => {
              console.error("Erreur lors de l'insertion du post dans Supabase : ", error);
            });
        } catch (error) {
          console.error('Erreur lors du parsing JSON ou traitement :', error);
          setTimeout(() => {
            this.processArticle(this.dataToResume);
          }, 1000);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données de l'article : ", error);
      });
  }

  async updateImageUrlResizedAndIdeaPost(lastIdPost: number) {
    try {
      if (this.precisionArticle.id) {
        this.image_url = await this.openaiService.imageGenerartor(this.textPromptImage + this.precisionArticle.description + ' dans ce style ci : ' + this.getStyleForToday(getRandomIntInclusive(1, 31)));
        this.image_url = await compressImage(this.image_url, 500, 300);
        await this.supabaseService.updateImageUrlPostByIdForm(lastIdPost, this.image_url);
        if (this.precisionArticle.id) {
          await this.supabaseService.updateIdeaPostById(this.precisionArticle.id, lastIdPost);
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
