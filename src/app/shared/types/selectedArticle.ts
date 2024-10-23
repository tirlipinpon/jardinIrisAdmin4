export interface SelectedArticle {
  valide: boolean;
  explication: {
    raisonArticle1: string;
    raisonArticle2: string;
  };
  url?: string;
  image_url: string;
  description?: string
}
