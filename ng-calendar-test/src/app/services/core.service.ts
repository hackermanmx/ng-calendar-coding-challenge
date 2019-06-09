import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  owAPI = 'https://api.openweathermap.org/data/2.5/weather?q=';
  owKey = '3c8af46373b4954e33814accf4c79ac0';

  constructor(public http: HttpClient) { }

  public getWeather(q: string) {
    return this.http.get(`${this.owAPI}${q}&APPID=${this.owKey}`);
  }
}
