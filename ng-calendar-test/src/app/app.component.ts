import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogComponent} from './common/dialog/dialog.component';
import {format, getMonth} from 'date-fns';
import {get, set, Store} from 'idb-keyval';
import {ConfirmDialogComponent} from './common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
  store = new Store('reminders-db', 'reminders-store');

  static sortEvents(a, b) {
    a = new Date(a.form.date).getTime();
    b = new Date(b.form.date).getTime();
    return a - b;
  }

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
        prevMonthDay = prevMonthDay + 1;
        /* Next month dates (if month does not end on Saturday) */
      } else if (i > currentMonthTotalDays + (startDay - 1)) {
        date = new Date(year, month + 1, nextMonthDay);
        nextMonthDay = nextMonthDay + 1;
        /* Current month dates. */
      } else {
        date = new Date(year, month, (i - startDay) + 1);
      }

      dates.push({ date: date, events: []});
    }

    return dates;
  }

  static getActiveReminders(calendar) {
    return calendar.filter(i => i.events.length);
  }

  constructor(public dialog: MatDialog,
              public cdr: ChangeDetectorRef,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
    const currentDate = new Date();
    this.selectedMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    this.currentMonthYear = format(new Date(), 'MMMM YYYY');
    this.checkMonthButtons();
    this.resetDaysArray();
    get('reminders', this.store).then((store: any) => {
      if (store && store.length) {
        store.forEach(item => {
          const findDateIndex = this.calendar
            .findIndex(i => {
              return i.date.getDate() === item.date.getDate();
            });
          this.calendar[findDateIndex].events = item.events;
        });
      }
    });

  }

  checkMonthButtons() {
    this.shouldDisablePrev = getMonth(this.selectedMonth) === 0;
    this.shouldDisableNext = getMonth(this.selectedMonth) === 11;
  }

  resetDaysArray(): void {
    this.calendar = AppComponent.getMonthInfo(this.selectedMonth.getFullYear(), this.selectedMonth.getMonth() + 1);
  }

  openDialog(event?, index?: number) {
    const config = {
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
      this.model.isEdit = true;
      this.lastEvent = {
        date: event.date,
        index,
        event: event.events[index] };
    } else { // add
      this.model = {
        id: genID(),
        reminder: null,
        date: new Date().toISOString(),
        city: null,
        color: 'blue',
        isEdit: false
      };
    }

    config.data.form = this.model;
    const dialogRef = this.dialog.open(DialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.form) {
        const eventDate = new Date(result.form.date);
        let findDateIndex, msg;
        if (result.form.isEdit) {
          // check if date changed when edited
          findDateIndex = this.calendar.findIndex(i =>
            i.events.findIndex(o => o.form.id === this.lastEvent.event.form.id) > -1);
          if (new Date(this.lastEvent.date).getDate() !== eventDate.getDate()) {
            const findNewDateIndex = this.findDateOfEvent(eventDate);
            this.calendar[findNewDateIndex].events.push(result);
            this.calendar[findDateIndex].events.splice(this.lastEvent.index, 1);
          }
          msg = `Reminder updated`;
          this.showNotification(msg, 'Saved');

        } else {
          findDateIndex = this.findDateOfEvent(eventDate);
          if (findDateIndex > -1) {
            this.calendar[findDateIndex].events.push(result);
                msg = `A Reminder saved`;
            this.showNotification(msg, 'Added');
          }
        }

        this.calendar[findDateIndex].events.sort(AppComponent.sortEvents);
        this.save();

        this.model = {
          id: null,
          reminder: null,
          date: null,
          city: null,
          color: 'blue',
          isEdit: false
        };

        this.cdr.detectChanges();
      }
    });
  }

  findDateOfEvent(eventDate: Date) {
    return this.calendar.findIndex(i => i.date.getDate() === eventDate.getDate());
  }

  removeEvent(cIndex: number, evtIndex: number) {
    this.showNotification(`"${this.calendar[cIndex].events[evtIndex].form.reminder}" deleted!`, 'Done');
    this.calendar[cIndex].events.splice(evtIndex, 1).sort(AppComponent.sortEvents);
    this.save();
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
        this.save();
      }
    });
  }

  save() {
    set('reminders', AppComponent.getActiveReminders(this.calendar), this.store).then();
  }

  showNotification(message: string, action: string) {
    this.snackBar.open(message, action, {
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
