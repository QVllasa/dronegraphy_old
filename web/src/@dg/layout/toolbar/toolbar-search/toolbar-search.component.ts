import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import icSearch from '@iconify/icons-ic/twotone-search';
import {SearchService} from '../../../services/search.service';

@Component({
  selector: 'dg-toolbar-search',
  templateUrl: './toolbar-search.component.html',
  styleUrls: ['./toolbar-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarSearchComponent implements OnInit {

  isOpen: boolean;
  input: string;


  @ViewChild('textfield', { read: ElementRef, static: true }) textfield: ElementRef;

  constructor(private cd: ChangeDetectorRef, private searchService: SearchService) {}

  ngOnInit() {
  }

  open() {
    this.isOpen = true;
    this.cd.markForCheck();

    setTimeout(() => {
      this.textfield.nativeElement.focus();
    }, 100);
  }

  onPressEnter(){
    this.searchService.onAddSearch(this.input);
    this.input = '';
  }

  close() {
    this.isOpen = false;
    this.cd.markForCheck();
  }
}
