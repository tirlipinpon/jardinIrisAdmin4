import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TheNewsApiService} from "../../services/the-news-api/the-news-api.service";
import {lastValueFrom} from "rxjs";
import {PerplexityService} from "../../services/perplexity/perplexity.service";
import {OpenaiService} from "../../services/openai/openai.service";
import {GetPromptService} from "../../services/construct-prompt/get-prompt.service";
import {extractHTMLBlock, extractJSONBlock} from "../../utils/cleanJsonObject";
import {mapToPost} from "../../utils/mapJsonToPost";
import {SupabaseService} from "../../services/supabase/supabase.service";
import {Post} from "../../shared/types/post";
import {escapeHtmlForJson} from "../../utils/escapeHtmlForJson";
import {compressImage} from "../../utils/resizeB64JsonIMage";
import {getRandomIntInclusive} from "../../utils/randomBetweenTwooNumberInclusive";
import {inLineString} from "../../utils/inLineString";
import {ChronometreComponent} from "../../shared/chronometre/chronometre/chronometre.component";
import {DatePipe, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {formatCurrentDateUs} from "../../utils/getFormattedDate";
import {Editor, NgxEditorModule, Toolbar} from "ngx-editor";

@Component({
  selector: 'app-post-general',
  standalone: true,
  imports: [
    ChronometreComponent,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
    NgxEditorModule
  ],
  templateUrl: './post-general.component.html',
  styleUrl: './post-general.component.css'
})
export class PostGeneralComponent implements OnInit, OnDestroy {
  // @ts-ignore
  postForm: FormGroup;
  image_url: any = '';
  precisionArticle: any = ''
  textPromptImage= "créé moi une image avec peu d'éléments ', concentre toi sur le sujet que je vais te donner, car cette image vas allez comme illustration d'un blog, et ne met surtout aucun de texte sur l'image , voici le sujet : "
  dataTitleSubjectArticle: string = ''
  formatedDataArticleForPost: string = ''
  dataToResume: any = null;
  url_post = "";
  isLoading = false;
  isEditorTextON : boolean = true
  // @ts-ignore
  editor: Editor;
  toolbar: Toolbar = [
    // default value
    ["bold", "italic"],
    ["underline", "strike"],
    ["code", "blockquote"],
    ["ordered_list", "bullet_list"],
    [{ heading: ["h1", "h2", "h3", "h4", "h5", "h6"] }],
    ["link", "image"],
    ["text_color", "background_color"],
    ["align_left", "align_center", "align_right", "align_justify"],
  ];
  protected readonly formatCurrentDateUs = formatCurrentDateUs;
  @ViewChild(ChronometreComponent) chronometreComponent!: ChronometreComponent;

  constructor(private theNewsApiService: TheNewsApiService,
              private perplexityService: PerplexityService,
              private openaiService: OpenaiService,
              private getPromptService: GetPromptService,
              private supabaseService: SupabaseService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.editor = new Editor();
    this.postForm = this.fb.group({
      id: [''],
      created_at: ['', Validators.required],
      titre: ['', Validators.required],
      description_meteo: ['', Validators.required],
      phrase_accroche: ['', Validators.required],
      article: ['', Validators.required],
      citation: ['', Validators.required],
      lien_url_article: ['', Validators.required],
      categorie: ['', Validators.required],
      image_url: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  async process() {
    this.chronometreComponent.startChronometre()
    this.isLoading = true;
    this.url_post.length ? await this.processArticle(this.url_post) :  await this.searchArticleValide()
    // const base64LengthResize = (respResize.length * (3/4)) - (respResize.includes('==') ? 2 : respResize.includes('=') ? 1 : 0);
    // console.log(`La taille de l'image Base64 est de ${base64LengthResize / 1024} Ko`);
  }

  async searchArticleValide() {
    const dataMappedFromTheNewsApi = this.theNewsApiService.mapperNewsApi(await lastValueFrom(this.theNewsApiService.getNewsApi()))
    const dataFromOpenAiSelectionArticle: any = await this.perplexityService.fetchData(this.getPromptService.getPromptSelectArticle(dataMappedFromTheNewsApi))
    const resultMappedArticles = JSON.parse(extractJSONBlock(dataFromOpenAiSelectionArticle.choices[0].message.content))
    resultMappedArticles.valide ? await this.processArticle(resultMappedArticles) : this.getIdeaPost()
  }

  getIdeaPost(){
    this.supabaseService.getFirstIdeaPostByMonth(new Date().getMonth()+1, new Date().getFullYear())
      .then((r: any) => {
        this.precisionArticle = r[0]
        this.processArticle(r[0].description)
      });
  }

  async processArticle(dataToResume: any) {
    this.dataToResume = dataToResume
    this.image_url = dataToResume.image_url ? dataToResume.image_url : "https://picsum.photos/400/300"
    this.dataTitleSubjectArticle  = dataToResume.url ? dataToResume.url : dataToResume
    this.perplexityService.fetchData(this.getPromptService.getPromptResumeArticle(dataToResume.url ? dataToResume.url : dataToResume)).then(async (resumedArticleFetch: any) => {
      const articleFormatedInHtml = await this.perplexityService.fetchData(this.getPromptService.getPromptGenericArticleInHtml(resumedArticleFetch.choices[0].message.content))
      this.formatedDataArticleForPost = this.formatDataForPost(articleFormatedInHtml.choices[0].message.content)
      this.processDataInJson()
    })
  }

  formatDataForPost(dataToFormat: any) {
    const extractedHTMLBlock = extractHTMLBlock(dataToFormat)
    const escapedHtmlForJson = escapeHtmlForJson(extractedHTMLBlock)
    const inLinedString = inLineString(escapedHtmlForJson)
    return inLinedString;
  }

  processDataInJson() {
    let parsedInJson: any = null
    this.perplexityService.fetchData(this.getPromptService.getPromptGenericFillArticlePostData(this.image_url, this.dataTitleSubjectArticle)).then((resultArticleInPostData: any) => {
      try {
        parsedInJson = JSON.parse(extractJSONBlock(resultArticleInPostData.choices[0].message.content));
      } catch (error) {
        console.error('Erreur lors du parsing JSON ou traitement :', error);
        setTimeout(() => { this.processArticle(this.dataToResume); }, 1000);
      }
      parsedInJson.article = this.formatedDataArticleForPost
      // TODO: if article viens de theNewsApi donc if (!this.precisionArticle.id) alors generer extra image pour illustration mais attention si url_post est la
      this.supabaseService.setNewPostForm(mapToPost(parsedInJson)).then(async (lastPost: Post[]) => {
        await this.updateImageUrlResizedAndIdeaPost(lastPost[0].id);
        (!this.precisionArticle.id && !this.url_post.length) ? this.postForm.patchValue(lastPost[0]) : null;
        this.chronometreComponent.stopChronometre();
        this.url_post = ''
        this.isLoading = false;
      })
    })
  }

  async updateImageUrlResizedAndIdeaPost(lastIdPost: number) {
    if (this.precisionArticle.id || this.url_post.length) {
      this.image_url = await this.openaiService.imageGenerartor(this.textPromptImage + this.precisionArticle.description + ' dans ce style ci : ' + this.getStyleForToday(getRandomIntInclusive(1, 31)))
      this.image_url = await compressImage(this.image_url, 500, 300)
      await this.supabaseService.updateImageUrlPostByIdForm(lastIdPost, this.image_url).then(async (lastPost: Post[]) => {
        this.postForm.patchValue(lastPost[0]);
      })
      this.precisionArticle.id ? await this.supabaseService.updateIdeaPostById(this.precisionArticle.id, lastIdPost) : null
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
    const currentDay = (randomNumber!==undefined  && randomNumber>0) ? randomNumber : new Date().getDate();
    return styles[(currentDay - 1) % styles.length]; // Use modulus to wrap around if days exceed styles count
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.isLoading = true;
      this.supabaseService.updatePostByPostForm(this.postForm.value).then((response) => {
        console.log(response)
        this.isLoading = false;
      });
    }
  }

  switchIsCode(event: any) {
    this.isEditorTextON = !this.isEditorTextON;
    event.preventDefault();
  }

  validPostById(postId: number) {
    this.supabaseService.updateValidPostByIdForm(postId).then(r => {
      console.log(r)
    })
  }

}
