import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ICurrentWeather } from '../interfaces';
import { map } from 'rxjs/operators';

interface ICurrentWeatherData {
  weather: [{
    description: string;
    icon: string;
  }];
  main: {
    temp: number;
  };
  sys: {
    country: string;
  };
  dt: number;
  name: string;
}

export interface IWeatherService {
  getCurrentWeather(city: string, country: string): Observable<ICurrentWeather>;
}

@Injectable({
  providedIn: 'root'
})

export class WeatherService implements IWeatherService {

  constructor(private httpClient: HttpClient) { }

  getCurrentWeather(city: string, country: string): Observable<ICurrentWeather> {
    return this.httpClient
      .get<ICurrentWeatherData>(`${environment.baseUrl}api.openweathermap.org/data/2.5/weather?`
        + `q=${city},${country}&appid=${environment.appId}`).pipe(map(data => this.transformToICurrentWeather(data)));
  }

  private convertKelvinToCelsius(kelvin: number): number {
    return kelvin - 273.15;
  }

  private transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `assets/img/weather-icons/${data.weather[0].icon}.svg`,
      temperature: this.convertKelvinToCelsius(data.main.temp),
      description: data.weather[0].description
    };
  }
}
