import {Comment} from "./comment";

export interface Post {
  id: number; // int8
  created_at: string; // timestamptz
  titre: string; // text
  description_meteo: string; // text
  phrase_accroche: string; // text
  article: string; // text
  comments?: Comment[]; // Liste de commentaires associés
  citation: string; // text
  lien_url_article: string; // text
  image_url: string; // text
  categorie: string; // text
  visite: number; // float4
  valid: boolean; // bool
  deleted: boolean; // bool
  video: string; // text
}
