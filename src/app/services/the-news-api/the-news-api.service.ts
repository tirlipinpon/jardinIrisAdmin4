import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CathegorieJardinage} from "../../shared/types/cathegorie"
import {environment} from "../../../../environment";
import {formatCurrentDateUs} from "../../utils/getFormattedDate";


@Injectable({
  providedIn: 'root'
})
export class TheNewsApiService {
  private apiUrl = `https://api.thenewsapi.com/v1/news/all?api_token=${environment.newsApiToken}
    &search_fields=title,description,main_text
    &categories=general,tech,travel,entertainment,business,food,politics
    &exclude_categories=sports
    &published_on=2024-10-15
    &search=belgique+(${CathegorieJardinage.ARBRE} | ${CathegorieJardinage.ECOLOGIE} |
    ${CathegorieJardinage.FLEUR} | ${CathegorieJardinage.JARDIN} |
    ${CathegorieJardinage.PLANTE} | ${CathegorieJardinage.NATURE} |
    ${CathegorieJardinage.POTAGER})
    &language=fr,nl,en
    &page=1`;

  http = inject(HttpClient);
  constructor() {}
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

}
