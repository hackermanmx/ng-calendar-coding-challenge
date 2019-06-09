import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
} from '@angular/core/testing';
import {NoopAnimationsModule, BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DialogComponent } from './dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatSelectModule,
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatRippleModule,
  MatDialogModule,
  MatDialog
} from '@angular/material';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';

xdescribe('DialogComponent', () => {
  let dialog: MatDialog;
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatSelectModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatRippleModule,
        MatDialogModule,
        NoopAnimationsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      declarations: [ DialogComponent ],
      providers: [
      ],
      // providers: [
      //   {
      //     provide: MatDialogRef,
      //     useValue: {
      //       close: (dialogResult: any) => { }
      //     }
      //   },
      //   {
      //     provide: MAT_DIALOG_DATA,
      //     useValue: {} // Add to test if it is used
      //   }
      // ]
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [DialogComponent] } })
    .compileComponents();
    // dialog = TestBed.get(MatDialog);
  }));

  afterEach(() => {
    dialog.ngOnDestroy();
  });

  beforeEach(inject([MatDialog], (d: MatDialog) => {
    dialog = d;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('passing in data', () => {
    it('should be able to pass in data', () => {
      const config = {
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

      const instance = dialog.open(DialogComponent, config).componentInstance;

      expect(instance.data.reminder).toBe(config.data.form.reminder);
      expect(instance.data.date).toBe(config.data.form.date);
      expect(instance.data.city).toBe(config.data.form.city);
      expect(instance.data.color).toBe(config.data.form.color);
    });

    it('should default to null if no data is passed', () => {
      expect(() => {
        const dialogRef = dialog.open(DialogComponent);
        expect(dialogRef.componentInstance.data).toBeNull();
      }).not.toThrow();
    });
  });
});
