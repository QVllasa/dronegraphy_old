import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { SecondsToMinutesPipe} from './seconds-to-minutes.pipe';


@NgModule({
  declarations: [SecondsToMinutesPipe],
  imports: [
    CommonModule
  ],
  exports: [SecondsToMinutesPipe]
})
export class SecondsToMinutesModule {
}
