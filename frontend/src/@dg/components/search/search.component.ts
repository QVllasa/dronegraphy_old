import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import icClose from '@iconify/icons-ic/twotone-close';
import {LayoutService} from '../../services/layout.service';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {filter} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {SearchService} from '../../services/search.service';

@UntilDestroy()
@Component({
  selector: 'dg-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  show$ = this.layoutService.searchOpen$;
  searchCtrl = new FormControl();
  icClose = icClose;

  search: string;



  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private layoutService: LayoutService,
              private searchService: SearchService) { }

  ngOnInit() {
  }

  onPressEnter(){
    this.searchService.onSearch(this.search);
    this.search = '';
  }

  ngOnDestroy(): void {
  }
}
