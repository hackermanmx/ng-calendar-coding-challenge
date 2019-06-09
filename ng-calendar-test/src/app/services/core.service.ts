import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  owAPI = 'https://api.openweathermap.org/data/2.5/weather?q=';
  owKey = '3c8af46373b4954e33814accf4c79ac0';

  static getMonthInfo(year, oneBasedMonth) {
    const month = oneBasedMonth - 1; /* month given to Date() starts at 0 = January */
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); /* 0 `day` gets last day from prior month */

    /* result of getDay(): 0 means Sunday and 6 means Saturday */
    const startDay = startDate.getDay();
    /* last day number = total days in current month */
    const currentMonthTotalDays = endDate.getDate();
    const totalWeeks = Math.ceil((currentMonthTotalDays + startDay) / 7);

    const prevMonthEndDate = new Date(year, month, 0);
    let prevMonthDay = prevMonthEndDate.getDate() - startDay + 1;
    let nextMonthDay = 1;
    const dates = [];

    for (let i = 0; i < (totalWeeks * 7); i += 1) {
      let date;
      /* Previous month dates (if month does not start on Sunday) */
      if (i < startDay) {
        date = new Date(year, month - 1, prevMonthDay);
        prevMonthDay = prevMonthDay + 1
        /* Next month dates (if month does not end on Saturday) */
      } else if (i > currentMonthTotalDays + (startDay - 1)) {
        date = new Date(year, month + 1, nextMonthDay);
        nextMonthDay = nextMonthDay + 1
        /* Current month dates. */
      } else {
        date = new Date(year, month, (i - startDay) + 1)
      }

      dates.push({ date: date, events: []});
    }

    return dates;
  }

  constructor(public http: HttpClient) { }

  public getWeather(q: string) {
    return this.http.get(`${this.owAPI}${q}&APPID=${this.owKey}`);
  }
}
