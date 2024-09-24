import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TheNewsApiService {
  private apiUrl = "https://api.thenewsapi.com/v1/news/all?api_token=qmNEWAZBSEOlEoWlyh4AJlMZgBAczkn7BSlfaGQh" +
    "&search_fields=title,description,main_text" +
    "&categories=general,tech,travel,entertainment,business,food,politics" +
    "&exclude_categories=sports" +
    "&published_on=2024-09-13" +
    "&search=belgique+ (jardin | potager | écologie | nature | plante)" +
    "&language=fr,nl,en" +
    "&page=1"
  http = inject(HttpClient);
  constructor() {}
  getNewsApi(): Observable<any> {
    return this.http.get<any>(this.apiUrl)
  }

}
