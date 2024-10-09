import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TheNewsApiService {
  formatCurrentDate() : any {
    // Crée une nouvelle instance de la date actuelle
    const date = new Date();
// Récupère l'année, le mois et le jour
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0 donc on ajoute 1
    const day = String(date.getDate()).padStart(2, '0');
// Formate la date au format YYYY-MM-DD
    return `${year}-${month}-${day}`;
  }
  private apiUrl = "https://api.thenewsapi.com/v1/news/all?api_token=qmNEWAZBSEOlEoWlyh4AJlMZgBAczkn7BSlfaGQh" +
    "&search_fields=title,description,main_text" +
    "&categories=general,tech,travel,entertainment,business,food,politics" +
    "&exclude_categories=sports" +
    "&published_on=" + this.formatCurrentDate() +
    "&search=belgique+ (jardin | potager | écologie | nature | plante | arbre | fleur)" +
    "&language=fr,nl,en" +
    "&page=1"
  http = inject(HttpClient);
  constructor() {}
  getNewsApi(): Observable<any> {
    return this.http.get<any>(this.apiUrl)
  }

}
