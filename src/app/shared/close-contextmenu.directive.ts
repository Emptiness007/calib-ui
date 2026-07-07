import {Directive, ElementRef, inject, output} from '@angular/core';

@Directive({
  selector: '[aviCloseContextmenu]',
  standalone: true,
  host: {
    '(document:mousedown)': 'actionIfOutside($event)',
    '(document:wheel)': 'actionIfOutside($event)',
    '(document:keydown.escape)': 'outside.emit()'
  }
})
export class CloseContextmenuDirective {
  private contextMenu = inject(ElementRef).nativeElement;
  readonly outside = output();


  constructor() { }

  actionIfOutside(event: MouseEvent | WheelEvent) {
    const targetElement = event.target as HTMLElement;
    if (this.contextMenu.contains(targetElement)) return;
    this.outside.emit();
  }
}
