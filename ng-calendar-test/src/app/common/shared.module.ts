import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatSelectModule,
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatRippleModule,
  MatSnackBarModule,
  MatDialogModule,
  MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material';

import {DialogComponent} from './dialog/dialog.component';
import {CoreService} from '../services/core.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatRippleModule,
    MatSelectModule,
    MatInputModule,
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
    MatRippleModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    AngularFontAwesomeModule
  ],
  providers: [
    CoreService,
    {
      provide: MatDialogRef,
      useValue: {
        close: (o: any) => { }
      }
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
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
