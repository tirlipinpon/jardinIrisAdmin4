import {Injectable} from '@angular/core';
import {fetchWeatherApi} from "openmeteo";
import {OpenaiService} from "../openai/openai.service";

@Injectable({
  providedIn: 'root'
})
export class WeaterMeteoService {

  constructor(private openaiService: OpenaiService) {
  }

  async callWeatherMeteoAndOpenAi(url_post: string): Promise<any> {
    try {
      // Attendre que weatherFunction se termine
      const weatherData = await this.weatherFunction().then(response => {
          return response;
        }
      );
      // Attendre que main se termine après weatherFunction
      return await this.openaiService.callMainOpenAi(weatherData, url_post);
    } catch (error) {
      // Gérer les erreurs potentielles des fonctions asynchrones
      console.error('Une erreur est survenue:', error);
    }
  }

  async weatherFunction(): Promise<any> {
    const params = {
      "latitude": 50.8505,
      "longitude": 4.3488,
      "hourly": ["temperature_2m", "rain"],
      "forecast_days": 1
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
      Array.from({length: (stop - start) / step}, (_, i) => start + i * step);
    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    // Attributes for timezone and location
    let utcOffsetSeconds = response.utcOffsetSeconds();
    let hourly = response.hourly()!;
    // Note: The order of weather variables in the URL query and the indices below need to match!
    let weatherData = {

      hourly: {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
          (t) => new Date((t + utcOffsetSeconds) * 1000)
        ),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        rain: hourly.variables(1)!.valuesArray()!,
      },

    };
    return weatherData;
  }
}
