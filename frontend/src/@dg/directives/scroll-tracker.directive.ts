import {Directive, HostListener} from '@angular/core';

@Directive({
    selector: '[scrollTracker]'
})
export class ScrollTrackerDirective {
@HostListener('window:scroll', ['$event'])
    onScroll(event) {
        // do tracking
        console.log('scrolled', event.target.scrollTop);
        // Listen to click events in the component
        const tracker = event.target;

        const limit = tracker.scrollHeight - tracker.clientHeight;
        console.log(event.target.scrollTop, limit);
        if (event.target.scrollTop === limit) {
            alert('end reached');
        }
    }

    constructor() {
    }
}
