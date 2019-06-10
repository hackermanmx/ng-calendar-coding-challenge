import {ChangeDetectorRef, Component, Inject, OnInit, Optional} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CoreService} from '../../services/core.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {endOfMonth, format, startOfMonth} from "date-fns";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  standAlone = { standAlone: true };
  isQuerying = false;
  forecast = null;
  dataWrapper = null;
  minDate = null;
  maxDate = null;
  canProceed = true;
  colors = ['blue', 'red', 'green', 'purple', 'gray', 'brown', 'orange'];

  constructor(@Optional() public dialogRef: MatDialogRef<DialogComponent>,
              public coreService: CoreService,
              public cdr: ChangeDetectorRef,
              public snackBar: MatSnackBar,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataWrapper = JSON.parse(JSON.stringify(this.data));
    this.minDate = format(startOfMonth(new Date()), 'MM/dd/yyyy');
    this.maxDate = format(endOfMonth(new Date()), 'MM/dd/yyyy');

    console.log(this.minDate, this.maxDate);
  }

  ngOnInit() {
    if (this.data.form.city) {
      this.getWeather();
    }
  }

  getWeather() {
    if (this.data.form.city) {
      this.isQuerying = true;
      const setSpinnerOff = () => {
        this.isQuerying = false;
      };
      this.coreService.getWeather(this.data.form.city)
        .subscribe((res: any) => {
          this.forecast = {
            min: (res.main.temp_min - 273.15).toFixed(0) + ' C°',
            max: (res.main.temp_max - 273.15).toFixed(0) + ' C°',
            icon: res.weather[0].icon
          };
        }, () => {
          this.forecast = null;
          setSpinnerOff();
        }, () => {
          setSpinnerOff();
        });
    } else {
      this.forecast = null;
    }
  }

  onCancel(form) {
    form.reset();
    // this.data = this.dataWrapper;
    this.dialogRef.close();
  }

  onDateChange(evt: any) {
    this.canProceed = new Date(evt).getMonth() === new Date().getMonth();
    if (this.canProceed) {
      this.data.form.date = evt;
    } else {
      this.snackBar.open('Free version only supports single month only!', 'See Pricing', {
        duration: 3000,
      });
    }
  }
}
