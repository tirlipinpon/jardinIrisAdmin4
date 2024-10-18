import {Component} from '@angular/core';
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

@Component({
  selector: 'app-post-general',
  standalone: true,
  imports: [],
  templateUrl: './post-general.component.html',
  styleUrl: './post-general.component.css'
})
export class PostGeneralComponent {
  cpt = 0
  image_url: string = '';

  constructor(private theNewsApiService: TheNewsApiService,
              private perplexityService: PerplexityService,
              private openaiService: OpenaiService,
              private getPromptService: GetPromptService,
              private supabaseService: SupabaseService) {
  }

  process() {
    this.executeProcess()
  }

  consoleLog(message: string, obj: any) {
    console.log(this.cpt++ + " " + message + " = " + JSON.stringify(obj, null, 2))
  }

  async executeProcess() {
    const dataFromTheNewsApi = await lastValueFrom(this.theNewsApiService.getNewsApi())
    const dataMappedFromTheNewsApi = this.theNewsApiService.mapperNewsApi(dataFromTheNewsApi)
    // TODO: remplacer openai par perplexity pour la selection de l'article
    const dataFromOpenAiSelectionArticle = await this.openaiService.fetchData(this.getPromptService.getPromptSelectArticle(dataMappedFromTheNewsApi))
    this.checkIfArticleFound(dataFromOpenAiSelectionArticle);
  }

  resumeArticle(dataToResume: any) {
    this.image_url = dataToResume.image_url
    this.perplexityService.fetchData(this.getPromptService.getPromptResumeArticle('https://www.pleinevie.fr/vie-quotidienne/jardin/jardin-cet-endroit-est-ideal-pour-installer-un-nichoir-pour-les-oiseaux-et-les-proteger-tout-lhiver-135399.html')).then(async (resultFetch: any) => {
      console.log(resultFetch.choices[0].message.content)
      // TODO: demander a open ai de structurer l'article en html
      const articleFormatedInHtml = await this.perplexityService.fetchData(this.getPromptService.getPromptSystemUserArticleInHtmlGeneric(resultFetch.choices[0].message.content))
      this.openaiService.fetchData(this.getPromptService.getPromptFillArticlePostData(escapeHtmlForJson(extractHTMLBlock(articleFormatedInHtml.choices[0].message.content)), this.image_url)).then((resultFetch2: any) => {

        const test1 = extractJSONBlock(resultFetch2)
        this.consoleLog('extractJSONBlock', test1)

        const test2 = JSON.parse(test1)
        this.consoleLog("json parse ", test2)

        const test3 = mapToPost(test2)
        this.consoleLog("mapToPost", test3)

        this.supabaseService.setNewPostForm(test3).then((lastPost: Post) => {
          this.consoleLog("last Post", lastPost)
        })
      })
    })
  }

  checkIfArticleFound(selectedArticle: any): void {
    if (selectedArticle?.length) {
      const dataString: any = JSON.parse(selectedArticle)
      if (dataString.valide) {
        this.resumeArticle(dataString)
      }
    } else {}
  }
}
