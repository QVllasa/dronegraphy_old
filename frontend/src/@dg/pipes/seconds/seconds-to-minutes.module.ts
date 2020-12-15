import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { SecondsPipe} from './seconds-to-minutes.pipe';


@NgModule({
  declarations: [SecondsPipe],
  imports: [
    CommonModule
  ],
  exports: [SecondsPipe]
})
export class SecondsToMinutesModule {
}
