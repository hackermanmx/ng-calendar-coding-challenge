import { Component, OnInit } from '@angular/core';
import {
format, subMonths, addMonths, getMonth,
addDays, endOfMonth, startOfYear, endOfYear,
getYear, getDay, setMonth, getDaysInMonth,
startOfDay, subHours, addHours, subDays
} from 'date-fns';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // faChevronLeft = 'chevron-left';
  // faChevronRight = 'chevron-right';
  selectedMonth: Date;
  currentMonthYear: String;
  shouldDisablePrev: Boolean;
  shouldDisableNext: Boolean;
  days: any[];

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

      // dates.push(format(date, 'dddd MMMM DD'));
      dates.push(date);
    }

    return dates;
  }

  constructor() { }

  ngOnInit() {
    const currentDate = new Date();
    this.selectedMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    this.currentMonthYear = format(new Date(), 'MMMM YYYY');
    this.checkMonthButtons();
    this.resetDaysArray();

    // console.log(this.getMonthInfo(2019, 6));
  }

  checkMonthButtons() {
    this.shouldDisablePrev = getMonth(this.selectedMonth) === 0;
    this.shouldDisableNext = getMonth(this.selectedMonth) === 11;
  }

  // goToPrevious() {
  //   if (getMonth(this.selectedMonth) != 0) {
  //     this.selectedMonth = subMonths(this.selectedMonth, 1);
  //     this.currentMonthYear = format(this.selectedMonth, 'MMMM YYYY');
  //     this.resetDaysArray();
  //     this.checkMonthButtons();
  //   }
  // }
  //
  // goToNext() {
  //   if (getMonth(this.selectedMonth) != 11) {
  //     this.selectedMonth = addMonths(this.selectedMonth, 1);
  //     this.currentMonthYear = format(this.selectedMonth, 'MMMM YYYY');
  //     this.resetDaysArray();
  //     this.checkMonthButtons();
  //   }
  // }

  resetDaysArray(): void {
    this.days = AppComponent.getMonthInfo(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1);
  }
}
