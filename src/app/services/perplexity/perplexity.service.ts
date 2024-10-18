import { Injectable } from '@angular/core';
import {environment} from "../../../../environment";

@Injectable({
  providedIn: 'root'
})
export class PerplexityService {

  fetchData(prompt: any): Promise<any> {
    const jsonObject = {
      model: "llama-3.1-sonar-large-128k-online",
      messages: [
        prompt.systemRole,
        prompt.userRole
      ],
      max_tokens: 3000,
      temperature: 0.2,
      top_p: 0.9,
      return_citations: true,
      search_domain_filter: ["perplexity.ai"],
      return_images: false,
      return_related_questions: true,
      search_recency_filter: "month",
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1
    };
    const jsonString = JSON.stringify(jsonObject, null, 2);
    const options = {
      method: 'POST',
      headers: {Authorization: 'Bearer '+environment.perplexcityApi , 'Content-Type': 'application/json'},
      body: jsonString
    };

    // return this.MockgetMessageContent()
    return fetch('https://api.perplexity.ai/chat/completions', options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(err => console.error(err));
  }
}
