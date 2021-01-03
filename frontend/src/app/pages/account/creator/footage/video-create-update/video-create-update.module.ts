import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { VideoCreateUpdateComponent } from './video-create-update.component';
import { MatMenuModule } from '@angular/material/menu';
import { IconModule } from '@visurel/iconify-angular';
import { MatDividerModule } from '@angular/material/divider';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {NgxDropzoneModule} from "ngx-dropzone";
import {MatChipsModule} from "@angular/material/chips";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {NgBytesPipeModule} from "angular-pipes";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {SecondsToMinutesModule} from "../../../../../../@dg/pipes/seconds/seconds-to-minutes.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgxDropzoneModule,
    MatRadioModule,
    MatSelectModule,
    MatMenuModule,
    IconModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatChipsModule,
    NgBytesPipeModule,
    MatSlideToggleModule,
    SecondsToMinutesModule,
    MatProgressSpinnerModule
  ],
  declarations: [VideoCreateUpdateComponent],
  entryComponents: [VideoCreateUpdateComponent],
  exports: [VideoCreateUpdateComponent]
})
export class VideoCreateUpdateModule {
}
