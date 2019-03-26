import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
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
  getCurrentWeather(search: string | number, country?: string): Observable<ICurrentWeather>;
}

@Injectable({
  providedIn: 'root'
})

export class WeatherService implements IWeatherService {

  currentWeather = new BehaviorSubject<ICurrentWeather>({
    city: '--',
    country: '--',
    date: Date.now(),
    image: '',
    temperature: 0,
    description: '',
  });

  constructor(private httpClient: HttpClient) { }

  getCurrentWeather(search: string | number, country?: string): Observable<ICurrentWeather> {
    let uriParams = '';
    if (typeof search === 'string') {
      uriParams = `q=${search}`;
    } else {
      uriParams = `zip=${search}`;
    }

    if (country) {
      uriParams = `${uriParams},${country}`;
    }

    return this.getCurrentWeatherHelper(uriParams).pipe();
  }

  getCurrentWeatherByCoords(coords: Coordinates): Observable<ICurrentWeather> {
    const uriParams = `lat=${coords.latitude}&lon=${coords.longitude}`;
    return this.getCurrentWeatherHelper(uriParams);
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

  private getCurrentWeatherHelper(uriParams: string): Observable<ICurrentWeather> {
    return this.httpClient
      .get<ICurrentWeatherData>(`${environment.baseUrl}api.openweathermap.org/data/2.5/weather?`
      + `${uriParams}&appid=${environment.appId}`).pipe(map(data => this.transformToICurrentWeather(data)));
  }
}
