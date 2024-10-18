import {Post} from "../shared/types/post";

export function  mapToPost(data: any): Post {
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
