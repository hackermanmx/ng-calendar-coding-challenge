import {TestBed, async, inject} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {
  MatDialogRef,
  MAT_DIALOG_DATA, MatDialog
} from '@angular/material';
import {DialogComponent} from "./common/dialog/dialog.component";
import {SharedModule} from "./common";
import {BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('AppComponent', () => {
  let dialog: MatDialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        BrowserAnimationsModule,
        SharedModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => { }
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {} // Add to test if it is used
        }
      ]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [DialogComponent] } })
    .compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  beforeEach(inject([MatDialog], (d: MatDialog) => {
    dialog = d;
  }));

  describe('passing in data', () => {
    it('should be able to pass in data', () => {
      let config = {
        data: {
          form: {
            id: null,
            reminder: 'hello',
            date: new Date(),
            city: 'Hermosillo',
            color: 'blue',
            isEdit: false
          }
        }
      };

      const currentDate = new Date();
      let calendar = AppComponent.getMonthInfo(currentDate.getFullYear(), currentDate.getMonth() + 1);
      let instance = dialog.open(DialogComponent, config).componentInstance;
      expect(instance.data.form.reminder).toBe(config.data.form.reminder);
      expect(instance.data.form.date).toBe(config.data.form.date);
      expect(instance.data.form.city).toBe(config.data.form.city);
      expect(instance.data.form.color).toBe(config.data.form.color);

      // Add test
      calendar[0].events.push(instance.data.form);
      const reminder = calendar[0].events;
      expect(reminder.length).toBe(1);
      expect(reminder[0].reminder).toBe(config.data.form.reminder);
      expect(reminder[0].date).toBe(config.data.form.date);
      expect(reminder[0].city).toBe(config.data.form.city);
      expect(reminder[0].color).toBe(config.data.form.color);

    });

    it('should default to null if no data is passed', () => {
      expect(() => {
        let dialogRef = dialog.open(DialogComponent);
        expect(dialogRef.componentInstance.data).toBeNull();
      }).not.toThrow();
    });
  });

});
