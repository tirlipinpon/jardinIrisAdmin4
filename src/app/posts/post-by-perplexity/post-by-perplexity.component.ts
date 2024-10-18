import { Component } from '@angular/core';
import {PerplexityService} from "../../services/perplexity/perplexity.service";
import {JsonPipe} from "@angular/common";
import {SupabaseService} from "../../services/supabase/supabase.service";
import {provideNativeDateAdapter} from "@angular/material/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {GetPromptService} from "../../services/construct-prompt/get-prompt.service";
import {extractJSONBlock} from "../../utils/cleanJsonObject";
import {mapToPost} from "../../utils/mapJsonToPost";

@Component({
  selector: 'app-post-by-perplexity',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    JsonPipe,
    MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './post-by-perplexity.component.html',
  styleUrl: './post-by-perplexity.component.css'
})
export class PostByPerplexityComponent {
  precisionArticle: any = ""
  private readonly _currentYear = new Date().getFullYear();
  readonly maxDate = new Date(this._currentYear, new Date().getMonth(), new Date().getDate());
  readonly morePromptInfo = new FormGroup({
    datePickerStart: new FormControl<Date | null>(null),
    datePickerEnd: new FormControl<Date | null>(null),
  });
  dateSelected: string = new Date().toLocaleDateString();

  returnPickerDate(): any {
    return ' entre le ' + this.morePromptInfo.get('start')?.value + ' et le' + this.morePromptInfo.get('end')?.value
  }

  constructor(private perplexityService: PerplexityService,
              private supabaseService: SupabaseService,
              private getPromptService: GetPromptService) {}



  callPerplexityService() {
    this.supabaseService.getFirstIdeaPostByMonth(new Date().getMonth()+1, new Date().getFullYear()).then((r: any) => {
      r[0].description.length?this.precisionArticle = r[0]: this.precisionArticle = null;
      this.perplexityService.fetchData(this.getPromptService.getPerplexityPromptFindArticle(this.precisionArticle, this.morePromptInfo, this.returnPickerDate(),this.dateSelected)).then((resultFetch: any) => {
        this.supabaseService.setNewPostForm(mapToPost(JSON.parse(extractJSONBlock(resultFetch.choices[0].message.content)))).then((r: any) => {
          this.supabaseService.updateDeletedIdeaPostById(this.precisionArticle.id, r[0].id)
        })
      }).catch(err => console.error('Error fetching data:', err));
    });
  }

}
