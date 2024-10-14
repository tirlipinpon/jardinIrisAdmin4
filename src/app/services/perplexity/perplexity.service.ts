import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PerplexityService {

  constructor() { }

  fetchData(questionRules: any, systemRules: any): Promise<any> {
    const jsonObject = {
      model: "llama-3.1-sonar-small-128k-online",
      messages: [
        {
          role: "system",
          content: systemRules
        },
        {
          role: "user",
          content: questionRules
        }
      ],
      max_tokens: "Optional",
      temperature: 0.8,
      top_p: 0.9,
      return_citations: true,
      search_domain_filter: ["perplexity.ai"],
      return_images: true,
      return_related_questions: true,
      search_recency_filter: "month",
      top_k: 0,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1
    };

    const jsonString = JSON.stringify(jsonObject, null, 2);
    //console.log(jsonString);

    const options = {
      method: 'POST',
      headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
      body: jsonString
    };

    return this.MockgetMessageContent()
    // fetch('https://api.perplexity.ai/chat/completions', options)
    //   .then(response => response.json())
    //   .then(response => console.log(response))
    //   .catch(err => console.error(err));
  }
  MockgetMessageContent(): Promise<any> {
    return new Promise((resolve, reject) => {
      const response = {
        "id": "3c90c3cc-0d44-4b50-8888-8dd25736052a",
        "model": "llama-3.1-sonar-small-128k-online",
        "object": "chat.completion",
        "created": 1724369245,
        "choices": [
          {
            "index": 0,
            "finish_reason": "stop",
            "message": {
              "role": "assistant",
              "content": {
                "titre": "Le Concours du Meilleur Jeune Jardinier 2024 : Un Élan de Passion et de Compétence",
                "description_meteo": "Prévisions à Bruxelles pour le 14 octobre 2024 : temps nuageux avec quelques éclaircies, températures autour de 12°C.",
                "phrase_accroche": "Découvrez comment la nouvelle génération de jardiniers transforme nos espaces verts !",
                "article": "<h4>🌱 Un concours plein de promesses</h4> <ul> <li>Pourquoi ce concours est-il si important pour les jeunes jardiniers ?</li> </ul> <p>Le Concours du Meilleur Jeune Jardinier 2024 a débuté avec enthousiasme, rassemblant des talents prometteurs de toute la Belgique. Ce concours est non seulement une vitrine pour les compétences des jeunes, mais aussi une source d'inspiration pour tous ceux qui aiment la nature. <strong>Les participants doivent allier créativité et technique pour impressionner le jury.</strong></p> <h4>🌼 Les défis techniques à relever</h4> <ul> <li>Quels types de compétences sont évalués lors du concours ?</li> </ul> <p>Les équipes doivent réaliser un aménagement de parc en respectant un cahier des charges précis. Cela inclut des compétences variées comme la maçonnerie, la menuiserie et le choix judicieux des plantes. Chaque détail compte, car <strong>la finition et le respect des mesures sont cruciaux pour réussir.</strong></p> <h4>🌧️ Météo capricieuse, mais détermination intacte</h4> <ul> <li>Comment les conditions météorologiques influencent-elles le travail des jardiniers ?</li> </ul> <p>Cet événement se déroule sous un ciel changeant, alternant entre soleil et pluie. Les jeunes jardiniers doivent s'adapter rapidement aux conditions climatiques. Malgré ces défis, leur passion pour le jardinage reste inébranlable. <strong>C'est un vrai test de résilience et d'ingéniosité !</strong></p> <h4>🏆 Vers les Olympiades des Métiers</h4> <ul> <li>Quel est l'objectif final du concours ?</li> </ul> <p>A l'issue de cette compétition, les trois meilleures équipes auront l'opportunité de représenter la Belgique aux Olympiades des Métiers. C'est une chance unique d'exposer leur savoir-faire à l'international. <strong>Cet événement est une véritable rampe de lancement pour ces jeunes talents !</strong></p><br id=\"link_to_service\">",
                "citation": "\"La nature ne se presse pas, mais tout est accompli.\" - Lao Tseu",
                "lien_url_article": [
                  { "lien1": "https://www.qu4tre.be/info/enseignement/concours-du-meilleur-jeune-jardinier-2024/1518809",
                    "lien2": "https://www.abajp.be/fr/accueil/",
                    "lien3": "https://www.rtbf.be/article/presentation-du-livre-carnet-de-travail-d-un-jardinier-paysagiste-8206577"
                  }
                ],
                "categorie": "jardin"
              },
            },
            "delta": {
              "role": "assistant",
              "content": ""
            }
          }
        ],
        "usage": {
          "prompt_tokens": 14,
          "completion_tokens": 70,
          "total_tokens": 84
        }
      };

      // Simulate asynchronous behavior (like an HTTP request)
      setTimeout(() => {
        resolve(response);
      }, 1000);
    });
  }

}
