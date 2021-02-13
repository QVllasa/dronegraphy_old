import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../../@dg/services/user.service";

@Component({
  selector: 'dg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  search: string;

  keywords: { category: string[], searchword: string[] } = {category: [], searchword: []};

  constructor(public userService: UserService) { }

  ngOnInit(): void {
  }

  onClick(){
    this.searchByKeywords(this.search);
    console.log(this.keywords);
    this.search = '';
  }



  searchByKeywords(ev) {
    const additionalKeys = ev.split(' ');
    additionalKeys.filter(e => String(e).trim());
    if (!additionalKeys.includes('')) {
      this.keywords.searchword.push(...additionalKeys);
    }
    this.keywords.searchword = this.keywords.searchword.filter((v, i) => this.keywords.searchword.indexOf(v) === i);
    // this.updateRoute();
  }

  searchByCategory(category) {
    this.keywords.category.includes(category) ? this.removeCategory(category) : this.keywords.category.push(category);
    // this.updateRoute();
  }

  removeCategory(category) {
    this.keywords.category.splice(this.keywords.category.indexOf(category), 1);
    // this.updateRoute();
  }

  removeKey(key) {
    this.keywords.searchword.splice(this.keywords.searchword.indexOf(key), 1);
    // this.updateRoute();
  }

  // updateRoute() {
  //   this.router.navigate(
  //       ['results'],
  //       {
  //         queryParams: {search: this.keywords.searchword, category: this.keywords.category}
  //       });
  // }

}
