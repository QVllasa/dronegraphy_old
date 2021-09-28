import {Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[fadeIn]'
})
export class OnHoverDirective implements OnInit {

  @Input() classToAdd: string;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.addClass(this.elRef.nativeElement, this.classToAdd);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeClass(this.elRef.nativeElement, this.classToAdd);
  }

  ngOnInit(): void {
    this.renderer.setStyle(this.elRef.nativeElement, 'opacity', 0);
  }

}
