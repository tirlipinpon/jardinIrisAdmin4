import { Component } from '@angular/core';
import * as natural from 'natural';

@Component({
  selector: 'app-test-link',
  standalone: true,
  imports: [],
  templateUrl: './test-link.component.html',
  styleUrl: './test-link.component.css'
})
export class TestLinkComponent {
  // Importez les bibliothèques nécessaires
  text = "L'entretien des plantes est essentiel pour un aménagement paysager réussi, que ce soit en intérieur ou en extérieur.";

// Exemple de liste JSON des titres
  titles = [
    { id: 1, titre: "Entretien des plantes" },
    { id: 2, titre: "Aménagement paysager" },
    { id: 3, titre: "Plantes d'intérieur" },
    // Ajoutez d'autres titres si nécessaire
  ];


  updatedText: string = '';

  constructor() {
    // Exemple d'utilisation
    this.updatedText = this.addLinksToText(this.text, this.titles);
  }



// Fonction pour nettoyer et tokeniser le texte
  preprocessText(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/);
  }

// Fonction pour calculer la similarité cosinus entre deux vecteurs
  cosineSimilarity(vecA: any[], vecB: any[]): number {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

// Fonction principale pour ajouter des liens au texte
  addLinksToText(text: string, titles: { id: number; titre: string }[]): string {
    const tokenizer = new natural.WordTokenizer();
    const words = this.preprocessText(text);
    const uniqueLinks = new Set<string>();
    let linkCount = 0;

    for (const { id, titre } of titles) {
      if (linkCount >= 3) break;

      const titleWords = this.preprocessText(titre);
      for (const word of words) {
        if (uniqueLinks.has(word)) continue;

        const wordVec = tokenizer.tokenize(word);
        const titleVec = tokenizer.tokenize(titre);

        const similarity = this.cosineSimilarity(wordVec, titleVec);
        if (similarity > 0.8) {
          const link = `<a class="myTooltip" href="https://jardin-iris.be/blog-detail.html?post=${id}" id="${id}" title="${titre}">${word} <span class="myTooltiptext">${titre}</span></a>`;
          text = text.replace(new RegExp(`\\b${word}\\b`, 'gi'), link);
          uniqueLinks.add(word);
          linkCount++;
          break;
        }
      }
    }

    return text;
  }





}
