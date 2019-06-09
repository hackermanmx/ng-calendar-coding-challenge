import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatChipsModule,
  MatIconModule,
  MatNativeDateModule,
  MatSelectModule,
  MatDividerModule,
  MatDatepickerModule,
  MatListModule,
  MatInputModule,
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatRippleModule,
  MatSnackBarModule,
  MatDialogModule, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material';

import {DialogComponent} from './dialog/dialog.component';
import {CoreService} from '../services/core.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatRippleModule,
    MatListModule,
    MatSelectModule,
    MatInputModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    AngularFontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DialogComponent,
    ConfirmDialogComponent
  ],
  entryComponents: [
    DialogComponent,
    ConfirmDialogComponent
  ],
  exports: [
    DialogComponent,
    ConfirmDialogComponent,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatRippleModule,
    MatListModule,
    MatSelectModule,
    MatInputModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    AngularFontAwesomeModule
  ],
  providers: [
    CoreService,
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

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: SharedModule,
      providers: []
    };
  }
}
