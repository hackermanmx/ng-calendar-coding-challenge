import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogComponent} from './common/dialog/dialog.component';
import {format, getMonth} from 'date-fns';
import {CoreService} from './services/core.service';
import {ConfirmDialogComponent} from './common/confirm-dialog/confirm-dialog.component';

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
  calendar: any[];
  model = {
    id: null,
    reminder: null,
    date: null,
    city: null,
    color: 'blue',
    isEdit: false
  };
  lastEvent = null;
  snackbarFormat = 'MMMM DD';

  static sortEvents(a, b) {
    a = new Date(a.form.date).getTime();
    b = new Date(b.form.date).getTime();
    return a - b;
  }

  constructor(public dialog: MatDialog,
              public _snackBar: MatSnackBar) { }

  ngOnInit() {
    const currentDate = new Date();
    this.selectedMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    this.currentMonthYear = format(new Date(), 'MMMM YYYY');
    this.checkMonthButtons();
    this.resetDaysArray();
  }

  checkMonthButtons() {
    this.shouldDisablePrev = getMonth(this.selectedMonth) === 0;
    this.shouldDisableNext = getMonth(this.selectedMonth) === 11;
  }

  resetDaysArray(): void {
    this.calendar = CoreService.getMonthInfo(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1);
  }

  openDialog(event?, index?: number) {
    let config = {
      width: '400px',
      data: {
        form: {
          color: 'blue'
        }
      }
    };
    const genID = () => Date.now().toString(36);

    if (event) { // edit
      this.model = event.events[index].form;
      // this.model.date = startOfDay(event.date).toISOString();
      this.model.isEdit = true;
      this.lastEvent = {
        date: event.date,
        index,
        event: event.events[index] };
    } else { // add
      this.model.date = new Date().toISOString();
      this.model.id = genID();
      this.model.isEdit = false;
    }

    config.data.form = this.model;
    const dialogRef = this.dialog.open(DialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.form) {
        const eventDate = new Date(result.form.date);
        let findDateIndex, evts, lastEvt, msg;
        if (result.form.isEdit) {
          // check if date changed when edited
          findDateIndex = this.calendar.findIndex(i => i.events.findIndex(o => o.id === this.lastEvent.event.id) > -1);
          if (new Date(this.lastEvent.date).getDate() !== eventDate.getDate()) {
            const findNewDateIndex = this.findDateOfEvent(eventDate);
            this.calendar[findDateIndex].events.splice(this.lastEvent.index, 1);
            this.calendar[findNewDateIndex].events.push(result);
          }
          evts = this.calendar[findDateIndex].events;
          lastEvt = evts[evts.length - 1];
          msg = `Reminder "${lastEvt.form.reminder}" in ${format(lastEvt.form.date, this.snackbarFormat)} is updated`;
          this.showNotification(msg, 'Saved');

        } else {
          findDateIndex = this.findDateOfEvent(eventDate);
          if (findDateIndex > -1) {
            this.calendar[findDateIndex].events.push(result);
            evts = this.calendar[findDateIndex].events;
            lastEvt = evts[evts.length - 1];
            msg = `A Reminder "${lastEvt.form.reminder}" is set for ${format(lastEvt.form.date, this.snackbarFormat)}`;
            this.showNotification(msg, 'Added');
          }
        }

        this.calendar[findDateIndex].events.sort(AppComponent.sortEvents);

        this.model = {
          id: null,
          reminder: null,
          date: null,
          city: null,
          color: 'blue',
          isEdit: false
        };
      }
    });
  }

  findDateOfEvent(eventDate: Date) {
    return this.calendar.findIndex(i => i.date.getDate() === eventDate.getDate());
  }

  removeEvent(cIndex: number, evtIndex: number) {
    this.calendar[cIndex].events.splice(evtIndex, 1).sort(AppComponent.sortEvents);
  }

  openConfirmDialog(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { index }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.calendar[result.index].events.length = 0;
        const msg = `Reminders removed for ${format(this.calendar[result.index].date, this.snackbarFormat)}`;
        this.showNotification(msg, 'Deleted');
      }
    });
  }

  showNotification(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
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

}
