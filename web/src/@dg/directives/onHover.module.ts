import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OnHoverDirective} from './onHover.directive';


@NgModule({
    declarations: [OnHoverDirective],
    imports: [
        CommonModule
    ],
    exports: [OnHoverDirective]
})
export class OnHoverModule {
}
