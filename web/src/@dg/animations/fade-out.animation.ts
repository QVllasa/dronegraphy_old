import {animate, style, transition, trigger} from '@angular/animations';

export function fadeInRightAnimation(duration: number) {
  return trigger('fadeOut', [
    transition(':leave', [
      style({
        opacity: 1
      }),
      animate(`${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`, style({
        opacity: 0
      }))
    ])
  ]);
}

export const fadeOut1000ms = fadeInRightAnimation(1000);
