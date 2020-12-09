import {animate, style, transition, trigger} from '@angular/animations';

export function fadeInRightAnimation(duration: number) {
  return trigger('fadeIn', [
    transition(':enter', [
      style({
        opacity: 0
      }),
      animate(`${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`, style({
        opacity: 1
      }))
    ])
  ]);
}

export const fadeIn400ms = fadeInRightAnimation(400);
